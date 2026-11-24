import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLang } from "../i18n/context";
import { PROJECTS_TOTAL } from "../data/projects";

/* ── Frase com efeito dominó (o mesmo do hero do Praxis): cada letra é uma peça articulada na base ── */
const lerp = (a: number[], b: number[], k: number) => "#" + a.map((v, i) => Math.round(v + (b[i] - v) * k).toString(16).padStart(2, "0")).join("");
const G1 = [0x34, 0xd3, 0x99];
const G2 = [0x22, 0xd3, 0xee];

function Line({ text, start, shown, away, grad }: { text: string; start: number; shown: boolean; away: boolean; grad?: boolean }) {
    const total = text.replace(/ /g, "").length;
    let n = start;
    let k = 0;
    return (
        <span className="block">
            {text.split(" ").map((word, wi) => (
                <span key={wi}>
                    {wi > 0 && " "}
                    <span className="abt-wd">
                        <span className="abt-wi" style={{ animationDelay: `${-wi * 0.55}s` }}>
                            {[...word].map((ch, ci) => {
                                const i = n++;
                                const color = grad ? lerp(G1, G2, k++ / Math.max(1, total - 1)) : "#fff";
                                return (
                                    <span key={ci} className="abt-ch" style={{
                                        color,
                                        transform: shown ? "perspective(900px) rotateX(0deg)" : `perspective(900px) rotateX(${away ? 92 : -92}deg)`,
                                        opacity: shown ? 1 : 0,
                                        transition: `transform 900ms cubic-bezier(.68,-0.45,.27,1.45) ${i * 32 + (shown ? 380 : 0)}ms, opacity 250ms ease ${i * 32 + (shown ? 380 : 420)}ms`,
                                    } as CSSProperties}>{ch}</span>
                                );
                            })}
                        </span>
                    </span>
                </span>
            ))}
        </span>
    );
}

const PHRASES = {
    pt: [
        ["Dev front-end em construção,", "com projetos reais pra mostrar."],
        ["Do Figma ao código,", "eu entrego o projeto inteiro."],
    ],
    en: [
        ["A front-end dev in the making,", "with real projects to show."],
        ["From Figma to code,", "I deliver the whole project."],
    ],
};

function Headline({ inView }: { inView: boolean }) {
    const { lang, t } = useLang();
    const [idx, setIdx] = useState(0);
    const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    useEffect(() => {
        const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
        const on = () => setReduced(rm.matches);
        rm.addEventListener("change", on);
        return () => rm.removeEventListener("change", on);
    }, []);

    useEffect(() => {
        if (!inView || reduced) return;
        const id = setInterval(() => setIdx(i => (i + 1) % 2), 4600);
        return () => clearInterval(id);
    }, [inView, reduced]);

    const first = t("Oi, eu sou o João.", "Hi, I'm João.");
    const phrases = PHRASES[lang];
    return (
        <h3 className="abt-hl" aria-label={`${first} ${phrases[0].join(" ")} ${phrases[1].join(" ")}`}>
            <span aria-hidden="true" className="block">
                <Line text={first} start={0} shown={inView} away={false} />
            </span>
            <span aria-hidden="true" className="abt-swap">
                {phrases.map((p, pi) => {
                    const on = inView && (reduced ? pi === 0 : idx === pi);
                    return (
                        <span key={pi} className="abt-ph">
                            <Line text={p[0]} start={0} shown={on} away={pi === 0} grad />
                            <Line text={p[1]} start={p[0].replace(/ /g, "").length} shown={on} away={pi === 0} />
                        </span>
                    );
                })}
            </span>
        </h3>
    );
}

