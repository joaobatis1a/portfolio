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

/* Um único IntersectionObserver para todos os tiles.
   "near": o tile está na tela (monta a animação); "focus": está bem visível (vídeo toca). */
type Watch = (near: boolean, focus: boolean) => void;
const watchers = new Map<Element, Watch>();
let sharedObserver: IntersectionObserver | null = null;
function observe(el: Element, cb: Watch) {
    if (!sharedObserver) {
        sharedObserver = new IntersectionObserver(entries => {
            for (const e of entries) watchers.get(e.target)?.(e.isIntersecting, e.intersectionRatio >= 0.6);
        }, { threshold: [0, 0.6], rootMargin: "0px 160px 0px 160px" });
    }
    watchers.set(el, cb);
    sharedObserver.observe(el);
    return () => { watchers.delete(el); sharedObserver?.unobserve(el); };
}

function useOnScreen<T extends Element>() {
    const ref = useRef<T>(null);
    const [state, setState] = useState({ near: false, focus: false });
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        return observe(el, (near, focus) =>
            setState(prev => (prev.near === near && prev.focus === focus ? prev : { near, focus })));
    }, []);
    return [ref, state] as const;
}

function useText() {
    const { lang } = useLang();
    return (v: Text | undefined) => (v === undefined ? undefined : typeof v === "string" ? v : v[lang]);
}

/* Vagas: decodificar vídeo e redesenhar animações é o que mais pesa no carrossel.
   Quem quer ficar ativo entra na fila; quando uma vaga abre, o próximo da fila ganha. */
function createSlots(max: number) {
    const granted = new Set<number>();
    const queue: number[] = [];
    const subs = new Map<number, (g: boolean) => void>();
    let uid = 0;
    const pump = () => {
        while (granted.size < max && queue.length) {
            const id = queue.shift()!;
            granted.add(id);
            subs.get(id)?.(true);
        }
    };
    const release = (id: number) => {
        if (granted.delete(id)) subs.get(id)?.(false);
        const i = queue.indexOf(id);
        if (i >= 0) queue.splice(i, 1);
        pump();
    };
    return {
        join(cb: (g: boolean) => void) { const id = ++uid; subs.set(id, cb); return id; },
        want(id: number) { if (!granted.has(id) && !queue.includes(id)) { queue.push(id); pump(); } },
        release,
        leave(id: number) { subs.delete(id); release(id); },
    };
}
type Slots = ReturnType<typeof createSlots>;
const videoSlots = createSlots(2);
const motionSlots = createSlots(3);

function useSlot(slots: Slots, want: boolean) {
    const [granted, setGranted] = useState(false);
    const idRef = useRef(0);
    useEffect(() => {
        const id = slots.join(setGranted);
        idRef.current = id;
        return () => slots.leave(id);
    }, [slots]);
    useEffect(() => {
        const id = idRef.current;
        if (!id) return;
        if (want) slots.want(id); else slots.release(id);
    }, [want, slots]);
    return granted;
}

/* Vídeo: a capa é uma imagem; o <video> só existe enquanto o tile tem vaga */
function VideoTile({ src, poster, focus }: { src: string; poster?: string; focus: boolean }) {
    const playing = useSlot(videoSlots, focus);
    const fill = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } as const;
    return (
        <>
            {poster && <img src={poster} alt="" loading="lazy" decoding="async" draggable={false} style={fill} />}
            {playing && <video src={src} poster={poster} autoPlay muted loop playsInline disablePictureInPicture disableRemotePlayback style={fill} />}
        </>
    );
}

