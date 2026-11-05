import { useEffect, useRef, useState } from "react";
import { ProjectMotion } from "./Projects";
import { useLang } from "../i18n/context";
import { FRONTISTA_LINKS, FRONTISTA_ROWS, type Accent, type FrontistaRow, type FrontistaTile, type Text } from "../data/frontista";

const ACCENTS: Record<Accent, { text: string; soft: string; line: string }> = {
    green: { text: "rgba(74,222,128,0.95)",  soft: "rgba(34,197,94,0.07)",  line: "rgba(34,197,94,0.28)" },
    cyan:  { text: "rgba(103,232,249,0.95)", soft: "rgba(6,182,212,0.07)",  line: "rgba(6,182,212,0.3)" },
    pink:  { text: "rgba(244,114,182,0.95)", soft: "rgba(225,48,108,0.07)", line: "rgba(225,48,108,0.3)" },
};

const ratioOf = (r: string) => { const [w, h] = r.split("/").map(Number); return w / h; };

/* Monta o conteúdo do tile só quando ele está na tela (animações e vídeos custam CPU) */
function useOnScreen<T extends Element>() {
    const ref = useRef<T>(null);
    const [on, setOn] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setOn(e.isIntersecting));
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, on] as const;
}

function useText() {
    const { lang } = useLang();
    return (v: Text | undefined) => (v === undefined ? undefined : typeof v === "string" ? v : v[lang]);
}

function VideoTile({ src, poster, on }: { src: string; poster?: string; on: boolean }) {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const v = ref.current;
        if (!v) return;
        if (on) v.play().catch(() => {});
        else v.pause();
    }, [on]);
    return (
        <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    );
}

