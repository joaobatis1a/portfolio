import { useEffect, useRef, useState } from "react";
import { ProjectMotion } from "./Projects";
import { FRONTISTA_LINKS, FRONTISTA_ROWS, type Accent, type FrontistaRow, type FrontistaTile } from "../data/frontista";

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
    const a = ACCENTS[tile.accent ?? "green"];
    return (
        <div style={{ position: "absolute", inset: 0, padding: "14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between",
            background: `linear-gradient(160deg, ${a.soft}, rgba(3,7,5,0.96) 70%)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: a.line }} />)}
                <span style={{ marginLeft: 6, fontFamily: "monospace", fontSize: 9, letterSpacing: 1.5, color: a.text, opacity: 0.6, textTransform: "uppercase" }}>
                    {tile.tag ?? "frontista"}
                </span>
            </div>
            <p className={tile.display ? "ft-display" : "ft-note"} style={{ color: tile.display ? a.text : "rgba(225,240,230,0.88)", whiteSpace: "pre-line", margin: 0 }}>
                {tile.text}
            </p>
        </div>
    );
}

function Tile({ tile, height }: { tile: FrontistaTile; height: number }) {
    const [ref, on] = useOnScreen<HTMLDivElement>();
    const width = Math.round(height * ratioOf(tile.ratio));
    const href = tile.kind === "video" || tile.kind === "image" ? tile.href : undefined;
    const accent = tile.kind === "note" ? ACCENTS[tile.accent ?? "green"].line : "rgba(34,197,94,0.18)";

    const body = (
        <>
            {tile.kind === "motion" && on && <ProjectMotion id={tile.project} />}
            {tile.kind === "video" && <VideoTile src={tile.src} poster={tile.poster} on={on} />}
            {tile.kind === "image" && <img src={tile.src} alt={tile.alt} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
            {tile.kind === "note" && <NoteTile tile={tile} />}
            {tile.kind === "video" && tile.title && (
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 12px 10px", fontSize: 12, fontWeight: 600, color: "white",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.75))" }}>{tile.title}</span>
            )}
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

export default function Frontista() {
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
                speedMul[i] += ((hovered.current[i] ? 0.12 : 1) - speedMul[i]) * 0.08;
                offsets[i] += row.dir * (row.speed * dt * speedMul[i] + boost * (0.6 + i * 0.25));
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
                <p className="mt-3 text-xs tracking-widest text-emerald-500/40 uppercase">// motions, bastidores e conteúdo</p>
                <p className="mt-5 max-w-xl mx-auto text-sm leading-relaxed text-zinc-400">
                    O Frontista nasceu da fusão do meu sobrenome com o que eu faço: <span className="text-emerald-400">desenvolvimento front-end</span>.
                    Lá eu documento minha evolução, mostro o processo dos projetos e explico programação para quem está começando.
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

            {/* Perfis */}
            <div className="relative z-10 mt-12 px-4 flex flex-col sm:flex-row items-stretch justify-center gap-3">
                <a href={FRONTISTA_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="ft-cta ft-cta-tiktok">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.15 8.15 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z"/>
                    </svg>
                    <span className="ft-cta-label">TikTok</span>
                    <span className="ft-cta-handle">@frontista ›</span>
                </a>
                <a href={FRONTISTA_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="ft-cta ft-cta-insta">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="ft-cta-label">Instagram</span>
                    <span className="ft-cta-handle">@frontista ›</span>
                </a>
            </div>

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
                .ft-note { font-size: 14px; line-height: 1.5; font-family: monospace; }
                .ft-display { font-family: "Bebas Neue", sans-serif; font-size: 34px; line-height: 0.95; letter-spacing: 1px; }
                @media (max-width: 640px) {
                    .ft-rows, .ft-copy { gap: 10px; }
                    .ft-copy { padding-right: 10px; }
                    .ft-note { font-size: 11px; }
                    .ft-display { font-size: 24px; }
                }

                /* Sem animação: as fileiras viram faixas roláveis com o dedo ou o trackpad */
                .ft-still .ft-row { overflow-x: auto; scrollbar-width: none; }
                .ft-still .ft-copy[aria-hidden] { display: none; }

                .ft-cta {
                    display: flex; align-items: center; gap: 12px; min-width: 240px;
                    padding: 12px 18px; border-radius: 12px; text-decoration: none;
                    color: rgba(200,240,220,0.8); transition: all 0.22s ease;
                }
                .ft-cta-label { flex: 1; font-family: monospace; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
                .ft-cta-handle { font-family: monospace; font-size: 11px; opacity: 0.55; }
                .ft-cta-tiktok { border: 1px solid rgba(6,182,212,0.3); background: rgba(6,182,212,0.05); }
                .ft-cta-tiktok:hover, .ft-cta-tiktok:focus-visible { border-color: rgba(6,182,212,0.85); color: rgb(34,211,238); box-shadow: 0 0 22px rgba(6,182,212,0.3); }
                .ft-cta-insta { border: 1px solid rgba(225,48,108,0.3); background: rgba(225,48,108,0.05); }
                .ft-cta-insta:hover, .ft-cta-insta:focus-visible { border-color: rgba(225,48,108,0.85); color: rgb(244,114,182); box-shadow: 0 0 22px rgba(225,48,108,0.3); }
            `}</style>
        </section>
    );
}
