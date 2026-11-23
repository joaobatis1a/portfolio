import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n/context";

/* ══════════════════════════════════════════════════════════
   DADOS (anos, marcos e certificados)
══════════════════════════════════════════════════════════ */
type Ev = { t: string; g?: string; p?: string; n?: string };
type Yr = { y: string; l: string; c: string; e: Ev[]; certs: string[] };

const YEARS: Yr[] = [
    { y: "2022", l: "origem", c: "#4ade80", certs: ["alg"],
      e: [{ t: "Entrada no Senac, curso Mediotech (Ensino Médio + Técnico em TI)", g: "início" },
          { t: "Foco em Montagem e Manutenção de Computadores" },
          { t: "Primeiro contato com lógica de programação" }] },
    { y: "2023", l: "expansão", c: "#22d3ee", certs: ["hw"],
      e: [{ t: "Foco em Redes de Computadores e infraestrutura" }] },
    { y: "2024", l: "código", c: "#a78bfa", certs: ["net", "en"],
      e: [{ t: "Foco em Desenvolvimento de Software" },
          { t: "HTML, CSS, JavaScript, Python, Dart e MySQL" },
          { t: "Projeto Integrador SkillShare, plataforma de venda de cursos online", n: "SkillShare" },
          { t: "SkillShare participou da seleção para o REC'n'Play", n: "SkillShare" }] },
    { y: "2025", l: "decolagem", c: "#fbbf24", certs: ["dev", "fafire"],
      e: [{ t: "Ingresso no Centro Universitário UNIFAFIRE, curso de ADS (Análise e Desenvolvimento de Sistemas)", g: "início" },
          { t: "LimpAttack: 1º lugar no 1º período", g: "1º lugar", p: "/logos/projects/limpattack.png", n: "LimpAttack" },
          { t: "Benevo: 2º lugar no 2º período", g: "2º lugar", p: "/logos/projects/benevo.svg", n: "Benevo" },
          { t: "Jovem Aprendiz no Grupo ACLF, onde nasceu a ideia do Praxis", p: "/logos/projects/praxis.png", n: "Praxis" }] },
    { y: "2026", l: "presente", c: "#f472b6", certs: ["js", "dio"],
      e: [{ t: "P.O.N.T.E: 1º lugar no 3º período", g: "1º lugar", p: "/logos/projects/ponte.png", n: "P.O.N.T.E" },
          { t: "Hacka Business da Avanade: selecionado, Cápsula como Product Owner", g: "seleção", p: "/logos/projects/capsula.svg", n: "Cápsula" },
          { t: "DIO Campus Expert, Turma 16, com apoio do Santander Universidades" },
          { t: "Confluência: líder do projeto final do 4º período, apresentação em dezembro", g: "liderança", p: "/logos/projects/confluencia.png", n: "Confluência" },
          { t: "Marca Frontista: criador de conteúdo de front-end", p: "/logo.svg", n: "Frontista" }] },
];

const CERTS: Record<string, { t: string; s: string; i: string; d: string }> = {
    alg: { t: "Aperfeiçoamento em Algoritmo e Pensamento Computacional", s: "ALGORITMO", i: "Senac", d: "dez/2022" },
    hw: { t: "Assistente de Suporte e Manutenção de Computadores", s: "MANUTENÇÃO", i: "Senac", d: "abr/2023" },
    net: { t: "Assistente de Operação de Redes de Computadores", s: "REDES", i: "Senac", d: "jan/2024" },
    en: { t: "Basic 1, Inglês", s: "INGLÊS", i: "Senac", d: "jul/2024" },
    dev: { t: "Assistente de Desenvolvimento de Aplicativos Computacionais", s: "DESENV. DE APPS", i: "Senac", d: "jan/2025" },
    fafire: { t: "1º período de ADS, Desenvolvedor(a) Python Júnior", s: "PYTHON JÚNIOR", i: "UNIFAFIRE", d: "nov/2025" },
    js: { t: "Formação Lógica de Programação", s: "LÓGICA DE PROG.", i: "DIO", d: "abr/2026" },
    dio: { t: "DIO Campus Expert, Turma 16", s: "CAMPUS EXPERT", i: "DIO", d: "jul/2026" },
};
const CKEYS = Object.keys(CERTS);