/* Animação de projeto: congelada num quadro bonito; só roda (15 fps) enquanto tem vaga */
function MotionTile({ project, focus }: { project: string; focus: boolean }) {
    const animate = useSlot(motionSlots, focus);
    return <ProjectMotion id={project} fps={animate ? 15 : 0} />;
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
    const [ref, { near, focus }] = useOnScreen<HTMLDivElement>();
    const width = Math.round(height * ratioOf(tile.ratio));
    const href = tile.kind === "video" || tile.kind === "image" ? tile.href : undefined;
    const title = tile.kind === "video" || tile.kind === "image" ? tx(tile.title) : undefined;
    const accent = tile.kind === "note" ? ACCENTS[tile.accent ?? "green"].line : "rgba(34,197,94,0.18)";

    const body = (
        <>
            {tile.kind === "motion" && near && <MotionTile project={tile.project} focus={focus} />}
            {tile.kind === "video" && <VideoTile src={tile.src} poster={tile.poster} focus={focus} />}
            {tile.kind === "image" && <img src={tile.src} alt={tx(tile.alt)} loading="lazy" decoding="async" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
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

function Row({ row, mobile, vw, trackRef, onHover }: {
    row: FrontistaRow; mobile: boolean; vw: number;
    trackRef: (el: HTMLDivElement | null) => void;
    onHover: (h: boolean) => void;
}) {
    const h = row.height[mobile ? 1 : 0];
    // A lista só se repete até uma cópia cobrir a tela inteira (a trilha tem 2 cópias para o laço sem emenda)
    const gap = mobile ? 10 : 14;
    const copyW = row.tiles.reduce((sum, t) => sum + Math.round(h * ratioOf(t.ratio)) + gap, 0);
    const repeat = Math.max(1, Math.ceil(vw / copyW));
    const set = Array.from({ length: repeat }, () => row.tiles).flat();
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
    const links = [
        { href: FRONTISTA_LINKS.tiktok, name: "TikTok", note: t("vídeos curtos", "short videos"),
          icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d={TIKTOK_PATH} /></svg> },
        { href: FRONTISTA_LINKS.instagram, name: "Instagram", note: t("reels e bastidores", "reels & behind the scenes"),
          icon: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg> },
    ];
    return (
        <div className="relative z-10 mt-14 px-4 flex flex-col items-center">
            <p className="text-xs tracking-widest text-blue-400/50 uppercase">{t("// sintonize o canal", "// tune in")}</p>
            <div className="mt-4 grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-3">
                {links.map(l => (
                    <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="ft-chan holo-blue">
                        <span className="ft-chan-ico" aria-hidden="true">{l.icon}</span>
                        <span className="ft-chan-text">
                            <b>{l.name}</b>
                            <small>@frontista · {l.note}</small>
                        </span>
                        <span className="ft-chan-go" aria-hidden="true">↗</span>
                    </a>
                ))}
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
    const [vw, setVw] = useState(() => (typeof window === "undefined" ? 1440 : window.innerWidth));

    useEffect(() => {
        let raf = 0;
        const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setVw(window.innerWidth)); };
        window.addEventListener("resize", onResize);
        return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
    }, []);

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
        // Com as fileiras cobrindo a tela, o fundo de estrelas congela (libera a GPU para o carrossel)
        const freeze = new IntersectionObserver(([e]) =>
            window.dispatchEvent(new CustomEvent("starfield-freeze", { detail: e.isIntersecting })), { rootMargin: "-30% 0px -30% 0px" });
        const rows = sectionRef.current?.querySelector(".ft-rows");
        if (rows) freeze.observe(rows);
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => { obs.disconnect(); freeze.disconnect(); window.dispatchEvent(new CustomEvent("starfield-freeze", { detail: false })); };
    }, []);

    /* Loop das fileiras: velocidade base + empurrão da rolagem (rolar para cima inverte).
       Só translate3d (camada composta, sem repintar) e a meia-largura fica em cache. */
    useEffect(() => {
        if (!inView || still) return;
        const offsets = FRONTISTA_ROWS.map(() => 0);
        const speedMul = FRONTISTA_ROWS.map(() => 1);
        const halves = FRONTISTA_ROWS.map(() => 0);
        let lastY = window.scrollY;
        let boost = 0;
        let last = performance.now();
        let frame = 0;
        let raf = 0;

        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const y = window.scrollY;
            const dy = y - lastY;
            lastY = y;
            boost += (dy * 0.9 - boost) * 0.12;
            const remeasure = frame++ % 45 === 0;

            FRONTISTA_ROWS.forEach((row, i) => {
                const el = tracks.current[i];
                if (!el) return;
                // Com o mouse em cima a fileira só desacelera um pouco: continua andando
                speedMul[i] += ((hovered.current[i] ? 0.5 : 1) - speedMul[i]) * 0.08;
                offsets[i] += row.dir * (row.speed * dt * speedMul[i] + boost * (0.6 + (i % 3) * 0.25));
                if (remeasure || !halves[i]) halves[i] = el.scrollWidth / 2;
                const half = halves[i];
                if (!half) return;
                const m = ((offsets[i] % half) + half) % half;
                el.style.transform = `translate3d(${-m.toFixed(1)}px,0,0)`;
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
                    <Row key={i} row={row} mobile={mobile} vw={vw}
                        trackRef={el => { tracks.current[i] = el; }}
                        onHover={h => { hovered.current[i] = h; }} />
                ))}
            </div>

            <SocialLinks />

            <style>{`
                .ft-rows { position: relative; display: flex; flex-direction: column; gap: 14px; }
                .ft-rows::before, .ft-rows::after {
                    content: ""; position: absolute; top: 0; bottom: 0; width: 7%; z-index: 3; pointer-events: none;
                }
                .ft-rows::before { left: 0; background: linear-gradient(90deg, #000, transparent); }
                .ft-rows::after { right: 0; background: linear-gradient(270deg, #000, transparent); }
                .ft-row { overflow: hidden; padding: 10px 0; contain: layout paint; }
                .ft-track { display: flex; width: max-content; will-change: transform; }
                .ft-copy { display: flex; gap: 14px; padding-right: 14px; }
                .ft-tile {
                    position: relative; flex-shrink: 0; overflow: hidden; border-radius: 14px;
                    border: 1px solid; background: rgba(3,7,5,0.96); contain: layout paint style;
                    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
                }
                .ft-tile:hover { transform: scale(1.035); box-shadow: 0 0 28px rgba(34,197,94,0.18); z-index: 2; }
                .ft-rec {
                    position: absolute; top: 8px; left: 8px; z-index: 1;
                    display: flex; align-items: center; gap: 5px; padding: 2px 7px; border-radius: 6px;
                    font: 700 9px/1.4 monospace; letter-spacing: 1.5px; color: rgba(255,255,255,0.85);
                    background: rgba(0,0,0,0.65);
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

                /* Perfis: holograma azul, como os cartões de Habilidades */
                .ft-chan { display: flex; align-items: center; gap: 14px; padding: 14px 16px; text-decoration: none; }
                .ft-chan > * { position: relative; z-index: 1; }
                .ft-chan:hover { transform: translateY(-2px); }
                .ft-chan-ico {
                    width: 40px; height: 40px; flex-shrink: 0; display: grid; place-items: center; border-radius: 12px;
                    color: rgba(120,210,255,0.95); background: rgba(0,100,255,0.1); border: 1px solid rgba(0,149,255,0.3);
                    box-shadow: inset 0 0 12px rgba(0,100,255,0.1); transition: color 0.25s ease, box-shadow 0.25s ease;
                }
                .ft-chan:hover .ft-chan-ico { color: #fff; box-shadow: inset 0 0 14px rgba(0,149,255,0.3), 0 0 14px rgba(0,149,255,0.35); }
                .ft-chan-text { display: flex; flex-direction: column; flex: 1; min-width: 0; line-height: 1.3; }
                .ft-chan-text b { font-size: 15px; font-weight: 700; letter-spacing: 0.5px; color: rgba(120,210,255,0.95); text-shadow: 0 0 12px rgba(0,180,255,0.6); }
                .ft-chan-text small { font-family: monospace; font-size: 11px; color: rgba(150,210,255,0.6); }
                .ft-chan-go { font-size: 16px; color: rgba(0,200,255,0.75); transition: transform 0.25s ease; }
                .ft-chan:hover .ft-chan-go { transform: translate(3px, -3px); }
            `}</style>
        </section>
    );
}