function NoteTile({ tile }: { tile: Extract<FrontistaTile, { kind: "note" }> }) {
    const tx = useText();
    const a = ACCENTS[tile.accent ?? "green"];
    return (
        <div style={{ position: "absolute", inset: 0, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            background: `linear-gradient(160deg, ${a.soft}, rgba(3,7,5,0.96) 70%)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: a.line }} />)}
                <span style={{ marginLeft: 6, fontFamily: "monospace", fontSize: 9, letterSpacing: 1.5, color: a.text, opacity: 0.6, textTransform: "uppercase" }}>
                    {tx(tile.tag) ?? "frontista"}
                </span>
            </div>
            <p className={tile.display ? "ft-display" : "ft-note"} style={{ color: tile.display ? a.text : "rgba(225,240,230,0.88)", whiteSpace: "pre-line", margin: 0 }}>
                {tx(tile.text)}
            </p>
        </div>
    );
}

function Tile({ tile, height }: { tile: FrontistaTile; height: number }) {
    const tx = useText();
    const [ref, on] = useOnScreen<HTMLDivElement>();
    const width = Math.round(height * ratioOf(tile.ratio));
    const href = tile.kind === "video" || tile.kind === "image" ? tile.href : undefined;
    const title = tile.kind === "video" || tile.kind === "image" ? tx(tile.title) : undefined;
    const accent = tile.kind === "note" ? ACCENTS[tile.accent ?? "green"].line : "rgba(34,197,94,0.18)";

    const body = (
        <>
            {tile.kind === "motion" && on && <ProjectMotion id={tile.project} />}
            {tile.kind === "video" && <VideoTile src={tile.src} poster={tile.poster} on={on} />}
            {tile.kind === "image" && <img src={tile.src} alt={tx(tile.alt)} loading="lazy" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
            {tile.kind === "note" && <NoteTile tile={tile} />}
            {tile.kind === "video" && <span className="ft-rec"><i />REC</span>}
            {title && <span className="ft-caption">{title}</span>}
        </>
    );

    return (
        <div ref={ref} className="ft-tile" style={{ width, height, borderColor: accent }}>
            {href
                ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ position: "absolute", inset: 0 }}>{body}</a>
                : body}
        </div>
    );
}

function Row({ row, mobile, trackRef, onHover }: {
    row: FrontistaRow; mobile: boolean;
    trackRef: (el: HTMLDivElement | null) => void;
    onHover: (h: boolean) => void;
}) {
    const h = row.height[mobile ? 1 : 0];
    // Duas voltas da lista por cópia garantem largura de sobra em telas largas
    const set = [...row.tiles, ...row.tiles];
    return (
        <div className="ft-row" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
            <div ref={trackRef} className="ft-track">
                {[0, 1].map(copy => (
                    <div key={copy} className="ft-copy" aria-hidden={copy === 1 || undefined}>
                        {set.map((t, i) => <Tile key={i} tile={t} height={h} />)}
                    </div>
                ))}
            </div>
        </div>
    );
}

const TIKTOK_PATH = "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.15 8.15 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z";

function SocialLinks() {
    const { t } = useLang();
    return (
        <div className="relative z-10 mt-14 px-4 flex flex-col items-center">
            <p className="ft-handle">@frontista</p>
            <p className="mt-1 mb-6 text-xs tracking-[3px] uppercase text-zinc-500">{t("siga o processo", "follow the process")}</p>
            <div className="flex flex-wrap justify-center gap-3">
                <a href={FRONTISTA_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="ft-social ft-social-tt">
                    <span className="ft-badge ft-badge-tt" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="20" height="20"><path d={TIKTOK_PATH} fill="#25f4ee" transform="translate(-1 -1)" /><path d={TIKTOK_PATH} fill="#fe2c55" transform="translate(1 1)" /><path d={TIKTOK_PATH} fill="#fff" /></svg>
                    </span>
                    <span className="ft-social-text">
                        <b>TikTok</b>
                        <small>{t("vídeos curtos", "short videos")}</small>
                    </span>
                    <span className="ft-social-go">{t("Seguir", "Follow")} <span aria-hidden="true">→</span></span>
                </a>
                <a href={FRONTISTA_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="ft-social ft-social-ig">
                    <span className="ft-badge ft-badge-ig" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" fill="#fff" stroke="none" />
                        </svg>
                    </span>
                    <span className="ft-social-text">
                        <b>Instagram</b>
                        <small>{t("reels e bastidores", "reels & behind the scenes")}</small>
                    </span>
                    <span className="ft-social-go">{t("Seguir", "Follow")} <span aria-hidden="true">→</span></span>
                </a>
            </div>
        </div>
    );
}

export default function Frontista() {
    const { t } = useLang();
    const sectionRef = useRef<HTMLElement>(null);
    const tracks = useRef<(HTMLDivElement | null)[]>([]);
    const hovered = useRef<boolean[]>(FRONTISTA_ROWS.map(() => false));
    const [mobile, setMobile] = useState(false);
    const [still, setStill] = useState(false);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)");
        const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => { setMobile(mq.matches); setStill(rm.matches); };
        sync();
        mq.addEventListener("change", sync);
        rm.addEventListener("change", sync);
        return () => { mq.removeEventListener("change", sync); rm.removeEventListener("change", sync); };
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px 0px" });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    /* Loop das fileiras: velocidade base + empurrão da rolagem (rolar para cima inverte), inclinação com a velocidade */
    useEffect(() => {
        if (!inView || still) return;
        const offsets = FRONTISTA_ROWS.map(() => 0);
        const speedMul = FRONTISTA_ROWS.map(() => 1);
        let lastY = window.scrollY;
        let boost = 0;
        let last = performance.now();
        let raf = 0;

        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const y = window.scrollY;
            const dy = y - lastY;
            lastY = y;
            boost += (dy * 0.9 - boost) * 0.12;
            const skew = Math.max(-6, Math.min(6, -boost * 0.35));

            FRONTISTA_ROWS.forEach((row, i) => {
                const el = tracks.current[i];
                if (!el) return;
                // Com o mouse em cima a fileira só desacelera um pouco: continua andando
                speedMul[i] += ((hovered.current[i] ? 0.5 : 1) - speedMul[i]) * 0.08;
                offsets[i] += row.dir * (row.speed * dt * speedMul[i] + boost * (0.6 + (i % 3) * 0.25));
                const half = el.scrollWidth / 2;
                if (!half) return;
                const m = ((offsets[i] % half) + half) % half;
                el.style.transform = `translate3d(${-m}px,0,0) skewX(${skew * row.dir}deg)`;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, still]);

    return (
        <section ref={sectionRef} id="frontista" className={`relative overflow-hidden py-24${still ? " ft-still" : ""}`}>
            {/* Cabeçalho */}
            <div className="relative z-10 px-4 mb-12 text-center"
                style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(18px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                    <span className="text-emerald-400/40 font-light">&lt;</span>{" "}Frontista{" "}<span className="text-emerald-400/40 font-light">/&gt;</span>
                </h2>
                <p className="mt-3 text-xs tracking-widest text-emerald-500/40 uppercase">{t("// motions, bastidores e conteúdo", "// motion, behind the scenes & content")}</p>
                <p className="mt-5 max-w-xl mx-auto text-sm leading-relaxed text-zinc-400">
                    {t("O Frontista nasceu da fusão do meu sobrenome com o que eu faço: ", "Frontista blends my last name with what I do: ")}
                    <span className="text-emerald-400">{t("desenvolvimento front-end", "front-end development")}</span>.{" "}
                    {t("Lá eu documento minha evolução, mostro o processo dos projetos e explico programação para quem está começando.",
                       "That's where I document my growth, show how my projects are built and explain programming to beginners.")}
                </p>
            </div>

            {/* Fileiras */}
            <div className="ft-rows">
                {FRONTISTA_ROWS.map((row, i) => (
                    <Row key={i} row={row} mobile={mobile}
                        trackRef={el => { tracks.current[i] = el; }}
                        onHover={h => { hovered.current[i] = h; }} />
                ))}
            </div>

            <SocialLinks />

            <style>{`
                .ft-rows { display: flex; flex-direction: column; gap: 14px;
                    -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
                            mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent); }
                .ft-row { overflow: hidden; padding: 10px 0; }
                .ft-track { display: flex; width: max-content; will-change: transform; }
                .ft-copy { display: flex; gap: 14px; padding-right: 14px; }
                .ft-tile {
                    position: relative; flex-shrink: 0; overflow: hidden; border-radius: 14px;
                    border: 1px solid; background: rgba(3,7,5,0.96);
                    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
                }
                .ft-tile:hover { transform: scale(1.035); box-shadow: 0 0 28px rgba(34,197,94,0.18); z-index: 2; }
                .ft-rec {
                    position: absolute; top: 8px; left: 8px; z-index: 1;
                    display: flex; align-items: center; gap: 5px; padding: 2px 7px; border-radius: 6px;
                    font: 700 9px/1.4 monospace; letter-spacing: 1.5px; color: rgba(255,255,255,0.85);
                    background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
                }
                .ft-rec i { width: 6px; height: 6px; border-radius: 50%; background: #f43f5e; animation: ftRec 1.2s ease-in-out infinite; }
                @keyframes ftRec { 50% { opacity: 0.25; } }
                .ft-caption {
                    position: absolute; left: 0; right: 0; bottom: 0; padding: 26px 12px 10px;
                    font-size: 12px; font-weight: 600; line-height: 1.25; color: #fff;
                    background: linear-gradient(transparent, rgba(0,0,0,0.78));
                }
                .ft-note { font-size: 14px; line-height: 1.5; font-family: monospace; }
                .ft-display { font-family: "Bebas Neue", sans-serif; font-size: 34px; line-height: 0.95; letter-spacing: 1px; }
                @media (max-width: 640px) {
                    .ft-rows, .ft-copy { gap: 10px; }
                    .ft-copy { padding-right: 10px; }
                    .ft-note { font-size: 11px; }
                    .ft-display { font-size: 24px; }
                    .ft-caption { font-size: 10px; padding: 18px 8px 7px; }
                }

                /* Sem animação: as fileiras viram faixas roláveis com o dedo ou o trackpad */
                .ft-still .ft-row { overflow-x: auto; scrollbar-width: none; }
                .ft-still .ft-copy[aria-hidden] { display: none; }

                /* Perfis */
                .ft-handle {
                    font-family: "Bebas Neue", sans-serif; font-size: clamp(40px, 7vw, 64px); line-height: 1; letter-spacing: 2px;
                    background: linear-gradient(90deg, #34d399, #22d3ee 50%, #f472b6); -webkit-background-clip: text; background-clip: text; color: transparent;
                }
                .ft-social {
                    --brand: 34,211,238;
                    display: flex; align-items: center; gap: 14px; min-width: 268px;
                    padding: 10px 18px 10px 10px; border-radius: 999px; text-decoration: none; color: #e4e4e7;
                    background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.09);
                    transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
                }
                .ft-social-ig { --brand: 225,48,108; }
                .ft-social:hover, .ft-social:focus-visible {
                    transform: translateY(-3px); border-color: rgba(var(--brand),0.6);
                    background: rgba(var(--brand),0.06); box-shadow: 0 10px 30px -10px rgba(var(--brand),0.55);
                }
                .ft-badge {
                    width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
                    display: grid; place-items: center; transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
                }
                .ft-social:hover .ft-badge { transform: rotate(-10deg) scale(1.08); }
                .ft-badge-tt { background: #000; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); }
                .ft-badge-ig { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285aeb 90%); }
                .ft-social-text { display: flex; flex-direction: column; flex: 1; line-height: 1.2; }
                .ft-social-text b { font-size: 15px; font-weight: 600; }
                .ft-social-text small { font-size: 11px; color: rgba(161,161,170,0.9); }
                .ft-social-go { font-size: 12px; font-weight: 600; color: rgb(var(--brand)); white-space: nowrap; }
                .ft-social-go span { display: inline-block; transition: transform 0.25s ease; }
                .ft-social:hover .ft-social-go span { transform: translateX(4px); }
            `}</style>
        </section>
    );
}