const TAG: Record<string, string> = { "1º lugar": "#fde047", "2º lugar": "#e5e7eb", seleção: "#a5f3fc", liderança: "#bbf7d0", início: "#c4b5fd" };
const ICON: Record<string, string> = { "1º lugar": "trophy", "2º lugar": "medal", seleção: "star", liderança: "crown", início: "flag" };

/* pixel art 8×8 das conquistas */
const PIX: Record<string, string[]> = {
    trophy: ["..yyyy..", "yyyyyyyy", "y.yyyy.y", "..yyyy..", "...yy...", "...yy...", "..yyyy..", ".oooooo."],
    medal: [".rr..bb.", "..rrbb..", "...rb...", "..wwww..", ".wwggww.", ".wggggw.", ".wwggww.", "..wwww.."],
    star: ["...cc...", "...cc...", "cccccccc", ".cccccc.", "..cccc..", ".cc..cc.", "cc....cc", "........"],
    crown: ["g..g..g.", "gg.gg.gg", "gggggggg", "gggggggg", "gyggggyg", "gggggggg", "........", "........"],
    flag: ["pp......", "pppppp..", "pppppppp", "pppppp..", "pp......", "pp......", "pp......", "pp......"],
    scroll: [".wwwwww.", "wbbbbbbw", ".wbbbbw.", ".wwwwww.", ".wbbbbw.", ".wwwwww.", "wbbbbbbw", ".wwwwww."],
};
const PC: Record<string, string> = { y: "#fde047", o: "#a16207", r: "#ef4444", b: "#3b82f6", w: "#e5e7eb", g: "#4ade80", c: "#22d3ee", p: "#c4b5fd" };

