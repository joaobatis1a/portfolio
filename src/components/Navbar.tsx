import { useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import { useLang, type Lang } from "../i18n/context";

// Cada link cobre uma ou mais seções: o destaque acompanha qualquer uma delas
const NAV_LINKS = [
    { to: "about",     label: { pt: "Sobre",       en: "About" },      icon: "◈", sections: ["about"] },
    { to: "skills",    label: { pt: "Habilidades", en: "Skills" },     icon: "◆", sections: ["skills"] },
    { to: "projects",  label: { pt: "Projetos",    en: "Projects" },   icon: "◉", sections: ["projects"] },
    { to: "frontista", label: { pt: "Frontista",   en: "Frontista" },  icon: "▶", sections: ["frontista"] },
    { to: "training",  label: { pt: "Trajetória",  en: "Journey" },    icon: "◎", sections: ["training", "experience"] },
    { to: "contact",   label: { pt: "Contato",     en: "Contact" },    icon: "◇", sections: ["contact"] },
];

const linkFor = (sectionId: string) =>
    NAV_LINKS.find(l => l.sections.includes(sectionId))?.to ?? sectionId;

/* Seletor de idioma: globo + PT | EN, com a pílula deslizando para o lado ativo */
function LangSwitch() {
    const { lang, setLang, t } = useLang();
    const opts: Lang[] = ["pt", "en"];
    return (
        <div className="lg2" data-l={lang} role="radiogroup" aria-label={t("Idioma", "Language")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9z" />
            </svg>
            <div className="sg">
                <span className="th" />
                {opts.map(o => (
                    <button key={o} type="button" role="radio" aria-checked={lang === o} onClick={() => setLang(o)}
                        title={o === "pt" ? "Português" : "English"}>
                        {o.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
    );
}

function Navbar() {
    const { lang, t, pick } = useLang();
    const [active, setActive]     = useState("hero");
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden]     = useState(false);
    const [open, setOpen]         = useState(false);
    const progressRef  = useRef<HTMLSpanElement>(null);
    const linksRef     = useRef<HTMLUListElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);

    // Rolagem: encolhe, esconde ao descer e volta ao subir, e atualiza a barra de progresso
    useEffect(() => {
        let lastY = window.scrollY;
        let ticking = false;
        const update = () => {
            ticking = false;
            const y = window.scrollY;
            setScrolled(y > 60);
            if (Math.abs(y - lastY) > 8) { setHidden(y > lastY && y > 320); lastY = y; }
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
        };
        const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
        requestAnimationFrame(update);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // active section tracker
    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) setActive(linkFor(e.target.id)); }),
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Pílula que desliza até o link ativo (mexe direto no DOM: nada de re-render)
    useEffect(() => {
        const place = () => {
            const ind = indicatorRef.current;
            const el = linksRef.current?.querySelector<HTMLElement>(`[data-to="${active}"]`);
            if (!ind) return;
            if (!el) { ind.style.opacity = "0"; return; }
            const box = linksRef.current!.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            ind.style.opacity = "1";
            ind.style.width = `${r.width}px`;
            ind.style.transform = `translateX(${r.left - box.left}px)`;
        };
        place();
        // A barra muda de largura e fonte ao rolar: reposiciona a cada mudança de tamanho
        const ro = new ResizeObserver(place);
        if (linksRef.current) {
            ro.observe(linksRef.current);
            linksRef.current.querySelectorAll("[data-to]").forEach(el => ro.observe(el));
        }
        return () => ro.disconnect();
    }, [active, scrolled, lang]);

    // lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const fireWarp = () => window.dispatchEvent(new CustomEvent("warp"));

    return (
        <>
            {/* ── Navbar: encolhe ao rolar, some ao descer, volta ao subir ── */}
            <div className="fixed top-3.5 left-0 w-full z-50 flex justify-center"
                style={{ transform: hidden && !open ? "translateY(-150%)" : "none", transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)" }}>
                <nav className={`nb${scrolled ? " s" : ""}`} aria-label={t("Principal", "Main")}>
                    <div className="in">
                        {/* Desktop links */}
                        <ul ref={linksRef} className="relative hidden lg:flex items-center gap-2">
                            <span ref={indicatorRef} className="ind" aria-hidden="true" />
                            {NAV_LINKS.map(({ to, label }) => (
                                <li key={to} className="relative">
                                    <Link
                                        to={to} smooth offset={-70} duration={500}
                                        data-to={to}
                                        className={active === to ? "on" : ""}
                                        onClick={fireWarp}
                                    >
                                        {pick(label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <span className="dv hidden lg:block" aria-hidden="true" />
                        <LangSwitch />

                        {/* Hambúrguer: 3 linhas viram X */}
                        <button
                            className="burger lg:hidden"
                            onClick={() => setOpen(o => !o)}
                            aria-label="Menu" aria-expanded={open}
                        >
                            <i style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
                            <i style={{ opacity: open ? 0 : 1 }} />
                            <i style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
                        </button>
                    </div>

                    {/* Progresso de leitura na borda de baixo */}
                    <span ref={progressRef} className="prog" aria-hidden="true" />
                </nav>
            </div>

            {/* ── Mobile full-screen drawer ── */}
            <div
                className="lg:hidden fixed inset-0 z-40"
                style={{
                    background: "rgba(2,10,24,0.96)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    transition: "opacity 0.3s ease",
                }}
                onClick={() => setOpen(false)}
            >
                {/* glow central */}
                <div style={{
                    position: "absolute", top: "35%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 400, height: 400, borderRadius: "50%",
                    background: "radial-gradient(ellipse, rgba(0,149,255,0.12) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                <nav
                    className="flex flex-col items-center justify-center h-full gap-1"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Logo */}
                    <div
                        className="font-bold text-xl tracking-widest mb-6"
                        style={{
                            color: "rgba(120,210,255,0.95)",
                            textShadow: "0 0 12px rgba(0,180,255,0.7)",
                            opacity: open ? 1 : 0,
                            transform: open ? "translateY(0)" : "translateY(-10px)",
                            transition: "opacity 0.3s ease, transform 0.3s ease",
                        }}
                    >
                        JOÃO BATISTA
                    </div>

                    {/* Divider */}
                    <div
                        className="h-[1px] w-48 mb-4"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(0,190,255,0.55), transparent)",
                            opacity: open ? 1 : 0,
                            transition: "opacity 0.3s ease 0.1s",
                        }}
                    />

                    {NAV_LINKS.map(({ to, label, icon }, i) => (
                        <Link
                            key={to}
                            to={to} smooth offset={-70} duration={500}
                            onClick={() => { setOpen(false); fireWarp(); }}
                            style={{
                                color: active === to ? "rgba(170,228,255,1)" : "rgba(150,210,255,0.78)",
                                textShadow: active === to ? "0 0 10px rgba(0,180,255,0.75)" : "none",
                                opacity: open ? 1 : 0,
                                transform: open ? "translateX(0)" : "translateX(-20px)",
                                transition: `opacity 0.3s ease ${0.06 + i * 0.05}s, transform 0.35s ease ${0.06 + i * 0.05}s`,
                            }}
                            className={`drawer-link cursor-pointer w-56 flex items-center gap-3 px-5 py-3 rounded-lg text-base font-medium transition-all duration-200
                                ${active === to ? "drawer-link-active" : ""}`}
                        >
                            <span className="drawer-icon text-lg w-5 text-center"
                                style={{ color: active === to ? "rgba(120,220,255,1)" : "rgba(0,170,255,0.55)" }}>
                                {icon}
                            </span>
                            <span className="drawer-label">{pick(label)}</span>
                            {active === to && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full"
                                    style={{ background: "rgba(0,190,255,1)", boxShadow: "0 0 6px rgba(0,190,255,0.9)" }} />
                            )}
                        </Link>
                    ))}

                    {/* Divider bottom */}
                    <div
                        className="h-[1px] w-48 mt-4"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(0,190,255,0.4), transparent)",
                            opacity: open ? 1 : 0,
                            transition: "opacity 0.3s ease 0.45s",
                        }}
                    />
                    <p
                        className="text-[10px] mt-3 tracking-[3px] uppercase"
                        style={{
                            opacity: open ? 1 : 0,
                            transition: "opacity 0.3s ease 0.5s",
                        }}
                    >
                        <span style={{ color: "rgba(120,190,235,0.6)" }}>{t("toque fora para fechar", "tap outside to close")}</span>
                    </p>
                </nav>
            </div>

            <style>{`
                /* Barra: topo integrado ao céu; ao rolar vira cápsula em gradiente verde→ciano, texto escuro e pílula preta */
                .nb {
                    position: relative; width: min(95%, 1152px); border-radius: 999px; border: 0;
                    --lgbg: rgba(255,255,255,.06); --lgbd: rgba(255,255,255,.16); --lgth: linear-gradient(90deg,#34d399,#22d3ee); --lgsh: 0 0 14px rgba(52,211,153,.35);
                    --lgon: #02130a; --lgoff: rgba(214,220,226,.8); --lgic: rgba(214,220,226,.7); --lnk: rgba(224,230,234,.88); --lnkon: #fff;
                    transition: width .55s cubic-bezier(.22,1,.36,1), background .4s, box-shadow .4s;
                }
                .nb .in { position: relative; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 12px; }
                .nb ul { position: relative; margin: 0; padding: 0; list-style: none; }
                .nb ul a { position: relative; z-index: 1; display: block; padding: 9px 22px; border-radius: 999px; font-size: 14px; font-weight: 500;
                    color: var(--lnk); cursor: pointer; text-decoration: none; transition: color .25s; }
                .nb ul a:hover, .nb ul a.on { color: var(--lnkon); }
                .nb .ind { position: absolute; top: 0; bottom: 0; left: 0; width: 0; border-radius: 999px; opacity: 0; pointer-events: none;
                    transition: transform .5s cubic-bezier(.22,1,.36,1), width .5s cubic-bezier(.22,1,.36,1), opacity .3s; }
                .nb .dv { width: 1px; height: 24px; margin: 0 6px; background: rgba(255,255,255,.18); }
                .nb .prog { position: absolute; left: 26px; right: 26px; bottom: 0; height: 2px; border-radius: 2px; background: var(--pg, linear-gradient(90deg,#34d399,#22d3ee));
                    transform-origin: left; transform: scaleX(0); opacity: 0; transition: opacity .3s; pointer-events: none; }
                .nb.s .prog { opacity: .9; }
                .nb { overflow: hidden; }
                .nb::before { content: ""; position: absolute; inset: 0; border-radius: inherit; border: 2px solid rgba(0,190,255,.9); pointer-events: none; opacity: 0; transition: opacity .5s; z-index: 3;
                    -webkit-mask: linear-gradient(#000 0 0) top left/18px 18px no-repeat, linear-gradient(#000 0 0) top right/18px 18px no-repeat, linear-gradient(#000 0 0) bottom left/18px 18px no-repeat, linear-gradient(#000 0 0) bottom right/18px 18px no-repeat;
                            mask: linear-gradient(#000 0 0) top left/18px 18px no-repeat, linear-gradient(#000 0 0) top right/18px 18px no-repeat, linear-gradient(#000 0 0) bottom left/18px 18px no-repeat, linear-gradient(#000 0 0) bottom right/18px 18px no-repeat; }
                .nb::after { content: ""; position: absolute; top: 0; bottom: 0; left: -70px; width: 70px; background: linear-gradient(90deg, transparent, rgba(0,210,255,.5), transparent); opacity: 0; pointer-events: none; z-index: 2; }
                .nb.s {
                    width: min(92%, 1040px);
                    --lgbg: rgba(0,110,255,.12); --lgbd: rgba(0,149,255,.45); --lgth: rgba(0,150,255,.32); --lgsh: 0 0 14px rgba(0,170,255,.55), inset 0 0 0 1px rgba(0,200,255,.6);
                    --lgon: #e6f6ff; --lgoff: rgba(150,210,255,.72); --lgic: rgba(120,210,255,.85); --lnk: rgba(150,210,255,.78); --lnkon: rgba(170,228,255,1);
                    --pg: linear-gradient(90deg, transparent, rgba(0,210,255,.95));
                    background-color: rgba(0,110,255,.08);
                    background-image: repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,180,255,.05) 3px 4px);
                    box-shadow: 0 0 0 1px rgba(0,149,255,.5), 0 0 28px rgba(0,149,255,.22), inset 0 0 26px rgba(0,100,255,.1);
                    -webkit-backdrop-filter: blur(9px); backdrop-filter: blur(9px);
                    animation: navHoloIn .8s steps(1, end) both;
                }
                .nb.s::before { opacity: 1; }
                .nb.s::after { opacity: .75; animation: navBeam 4.2s linear infinite; }
                @keyframes navBeam { to { left: 100%; } }
                @keyframes navHoloIn { 0% { opacity: 0; } 12% { opacity: .9; filter: brightness(2.2); } 22% { opacity: .25; } 34% { opacity: 1; filter: brightness(1.6); } 46% { opacity: .5; } 58% { opacity: 1; filter: none; } 100% { opacity: 1; } }
                .nb.s .dv { background: rgba(0,170,255,.3); }
                .nb.s .ind { background: rgba(0,130,255,.18); box-shadow: inset 0 0 0 1px rgba(0,190,255,.6), 0 0 18px rgba(0,160,255,.4); }
                .nb.s ul a.on { text-shadow: 0 0 12px rgba(0,180,255,.75); }

                .lg2 { display: inline-flex; align-items: center; gap: 8px; }
                .lg2 > svg { width: 17px; height: 17px; flex: none; color: var(--lgic); transition: transform .6s cubic-bezier(.3,1.3,.5,1); }
                .lg2:hover > svg { transform: rotate(25deg); }
                .lg2 .sg { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; padding: 3px; border-radius: 99px;
                    background: var(--lgbg); box-shadow: inset 0 0 0 1px var(--lgbd); transition: background .4s, box-shadow .4s; }
                .lg2 .th { position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); border-radius: 99px;
                    background: var(--lgth); box-shadow: var(--lgsh); transition: transform .38s cubic-bezier(.3,1.35,.5,1), background .4s; }
                .lg2[data-l="en"] .th { transform: translateX(100%); }
                .lg2 button { position: relative; z-index: 1; min-width: 42px; min-height: 34px; padding: 0 10px; border: 0; background: none; cursor: pointer;
                    font: 700 12px "Poppins", sans-serif; letter-spacing: .1em; color: var(--lgoff); transition: color .25s; }
                .lg2 button[aria-checked="true"] { color: var(--lgon); }

                .burger { display: none; width: 44px; height: 44px; border: 0; background: none; cursor: pointer; place-items: center; align-content: center; gap: 5px; color: #fff; }
                .nb.s .burger { color: #9ddcff; }
                .burger i { display: block; width: 22px; height: 2px; border-radius: 2px; background: currentColor; transition: transform .3s, opacity .3s; }
                @media (max-width: 1023px) {
                    .nb .in { justify-content: space-between; padding: 6px 8px 6px 14px; }
                    .nb { width: min(94%, 520px); }
                    .nb .burger { display: grid; }
                }

                /* Drawer link — barrinha lateral deslizando */
                .drawer-link {
                    position: relative;
                    overflow: hidden;
                }
                .drawer-link::before {
                    content: "";
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 2px;
                    background: linear-gradient(to bottom, rgba(0,190,255,0.9), rgba(120,220,255,0.9));
                    box-shadow: 0 0 8px rgba(0,190,255,0.7);
                    transform: scaleY(0);
                    transform-origin: center;
                    transition: transform 0.25s ease;
                    border-radius: 2px;
                }
                .drawer-link:hover::before,
                .drawer-link-active::before {
                    transform: scaleY(1) !important;
                }
                .drawer-link::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, rgba(0,149,255,0.14), transparent);
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }
                .drawer-link:hover::after,
                .drawer-link-active::after {
                    opacity: 1 !important;
                }
                .drawer-link:hover .drawer-icon {
                    color: rgba(120,220,255,1) !important;
                    transition: color 0.2s ease;
                }
                .drawer-link:hover .drawer-label {
                    color: rgba(170,228,255,1);
                    transform: translateX(3px);
                    display: inline-block;
                    transition: transform 0.2s ease, color 0.2s ease;
                }
            `}</style>
        </>
    );
}

export default Navbar;
