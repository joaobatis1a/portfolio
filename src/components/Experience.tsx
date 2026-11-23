import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/context";

/* ══ DURAÇÃO DESDE NOV/2025 ══ */
function tempoDesde(lang: "pt" | "en") {
    const inicio = new Date(2025, 10, 1);
    const agora = new Date();
    const m = Math.max(0, (agora.getFullYear() - inicio.getFullYear()) * 12 + (agora.getMonth() - inicio.getMonth()));
    const a = Math.floor(m / 12);
    const r = m % 12;
    const en = lang === "en";
    const pa = (n: number) => (en ? `${n} ${n === 1 ? "year" : "years"}` : `${n} ${n === 1 ? "ano" : "anos"}`);
    const pm = (n: number) => (en ? `${n} ${n === 1 ? "month" : "months"}` : `${n} ${n === 1 ? "mês" : "meses"}`);
    const parts = [a ? pa(a) : "", r ? pm(r) : ""].filter(Boolean);
    return parts.length ? parts.join(en ? " and " : " e ") : en ? "just started" : "recém-iniciado";
}

const ACTS = {
    pt: [
        ["Controle de leituras", "Gás, água, energia, temperaturas e poços, em planilhas no Excel."],
        ["Lançamento das leituras", "Registro das leituras no Gshop."],
        ["Notificações", "Criação e análise de notificações no Word."],
        ["Empenhos e notas fiscais", "Controle e organização."],
        ["Circulares operacionais", "Criação, entrega, digitalização e organização de notificações e circulares."],
        ["Apoio no dia a dia", "Ajuda nos gargalos da rotina."],
    ],
    en: [
        ["Meter readings", "Gas, water, power, temperatures and wells, in Excel sheets."],
        ["Readings entry", "Logging the readings in Gshop."],
        ["Notifications", "Creating and reviewing notifications in Word."],
        ["Purchase orders and invoices", "Control and organization."],
        ["Operational circulars", "Creating, delivering, scanning and organizing notifications and circulars."],
        ["Day-to-day support", "Helping with the routine's bottlenecks."],
    ],
};

const TOOLS: [string, string][] = [
    ["Word", "/logos/exp/word.png"],
    ["Excel", "/logos/exp/excel.png"],
    ["Google Planilhas", "/logos/exp/sheets.png"],
    ["Gshop", "/logos/exp/group.png"],
    ["iLovePDF", "/logos/exp/ilovepdf.png"],
    ["Drive", "/logos/exp/drive.png"],
    ["Acrobat", "/logos/exp/acrobat.png"],
    ["Canva", "/logos/exp/canva.png"],
    ["ChatGPT", "/logos/exp/chatgpt.png"],
    ["Claude", "/logos/exp/claude.png"],
    ["Sefaz", "/logos/exp/sefaz.png"],
    ["Outlook", "/logos/exp/outlook.png"],
];