const AWARDS = [
    { name: "Limpattack", pos: { pt: "1º", en: "1st" }, logo: "/logos/projects/limpattack.png", size: 92, glow: "rgba(80,140,255,.4)", d: 7, dl: 0, cd: 5.3, cl: -1.1, round: true },
    { name: "P.O.N.T.E", pos: { pt: "1º", en: "1st" }, logo: "/logos/projects/ponte.png", size: 108, glow: "rgba(255,120,60,.36)", d: 8.5, dl: -2.2, cd: 6.2, cl: -3.4, round: false },
    { name: "Benevo", pos: { pt: "2º", en: "2nd" }, logo: "/logos/projects/benevo.svg", size: 92, glow: "rgba(120,170,255,.38)", d: 6.4, dl: -4, cd: 4.8, cl: -2.2, round: false },
];

function About() {
    const { t } = useLang();
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="relative px-6 py-24 flex justify-center">
            <div className={`abt${inView ? " is-in" : ""} relative z-10 w-full max-w-5xl`}>
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent text-center">
                    <span className="text-emerald-400/40 font-light">&lt;</span>{" "}{t("Sobre", "About")}{" "}<span className="text-emerald-400/40 font-light">/&gt;</span>
                </h2>
                <p className="mt-4 mb-12 mx-auto max-w-xl text-center text-sm leading-relaxed text-zinc-400">{t("Quem está por trás do código.", "The person behind the code.")}</p>

                <div className="abt-top">
                    {/* Foto: inclina com o mouse e o brilho acompanha o cursor; sem mouse, balança devagar */}
                    <div
                        className="abt-phw"
                        onMouseMove={e => {
                            const el = e.currentTarget;
                            const r = el.getBoundingClientRect();
                            const x = (e.clientX - r.left) / r.width - 0.5;
                            const y = (e.clientY - r.top) / r.height - 0.5;
                            const card = el.querySelector<HTMLElement>(".abt-tilt");
                            const glow = el.querySelector<HTMLElement>(".abt-gl");
                            if (card) card.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.04)`;
                            if (glow) { glow.style.left = `${(x + 0.5) * 100}%`; glow.style.top = `${(y + 0.5) * 100}%`; glow.style.opacity = "1"; }
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget;
                            const card = el.querySelector<HTMLElement>(".abt-tilt");
                            const glow = el.querySelector<HTMLElement>(".abt-gl");
                            if (card) card.style.transform = "";
                            if (glow) glow.style.opacity = "0";
                        }}
                    >
                        <div className="abt-bd" />
                        <div className="abt-idle">
                            <div className="abt-tilt">
                                <img src="/foto_perfil.jpeg" alt={t("Foto de João Batista Neto", "Photo of João Batista Neto")} draggable={false} />
                                <div className="abt-gl" />
                                <div className="abt-sc" />
                            </div>
                        </div>
                    </div>

                    <div className="abt-text">
                        <Headline inView={inView} />
                        <p className="abt-sub">
                            {t("Tenho ", "I'm ")}<b>{t("20 anos", "20")}</b>{t(", sou de ", ", from ")}<b>Paulista, PE</b>
                            {t(" e cuido do projeto inteiro: do ", " and I take on the whole project: from the ")}<b>{t("layout no Figma", "Figma layout")}</b>
                            {t(" até o ", " to the ")}<b>{t("site no ar", "live site")}</b>
                            {t(", com React e Next.js, de olho no detalhe que quem usa percebe. Estudo ", ", with React and Next.js, with an eye for the details users notice. I study ")}
                            <b>{t("Análise e Desenvolvimento de Sistemas", "Systems Analysis and Development")}</b>
                            {t(" na UNIFAFIRE desde 2025 e já publiquei ", " at UNIFAFIRE since 2025 and have published ")}{PROJECTS_TOTAL}{t(" projetos, ", " projects, ")}
                            <b className="abt-gd">{t("três deles premiados", "three of them award-winning")}</b>.
                        </p>
                    </div>
                </div>

                {/* Premiados: só as logos e as legendas flutuam */}
                <div className="abt-awards">
                    <div className="abt-ah"><h4 className="abt-gold">{t("3 projetos premiados pelas bancas da UNIFAFIRE", "3 award-winning projects, judged by UNIFAFIRE panels")}</h4></div>
                    <div className="abt-stage">
                        {AWARDS.map((a, i) => (
                            <div key={a.name} className="abt-aw" style={{ transitionDelay: `${i * 0.2 + 0.5}s` }}>
                                <div className="abt-zone">
                                    <div className="abt-fl" style={{ animationDuration: `${a.d}s`, animationDelay: `${a.dl}s` }}>
                                        <span className="abt-lgw" style={{ ["--s" as string]: `${a.size}px`, ["--g" as string]: a.glow } as CSSProperties}>
                                            <img src={a.logo} alt={`Logo ${a.name}`} draggable={false} style={a.round ? { borderRadius: "22%" } : undefined} />
                                        </span>
                                    </div>
                                </div>
                                <div className="abt-cap" style={{ animationDuration: `${a.cd}s`, animationDelay: `${a.cl}s` }}>
                                    <i>{t(a.pos.pt, a.pos.en)}</i><span>{a.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .abt-top { display: grid; gap: 30px; align-items: center; }
                .abt-top .abt-phw { order: -1; justify-self: center; }
                @media (min-width: 860px) { .abt-top { grid-template-columns: minmax(0, 1fr) auto; gap: 56px; } .abt-top .abt-phw { order: 1; } }
                .abt-text { display: grid; gap: 28px; min-width: 0; max-width: 640px; }

                .abt-phw { position: relative; perspective: 800px; flex-shrink: 0; }
                .abt-bd { position: absolute; inset: -3px; border-radius: 18px; background: linear-gradient(135deg,#34d399,#22d3ee,#4ade80); opacity: .6; filter: blur(5px); transition: opacity .4s; }
                .abt-phw:hover .abt-bd { opacity: 1; }
                .abt-idle { animation: abtIdle 7s ease-in-out infinite; transform-style: preserve-3d; }
                .abt-phw:hover .abt-idle { animation-play-state: paused; }
                @keyframes abtIdle { 0%,100% { transform: rotateY(-5deg) rotateX(2deg); } 50% { transform: rotateY(5deg) rotateX(-2deg); } }
                .abt-tilt { position: relative; border-radius: 16px; overflow: hidden; transition: transform .15s ease-out; transform-style: preserve-3d; will-change: transform; }
                .abt-tilt img { display: block; width: 224px; height: 288px; max-width: 100%; object-fit: cover; object-position: top; border-radius: 16px; }
                @media (min-width: 860px) { .abt-tilt img { width: 256px; height: 320px; } }
                .abt-gl { position: absolute; width: 130px; height: 130px; border-radius: 50%; transform: translate(-50%,-50%); pointer-events: none;
                    background: radial-gradient(circle, rgba(255,255,255,.2), transparent 70%); opacity: 0; transition: opacity .2s; left: 50%; top: 50%; }
                .abt-sc { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.06) 3px, rgba(0,0,0,.06) 4px); }

                .abt-hl { margin: 0; font-weight: 700; font-size: clamp(1.8rem, 4.4vw, 2.7rem); line-height: 1.14; letter-spacing: -.03em; color: #fff; }
                .abt-swap { display: grid; }
                .abt-ph { grid-area: 1 / 1; pointer-events: none; }
                .abt-wd { display: inline-block; white-space: nowrap; }
                .abt-wi { display: inline-block; animation: abtBob 5.2s ease-in-out infinite; }
                @keyframes abtBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-.08em); } }
                .abt-ch { display: inline-block; transform-origin: 50% 85%; backface-visibility: hidden; -webkit-backface-visibility: hidden; }

                .abt-sub { margin: 0; color: rgba(214,220,224,.88); font-size: clamp(14.5px, 2.2vw, 16.5px); line-height: 1.8; max-width: 62ch; }
                .abt-sub b { font-weight: 600; background: linear-gradient(90deg,#34d399,#22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }
                .abt-sub b.abt-gd { font-weight: 700; background: linear-gradient(90deg,#fde68a,#f59e0b); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 10px rgba(245,158,11,.4)); }

                .abt-awards { margin-top: 44px; display: grid; gap: 30px; }
                .abt-ah { display: flex; align-items: center; gap: 14px; }
                .abt-ah::after { content: ""; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(253,224,71,.55), transparent); }
                .abt-gold { margin: 0; font-weight: 700; font-size: clamp(1.25rem, 3.2vw, 1.75rem); line-height: 1.15; letter-spacing: -.01em;
                    background: linear-gradient(90deg,#fde68a,#f59e0b,#fde68a); background-size: 220% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
                    filter: drop-shadow(0 0 14px rgba(245,158,11,.35)); animation: abtShm 6s linear infinite; }
                @keyframes abtShm { to { background-position: -200% 0; } }
                .abt-stage { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; }
                .abt-aw { display: grid; justify-items: center; gap: 10px; text-align: center; opacity: 0; transform: translateY(24px) scale(.92);
                    transition: opacity .8s, transform .9s cubic-bezier(.3,1.3,.5,1); }
                .abt.is-in .abt-aw { opacity: 1; transform: none; }
                .abt-zone { display: grid; place-items: center; height: 158px; width: 100%; }
                .abt-fl { display: grid; justify-items: center; animation: abtFl 7s ease-in-out infinite; }
                @keyframes abtFl { 0%,100% { transform: translate(0,0) rotate(-2deg); } 25% { transform: translate(8px,-12px) rotate(1.5deg); } 50% { transform: translate(-5px,-20px) rotate(2.5deg); } 75% { transform: translate(-9px,-7px) rotate(-1deg); } }
                .abt-lgw { position: relative; display: grid; place-items: center; width: var(--s); height: var(--s); cursor: pointer; transition: transform .3s cubic-bezier(.3,1.5,.5,1); }
                .abt-lgw::before { content: ""; position: absolute; inset: -26%; border-radius: 50%; z-index: -1; background: radial-gradient(circle, var(--g), transparent 66%); animation: abtGl 4s ease-in-out infinite; }
                @keyframes abtGl { 50% { opacity: .55; transform: scale(1.12); } }
                .abt-lgw img { display: block; width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 12px 16px rgba(0,0,0,.6)); }
                .abt-lgw:hover { transform: scale(1.14) rotate(-3deg); }
                .abt-cap { display: flex; align-items: baseline; justify-content: center; gap: 8px; font-weight: 600; font-size: clamp(13px, 1.6vw, 16px); line-height: 1.2; color: #fff; animation: abtCap 5.5s ease-in-out infinite; }
                @keyframes abtCap { 0%,100% { transform: translate(0,0); } 33% { transform: translate(5px,-7px); } 66% { transform: translate(-5px,-3px); } }
                .abt-cap i { font-style: normal; font-weight: 700; font-size: clamp(1.3rem, 2.6vw, 1.9rem); line-height: 1;
                    background: linear-gradient(180deg,#fde68a,#f59e0b); -webkit-background-clip: text; background-clip: text; color: transparent; filter: drop-shadow(0 0 10px rgba(245,158,11,.35)); }
                @media (max-width: 600px) {
                    .abt-zone { height: 112px; } .abt-aw { --s: 60px; } .abt-lgw { --s: 60px !important; }
                    .abt-cap { flex-direction: column; align-items: center; gap: 2px; } .abt-cap i { font-size: 1.25rem; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .abt-idle, .abt-wi, .abt-fl, .abt-cap, .abt-gold, .abt-lgw::before { animation: none; }
                    .abt-aw { opacity: 1; transform: none; }
                }
            `}</style>
        </section>
    );
}

export default About;