const MAP_POS: [number, number][] = [[8, 70], [29, 28], [50, 72], [71, 30], [92, 66]];
const MAP_PATH = MAP_POS.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1] + 8}`).join(" ");

const unacc = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

function Pix({ name, color }: { name: string; color?: string }) {
    return (
        <svg viewBox="0 0 8 8" shapeRendering="crispEdges" width="24" height="24" aria-hidden="true" className="shrink-0">
            {PIX[name].map((row, y) =>
                [...row].map((ch, x) => ch === "." ? null : (
                    <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={name === "scroll" && color ? color : PC[ch]} />
                )))}
        </svg>
    );
}

/* ══════════════════════════════════════════════════════════
   VISUALIZADOR DE CERTIFICADOS
══════════════════════════════════════════════════════════ */
function Viewer({ start, onClose }: { start: number; onClose: () => void }) {
    const { t } = useLang();
    const [k, setK] = useState(start);
    const n = CKEYS.length;
    const go = (d: number) => setK((x) => (x + d + n) % n);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
        };
        window.addEventListener("keydown", onKey);
        document.documentElement.style.overflow = "hidden";
        return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
    });
    const c = CERTS[CKEYS[k]];
    return (
        <div className="fixed inset-0 z-[60] grid grid-rows-[auto_1fr_auto] bg-[rgba(2,6,14,.95)]" role="dialog" aria-modal="true" aria-label={t("Certificado", "Certificate")}>
            <div className="flex items-center justify-between gap-3 px-4 pt-4">
                <span className="font-mono text-xs tracking-widest text-cyan-200/70">{String(k + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
                <button type="button" onClick={onClose} aria-label={t("Fechar", "Close")} className="grid h-11 w-11 place-items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-100">✕</button>
            </div>
            <div className="relative grid min-h-0 items-center px-4 sm:px-20">
                <button type="button" onClick={() => go(-1)} aria-label={t("Anterior", "Previous")} className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-100 sm:left-6">‹</button>
                <figure className="grid min-w-0 justify-items-center gap-3">
                    <img src={`/certs/${CKEYS[k]}.jpg`} alt={c.t} className="max-h-[calc(100vh-210px)] max-w-full rounded-md shadow-[0_0_0_1px_rgba(0,190,255,.5),0_0_40px_rgba(0,149,255,.3)]" />
                    <figcaption className="text-center text-sm font-semibold text-white">{c.t}<small className="mt-1 block font-mono text-xs text-sky-200">{c.i} · {c.d}</small></figcaption>
                </figure>
                <button type="button" onClick={() => go(1)} aria-label={t("Próximo", "Next")} className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-cyan-400/40 bg-cyan-500/10 text-cyan-100 sm:right-6">›</button>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 px-4 pb-5 pt-3">
                {CKEYS.map((ck, i) => (
                    <button key={ck} type="button" onClick={() => setK(i)} aria-label={CERTS[ck].t}
                        className={`h-8 w-11 rounded border-2 bg-cover bg-center transition ${i === k ? "border-sky-400 opacity-100" : "border-transparent opacity-50"}`}
                        style={{ backgroundImage: `url(/certs/${ck}.jpg)` }} />
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   MODO JOGO (mundos por ano, level sobe com o ano)
══════════════════════════════════════════════════════════ */
function Game() {
    const { t } = useLang();
    const [viewer, setViewer] = useState<number | null>(null);
    const [cur, setCur] = useState(0);
    const [lv, setLv] = useState(16);
    const [toast, setToast] = useState<{ g: string; n?: string } | null>(null);
    const [lvUp, setLvUp] = useState<string | null>(null);
    const timers = useRef<number[]>([]);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);
    const later = (f: () => void, ms: number) => { timers.current.push(window.setTimeout(f, ms)); };

    const total = YEARS.reduce((a, y) => a + y.e.length, 0);
    const achieved = YEARS.reduce((a, y) => a + y.e.filter((e) => e.g && e.g !== "início").length, 0);
    const done = YEARS.slice(0, cur + 1).reduce((a, y) => a + y.e.length, 0);
    const got = YEARS.slice(0, cur + 1).reduce((a, y) => a + y.e.filter((e) => e.g && e.g !== "início").length, 0);
    const yr = YEARS[cur];

    const go = (i: number) => {
        const target = 16 + i;
        const diff = target - lv;
        setCur(i);
        if (diff !== 0) {
            // level sobe (ou desce) um por vez, como no jogo
            const dir = diff > 0 ? 1 : -1;
            let v = lv;
            const tick = () => {
                v += dir;
                setLv(v);
                if (v !== target) later(tick, 160);
            };
            tick();
            if (dir > 0) {
                const n = diff;
                setLvUp(n > 1 ? `LEVEL UP! +${n}` : "LEVEL UP!");
                later(() => setLvUp(null), 1500);
            }
        }
        const best = YEARS[i].e.find((e) => e.g && e.g !== "início");
        if (best) {
            setToast({ g: best.g!, n: best.n });
            later(() => setToast(null), 3600);
        } else setToast(null);
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#0b0a1f] font-['Press_Start_2P'] text-white shadow-[0_0_0_4px_#1e1b4b,0_0_0_8px_#0b0a1f,0_30px_60px_rgba(0,0,0,.55)]">
            <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(2px_2px_at_10%_20%,#fff_50%,transparent_51%),radial-gradient(2px_2px_at_60%_70%,#a5b4fc_50%,transparent_51%),radial-gradient(2px_2px_at_85%_30%,#fff_50%,transparent_51%)] [background-size:200px_140px,200px_140px,260px_180px]" />
            <div className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.18)_0_2px,transparent_2px_4px)]" />

            <div className="relative z-10 flex flex-wrap items-center gap-4 border-b-4 border-[#312e81] bg-[#1e1b4b] px-4 py-4 text-[10px]">
                <span>{unacc("JOÃO")}</span>
                <span className="text-yellow-300">LV {lv}</span>
                <div className="relative h-4 min-w-[120px] flex-1 border-[3px] border-white bg-[#0b0a1f]">
                    <i className="absolute inset-y-0 left-0 bg-[repeating-linear-gradient(90deg,#4ade80_0_8px,#22c55e_8px_10px)] transition-[width] duration-700" style={{ width: `${(done / total) * 100}%` }} />
                </div>
                <span className="text-cyan-300">★ {got}/{achieved}</span>
            </div>

            {/* mapa de mundos: zigue-zague ligado por trilha tracejada (como no modo jogo aprovado) */}
            <div className="wmap relative z-10 mx-6 mt-2.5 h-[250px]">
                <svg className="path absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d={MAP_PATH} vectorEffect="non-scaling-stroke" />
                </svg>
                {YEARS.map((y, i) => (
                    <button key={y.y} type="button" onClick={() => go(i)} aria-current={i === cur}
                        className="wn" style={{ left: `${MAP_POS[i][0]}%`, top: `calc(${MAP_POS[i][1]}% - 26px)`, ["--c" as string]: y.c } as React.CSSProperties}>
                        <span className="cur" />
                        <span className="plt">{i + 1}</span>
                        <span className="nm"><b>{y.y}</b>{unacc(y.l.toUpperCase())}</span>
                    </button>
                ))}
            </div>

            {/* diálogo do mundo */}
            <div className="relative z-10 mx-[18px] mb-5 mt-1.5 border-4 border-white bg-[#0b0a1f] px-5 py-[18px] shadow-[0_0_0_4px_#0b0a1f,inset_0_0_0_4px_#312e81] text-[10.5px] leading-[2]">
                <h3 className="mb-2 text-[13px] font-normal" style={{ color: yr.c }}>
                    {unacc(`MUNDO ${cur + 1} · ${yr.y}`)}
                    <small className="block text-[9px] text-indigo-200">{unacc(`${yr.l.toUpperCase()} · ${yr.e.length} ${yr.e.length === 1 ? "MISSÃO CONCLUÍDA" : "MISSÕES CONCLUÍDAS"}`)}</small>
                </h3>
                <ul className="m-0 mb-2 grid list-none gap-2.5 p-0 font-sans text-[13.5px] normal-case leading-normal">
                    {yr.e.map((e, k) => (
                        <li key={k} className="flex items-start gap-3">
                            <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center border-[3px] border-green-400 after:h-1.5 after:w-1.5 after:bg-green-400" />
                            <span>{e.t}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2.5">
                    {yr.e.filter((e) => e.g).map((e, k) => (
                        <span key={k} className="flex items-center gap-2 border-[3px] bg-[#1e1b4b] px-2.5 py-1.5 text-[8px] leading-snug" style={{ borderColor: TAG[e.g!] }}>
                            <Pix name={ICON[e.g!]} />
                            <span>{unacc(e.g!.toUpperCase())}{e.n ? <><br />{unacc(e.n.toUpperCase())}</> : null}</span>
                        </span>
                    ))}
                    {yr.certs.map((ck) => (
                        <button key={ck} type="button" onClick={() => setViewer(CKEYS.indexOf(ck))}
                            className="flex items-center gap-2 border-[3px] border-blue-400 bg-[#1e1b4b] px-2.5 py-1.5 text-left text-[8px] leading-snug text-white transition-transform hover:-translate-y-0.5">
                            <Pix name="scroll" color="#60a5fa" />
                            <span>{unacc(`CERTIFICADO · ${CERTS[ck].i.toUpperCase()}`)}<br />{unacc(CERTS[ck].s)}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex justify-center gap-3 pb-5">
                {[-1, 1].map((d) => (
                    <button key={d} type="button" onClick={() => go((cur + d + YEARS.length) % YEARS.length)}
                        aria-label={d < 0 ? t("Mundo anterior", "Previous world") : t("Próximo mundo", "Next world")}
                        className="h-11 w-[52px] border-0 bg-[#312e81] text-xs text-white shadow-[inset_-4px_-4px_0_rgba(0,0,0,.35),inset_4px_4px_0_rgba(255,255,255,.2),0_4px_0_#000] active:translate-y-[3px]">
                        {d < 0 ? "◀" : "▶"}
                    </button>
                ))}
            </div>

            {toast && (
                <div key={`${toast.g}-${cur}`} className="absolute right-4 top-[76px] z-20 flex max-w-[min(330px,calc(100%-32px))] items-center gap-3 border-4 border-yellow-300 bg-[#0b0a1f] px-3.5 py-3 text-[8.5px] leading-[1.7] shadow-[0_6px_0_#000] shadow-[0_6px_0_#000] [animation:toastIn_.35s_steps(5)_both]">
                    <Pix name={ICON[toast.g]} />
                    <span><b className="block text-[9px] font-normal text-yellow-300">{unacc("CONQUISTA DESBLOQUEADA")}</b>{unacc(toast.g.toUpperCase())}{toast.n ? ` · ${unacc(toast.n.toUpperCase())}` : ""}</span>
                </div>
            )}
            {lvUp && (
                <div className="pointer-events-none absolute left-1/2 top-[38%] z-30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(14px,3vw,22px)] text-yellow-300 [text-shadow:4px_4px_0_#b45309,0_0_20px_rgba(253,224,71,.6)] [animation:lvUp_1.4s_steps(8)_forwards]">
                    {lvUp}
                </div>
            )}
            {viewer !== null && <Viewer start={viewer} onClose={() => setViewer(null)} />}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   PAREDE DE CERTIFICADOS (holograma azul)
══════════════════════════════════════════════════════════ */
function Wall() {
    const { t } = useLang();
    const [viewer, setViewer] = useState<number | null>(null);
    const rot = ["-3deg", "2deg", "-1.5deg", "3deg", "2.5deg", "-2.5deg", "1.5deg", "-3.5deg"];
    return (
        <div className="mx-auto mt-16 w-full max-w-[1060px]">
            <h3 className="mb-4 text-center font-mono text-xs uppercase tracking-[0.24em] text-sky-300 [text-shadow:0_0_12px_rgba(0,180,255,.6)]">{t("Certificados", "Certificates")}</h3>
            <div className="relative isolate overflow-hidden rounded-[18px] bg-[#010614] shadow-[0_0_0_1px_rgba(0,149,255,.5),0_0_40px_rgba(0,149,255,.22),inset_0_0_60px_rgba(0,100,255,.14)] [background-image:linear-gradient(rgba(0,170,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(0,170,255,.09)_1px,transparent_1px),radial-gradient(80%_60%_at_50%_0%,rgba(0,120,255,.28),transparent_70%)] [background-size:44px_44px,44px_44px,auto]">
                <div className="pointer-events-none absolute inset-0 z-[1] [background:repeating-linear-gradient(0deg,transparent_0_3px,rgba(0,180,255,.05)_3px_4px)]" />
                <div className="pointer-events-none absolute inset-2.5 z-[3] rounded-xl border-2 border-sky-400/90 [mask:linear-gradient(#000_0_0)_top_left/26px_26px_no-repeat,linear-gradient(#000_0_0)_top_right/26px_26px_no-repeat,linear-gradient(#000_0_0)_bottom_left/26px_26px_no-repeat,linear-gradient(#000_0_0)_bottom_right/26px_26px_no-repeat]" />
                <div className="relative z-[2] grid grid-cols-2 gap-x-4 gap-y-10 px-5 pb-12 pt-16 md:grid-cols-4 md:gap-x-[30px] md:px-10">
                    {CKEYS.map((ck, i) => (
                        <button key={ck} type="button" onClick={() => setViewer(i)} aria-label={CERTS[ck].t}
                            className="group relative cursor-pointer bg-transparent p-0 text-left transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03]"
                            style={{ transform: `rotate(${rot[i]})` }}>
                            <span className="absolute left-1/2 top-[-10px] z-[2] h-[22px] w-[42%] -translate-x-1/2 -rotate-3 bg-gradient-to-b from-white/70 to-stone-100/60 [clip-path:polygon(0_8%,4%_0,9%_10%,14%_0,20%_8%,80%_6%,86%_0,91%_9%,96%_0,100%_8%,100%_92%,95%_100%,90%_91%,84%_100%,78%_92%,22%_94%,16%_100%,10%_90%,5%_100%,0_92%)] shadow-sm" />
                            <img src={`/certs/${ck}.jpg`} alt="" loading="lazy"
                                className="block h-auto w-full rounded-sm shadow-[0_0_0_1px_rgba(0,190,255,.55),0_0_22px_rgba(0,149,255,.35),0_14px_24px_rgba(0,0,0,.6)] transition-shadow group-hover:shadow-[0_0_0_1.5px_rgba(0,210,255,.9),0_0_34px_rgba(0,170,255,.55)]" />
                            <span className="mt-3 block text-center font-sans text-xs leading-snug text-sky-200 [text-shadow:0_0_10px_rgba(0,170,255,.5)]">{CERTS[ck].t}</span>
                        </button>
                    ))}
                </div>
            </div>
            {viewer !== null && <Viewer start={viewer} onClose={() => setViewer(null)} />}
        </div>
    );
}

/* ══════════════════════════════════════════════════════════
   SEÇÃO
══════════════════════════════════════════════════════════ */
export default function Training() {
    const { t } = useLang();
    return (
        <section id="training" className="relative flex flex-col items-center px-4 py-28">
            <div className="w-full max-w-[1100px] text-center">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                    <span className="text-emerald-400/40 font-light">&lt;</span>
                    {" "}{t("Formação", "Training")}{" "}
                    <span className="text-emerald-400/40 font-light">/&gt;</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">
                    {t("Cursos, certificados e a trajetória que me trouxe até aqui.", "Courses, certificates and the path that brought me here.")}
                </p>
            </div>
            <div className="mt-12 w-full max-w-[1100px]">
                <Game />
            </div>
            <Wall />
            <style>{`
                @keyframes toastIn { from { transform: translateX(calc(100% + 40px)); } to { transform: none; } }
                @keyframes lvUp { 0% { opacity: 0; transform: translate(-50%, -20%); } 20% { opacity: 1; transform: translate(-50%, -50%); } 75% { opacity: 1; transform: translate(-50%, -80%); } 100% { opacity: 0; transform: translate(-50%, -110%); } }
                @keyframes bob { 50% { transform: translateY(-6px); } }
                .wn { position: absolute; width: 86px; margin-left: -43px; display: grid; justify-items: center; gap: 8px; padding: 0; border: 0; background: none; cursor: pointer; color: #fff; font: inherit; }
                .wn .plt { position: relative; width: 64px; height: 52px; display: grid; place-items: center; background: var(--c); box-shadow: inset -6px -6px 0 rgba(0,0,0,.28), inset 6px 6px 0 rgba(255,255,255,.25), 0 6px 0 #000; font-size: 15px; color: #0b0a1f; transition: transform .15s steps(2); }
                .wn:hover .plt { transform: translateY(-3px); }
                .wn[aria-current="true"] .plt { animation: bob .8s steps(2) infinite; }
                .wn .cur { position: absolute; top: -30px; width: 16px; height: 14px; opacity: 0; background: #fde047; clip-path: polygon(0 0,100% 0,50% 100%); }
                .wn[aria-current="true"] .cur { opacity: 1; animation: bob .5s steps(2) infinite; }
                .wn .nm { font-size: 9px; line-height: 1.5; text-align: center; color: #c7d2fe; }
                .wn .nm b { display: block; font-size: 11px; color: #fff; font-weight: 400; }
                .wmap svg.path path { fill: none; stroke: #6366f1; stroke-width: 4; stroke-dasharray: 4 10; stroke-linecap: square; animation: march 1s steps(7) infinite; }
                @keyframes march { to { stroke-dashoffset: -14px; } }
                @media (max-width: 640px) {
                    .wmap { height: auto; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); row-gap: 46px; padding-top: 34px; margin: 16px 6px 0; }
                    .wmap svg.path { display: none; }
                    .wn { position: relative; left: auto !important; top: auto !important; margin: 0 auto; grid-column: span 2; width: auto; }
                    .wn:nth-of-type(4) { grid-column: 2 / span 2; }
                    .wn .plt { width: 56px; height: 46px; }
                }
                @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
            `}</style>
        </section>
    );
}