export default function Experience() {
    const { t, lang } = useLang();
    const cardRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const io = new IntersectionObserver((es) => {
            if (es.some((e) => e.isIntersecting)) { setInView(true); io.disconnect(); }
        }, { threshold: 0.2 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    /* inclinação do card com o mouse (lerp em rAF, só enquanto há movimento) */
    const onMove = (e: React.MouseEvent<HTMLElement>) => {
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        el.style.setProperty("--mx", `${px}px`);
        el.style.setProperty("--my", `${py}px`);
        tgt.current = { x: (py / r.height - 0.5) * -8, y: (px / r.width - 0.5) * 8 };
        kick();
    };
    const onLeave = () => { tgt.current = { x: 0, y: 0 }; kick(); };
    const tgt = useRef({ x: 0, y: 0 });
    const cur = useRef({ x: 0, y: 0 });
    const raf = useRef(0);
    const step = () => {
        const el = cardRef.current;
        if (!el) { raf.current = 0; return; }
        cur.current.x += (tgt.current.x - cur.current.x) * 0.12;
        cur.current.y += (tgt.current.y - cur.current.y) * 0.12;
        el.style.transform = `perspective(1100px) rotateX(${cur.current.x.toFixed(2)}deg) rotateY(${cur.current.y.toFixed(2)}deg)`;
        const moving = Math.abs(tgt.current.x - cur.current.x) + Math.abs(tgt.current.y - cur.current.y) > 0.01;
        raf.current = moving ? requestAnimationFrame(step) : 0;
    };
    const kick = () => { if (!raf.current) raf.current = requestAnimationFrame(step); };
    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    const acts = ACTS[lang === "en" ? "en" : "pt"];

    return (
        <section id="experience" className="relative flex flex-col items-center justify-center px-4 py-28 overflow-hidden">
            <div className="relative z-10 w-full max-w-3xl text-center">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                    <span className="text-emerald-400/40 font-light">&lt;</span>
                    {" "}{t("Experiência", "Experience")}{" "}
                    <span className="text-emerald-400/40 font-light">/&gt;</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
                    {t("Da teoria à rotina de trabalho.", "From theory to everyday work.")}
                </p>
            </div>

            <article
                ref={cardRef}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className={`exp-card relative z-10 mt-14 w-full max-w-[620px] rounded-[18px] overflow-hidden ${inView ? "in" : ""}`}
            >
                <img className="exp-blade" src="/logos/exp/aclf-white.png" alt="" aria-hidden="true" />
                <div className="exp-pad">
                    <div className="exp-top">
                        <img className="exp-logo" src="/logos/exp/aclf-white.png" alt="ACLF Empreendimentos" />
                        <span className="exp-live"><i />{t("Em andamento", "In progress")}</span>
                    </div>

                    <div className="exp-role">
                        <div>
                            <small>{t("Jovem Aprendiz", "Apprentice")}</small>
                            <h3>{t("Assistente Administrativo", "Administrative Assistant")}</h3>
                            <p>{t("Grupo ACLF · Paulista/PE", "Grupo ACLF · Paulista, PE")}</p>
                        </div>
                        <div className="exp-when">
                            <b>{tempoDesde(lang === "en" ? "en" : "pt")}</b>
                            <span>{t("nov/2025 — atual", "Nov 2025 — present")}</span>
                        </div>
                    </div>

                    <hr />

                    <p className="exp-lab">{t("Atividades", "Activities")}</p>
                    <ul className="exp-acts">
                        {acts.map(([b, s], i) => (
                            <li key={b} style={{ ["--i" as string]: i } as React.CSSProperties}>
                                <em>{String(i + 1).padStart(2, "0")}</em>
                                <div><b>{b}</b><span>{s}</span></div>
                            </li>
                        ))}
                    </ul>

                    <div className="exp-px">
                        <img src="/logos/projects/praxis.png" alt="" />
                        <p>
                            <b>Praxis.</b>{" "}
                            {t("Pensei no Praxis, uma ideia que apresentei ao setor e ao RH.",
                               "I came up with Praxis, an idea I presented to my department and HR.")}
                        </p>
                    </div>

                    <p className="exp-lab">{t("Ferramentas", "Tools")}</p>
                    <div className="exp-tl">
                        {TOOLS.map(([name, src], i) => (
                            <span key={name} className="exp-tile" style={{ ["--i" as string]: i } as React.CSSProperties} title={name} aria-label={name} role="img">
                                <img src={src} alt="" />
                            </span>
                        ))}
                    </div>
                </div>
            </article>

            <style>{`
                .exp-card { position: relative; background: linear-gradient(155deg, #26277c 0%, #1b1c60 48%, #121345 100%);
                    box-shadow: 0 0 0 1px rgba(255,255,255,.08), 0 30px 60px rgba(0,0,0,.5), 0 0 70px rgba(48,49,145,.25);
                    background-image: radial-gradient(360px circle at var(--mx,50%) var(--my,0%), rgba(255,255,255,.09), transparent 60%), linear-gradient(155deg, #26277c 0%, #1b1c60 48%, #121345 100%);
                    transform-style: preserve-3d; will-change: transform; isolation: isolate;
                    opacity: 0; transform: translateY(18px);
                    transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .25s ease-out; }
                .exp-card.in { opacity: 1; transform: none; }
                .exp-card::before { content: ""; position: absolute; left: 0; top: 0; height: 3px; width: 100%;
                    background: linear-gradient(90deg, #3d5f2c, #5f8a45 50%, #93b35f); transform-origin: left; transform: scaleX(0);
                    transition: transform 1.1s cubic-bezier(.22,1,.36,1) .25s; }
                .exp-card.in::before { transform: scaleX(1); }
                .exp-blade { position: absolute; right: -46px; top: -30px; width: 250px; opacity: .07; z-index: -1; pointer-events: none; }
                .exp-pad { padding: 20px 22px 18px; }
                .exp-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
                .exp-logo { display: block; height: 26px; width: auto; }
                .exp-live { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 99px; background: rgba(147,179,95,.12);
                    box-shadow: inset 0 0 0 1px rgba(147,179,95,.45); font: 700 9.5px "Roboto Mono", ui-monospace, monospace; letter-spacing: .14em; text-transform: uppercase; color: #d6ecb4; }
                .exp-live i { width: 7px; height: 7px; border-radius: 50%; background: #a3e635; animation: expLive 2s ease-out infinite; }
                @keyframes expLive { 0% { box-shadow: 0 0 0 0 rgba(163,230,53,.6); } 100% { box-shadow: 0 0 0 9px rgba(163,230,53,0); } }
                .exp-role { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; flex-wrap: wrap; margin-top: 18px; }
                .exp-role small { display: block; font: 700 11px "Roboto Mono", ui-monospace, monospace; letter-spacing: .2em; text-transform: uppercase; color: #93b35f; }
                .exp-role h3 { margin: 3px 0 1px; font: 700 clamp(1.1rem, 3.6vw, 1.3rem)/1.2 "Poppins", sans-serif; color: #fff; }
                .exp-role p { margin: 0; font-size: 12.5px; color: #c9cbef; }
                .exp-when { text-align: right; }
                .exp-when b { display: block; font: 400 24px/1 "Bebas Neue", Impact, sans-serif; letter-spacing: .04em; color: #fff; }
                .exp-when span { font: 500 10.5px "Roboto Mono", ui-monospace, monospace; letter-spacing: .08em; color: #a3a6e0; }
                .exp-card hr { border: 0; height: 1px; margin: 16px 0 14px; background: linear-gradient(90deg, rgba(255,255,255,.14), rgba(255,255,255,.04)); }
                .exp-lab { margin: 0 0 10px; font: 700 9.5px "Roboto Mono", ui-monospace, monospace; letter-spacing: .2em; text-transform: uppercase; color: #93b35f; }
                .exp-acts { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px 22px; }
                .exp-acts li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 6px; opacity: 0; transform: translateY(8px);
                    transition: opacity .5s ease, transform .5s ease; transition-delay: calc(.35s + var(--i) * 70ms); }
                .exp-card.in .exp-acts li { opacity: 1; transform: none; }
                .exp-acts em { font: 700 10.5px/1.8 "Roboto Mono", ui-monospace, monospace; font-style: normal; color: #93b35f; }
                .exp-acts b { display: block; font-size: 13px; font-weight: 600; color: #fff; line-height: 1.4; }
                .exp-acts span { display: block; font-size: 12px; line-height: 1.45; color: #c9cbef; }
                .exp-px { display: flex; gap: 12px; align-items: center; margin-top: 14px; padding: 10px 12px; border-radius: 12px; background: rgba(147,179,95,.09);
                    box-shadow: inset 3px 0 0 #93b35f, inset 0 0 0 1px rgba(147,179,95,.18); opacity: 0; transition: opacity .6s ease .85s; }
                .exp-card.in .exp-px { opacity: 1; }
                .exp-px img { flex: none; width: 30px; height: 30px; border-radius: 8px; background: #121345; padding: 4px; box-shadow: 0 0 0 1px rgba(255,255,255,.1); }
                .exp-px p { margin: 0; font-size: 12.5px; line-height: 1.5; color: #e3e5ff; }
                .exp-px p b { color: #fff; }
                .exp-tl { display: flex; flex-wrap: wrap; gap: 6px; }
                .exp-tile { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; background: #fff;
                    box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); opacity: 0; transition: opacity .4s ease, transform .25s;
                    transition-delay: calc(1s + var(--i) * 35ms), 0s; }
                .exp-card.in .exp-tile { opacity: 1; }
                .exp-tile:hover { transform: translateY(-2px); }
                .exp-tile img { width: 72%; height: 72%; object-fit: contain; }
                @container (max-width: 560px) { .exp-acts { grid-template-columns: minmax(0, 1fr); gap: 12px; } .exp-when { text-align: left; } }
                @media (prefers-reduced-motion: reduce) {
                    .exp-card, .exp-acts li, .exp-px, .exp-tile { opacity: 1 !important; transform: none !important; transition: none !important; }
                    .exp-card::before { transform: none; } .exp-live i { animation: none; }
                }
                .exp-card { container-type: inline-size; }
            `}</style>
        </section>
    );
}
