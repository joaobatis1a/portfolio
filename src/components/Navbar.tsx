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

/* Seletor de idioma: PT | EN, com a pílula deslizando para o lado ativo */
function LangSwitch({ compact = false }: { compact?: boolean }) {
    const { lang, setLang, t } = useLang();
    const opts: Lang[] = ["pt", "en"];
    return (
        <div className={`lang-switch${compact ? " lang-compact" : ""}`} role="group" aria-label={t("Idioma", "Language")}>
            <span className="lang-pill" style={{ transform: lang === "en" ? "translateX(100%)" : "none" }} />
            {opts.map(o => (
                <button key={o} type="button" onClick={() => setLang(o)} aria-pressed={lang === o}
                    className={lang === o ? "is-on" : ""} title={o === "pt" ? "Português" : "English"}>
                    {o.toUpperCase()}
                </button>
            ))}
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
    const current = NAV_LINKS.find(l => l.to === active);
    const path = current ? pick(current.label).toLowerCase() : "";

    return (
        <>
            {/* ── Navbar: encolhe ao rolar, some ao descer, volta ao subir ── */}
            <div className="fixed top-4 left-0 w-full z-50 flex justify-center"
                style={{ transform: hidden && !open ? "translateY(-150%)" : "none", transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)" }}>
                <nav
                    className={`relative overflow-hidden rounded-full border border-white/10 backdrop-blur-md shadow-lg shadow-cyan-500/10${active === "frontista" ? " nav-noblur" : ""}`}
                    style={{
                        width: scrolled ? "min(92%, 1040px)" : "min(95%, 1152px)",
                        padding: scrolled ? "9px 0" : "15px 0",
                        background: active === "frontista" ? "rgba(12,14,16,0.95)" : scrolled ? "rgba(14,16,18,0.9)" : "rgba(24,24,27,0.7)",
                        transition: "width 0.5s cubic-bezier(0.22,1,0.36,1), padding 0.4s ease, background 0.4s ease",
                    }}
                >
                    <div className="flex items-center justify-between gap-4 transition-all duration-500"
                        style={{ padding: scrolled ? "0 22px" : "0 36px" }}>
                        {/* Marca: nome completo no topo; ao rolar, vira "FRONT" + o caminho da seção atual */}
                        <Link
                            to="hero" smooth duration={500} onClick={fireWarp}
                            aria-label={t("Voltar ao início", "Back to top")}
                            className="nav-brand cursor-pointer"
                        >
                            <span className={`nav-full nav-grad${scrolled ? " is-off" : ""}`}>JOÃO BATISTA NETO</span>
                            <span className={`nav-path${scrolled && path ? " is-on" : ""}`} aria-hidden="true">
                                <span key={path} className="nav-path-txt">~/{path}</span><i className="nav-caret" />
                            </span>
                        </Link>

                        {/* Desktop links */}
                        <ul ref={linksRef} className="relative hidden lg:flex items-center gap-1"
                            style={{ fontSize: scrolled ? "13px" : "14px", transition: "font-size 0.4s ease" }}>
                            <span ref={indicatorRef} className="nav-ind" aria-hidden="true" />
                            {NAV_LINKS.map(({ to, label }) => (
                                <li key={to} className="relative">
                                    <Link
                                        to={to} smooth offset={-70} duration={500}
                                        data-to={to}
                                        className={`nav-link${active === to ? " is-on" : ""}`}
                                        onClick={fireWarp}
                                    >
                                        {pick(label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-3">
                        <LangSwitch compact={scrolled} />

                        {/* Hamburger: 3 linhas viram X */}
                        <button
                            className="lg:hidden flex flex-col justify-center items-center gap-[5px] focus:outline-none"
                            style={{ width: scrolled ? 28 : 30, height: scrolled ? 28 : 30 }}
                            onClick={() => setOpen(o => !o)}
                            aria-label="Menu"
                        >
                            <span className="nav-bar" style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
                            <span className="nav-bar" style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }} />
                            <span className="nav-bar" style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
                        </button>
                        </div>
                    </div>

                    {/* Progresso de leitura na borda de baixo */}
                    <span ref={progressRef} className="nav-progress" aria-hidden="true" />
                </nav>
            </div>

            {/* ── Mobile full-screen drawer ── */}
            <div
                className="lg:hidden fixed inset-0 z-40"
                style={{
                    background: "rgba(2,8,4,0.96)",
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
                    background: "radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)",
                    pointerEvents: "none",
                }} />

                <nav
                    className="flex flex-col items-center justify-center h-full gap-1"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Logo */}
                    <div
                        className="font-bold text-xl bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-6"
                        style={{
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
                            background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)",
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
                                opacity: open ? 1 : 0,
                                transform: open ? "translateX(0)" : "translateX(-20px)",
                                transition: `opacity 0.3s ease ${0.06 + i * 0.05}s, transform 0.35s ease ${0.06 + i * 0.05}s`,
                            }}
                            className={`drawer-link cursor-pointer w-56 flex items-center gap-3 px-5 py-3 rounded-lg text-base font-medium transition-all duration-200
                                ${active === to
                                    ? "text-cyan-300 drawer-link-active"
                                    : "text-zinc-400 hover:text-white"
                                }`}
                        >
                            <span className="drawer-icon text-lg w-5 text-center"
                                style={{ color: active === to ? "rgba(34,211,238,0.9)" : "rgba(255,255,255,0.2)" }}>
                                {icon}
                            </span>
                            <span className="drawer-label">{pick(label)}</span>
                            {active === to && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                                    style={{ boxShadow: "0 0 6px rgba(34,211,238,0.8)" }} />
                            )}
                        </Link>
                    ))}

                    {/* Divider bottom */}
                    <div
                        className="h-[1px] w-48 mt-4"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)",
                            opacity: open ? 1 : 0,
                            transition: "opacity 0.3s ease 0.45s",
                        }}
                    />
                    <p
                        className="text-zinc-600 text-[10px] mt-3 tracking-[3px] uppercase"
                        style={{
                            opacity: open ? 1 : 0,
                            transition: "opacity 0.3s ease 0.5s",
                        }}
                    >
                        {t("toque fora para fechar", "tap outside to close")}
                    </p>
                </nav>
            </div>

            <style>{`
                /* Sobre o carrossel do Frontista o desfoque de fundo era refeito a cada quadro: desligado ali */
                .nav-noblur { -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
                .nav-brand { display: inline-flex; align-items: baseline; white-space: nowrap; font-weight: 700; letter-spacing: 0.3px; }
                .nav-grad {
                    background: linear-gradient(90deg, #34d399, #4ade80, #22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent;
                    transition: font-size 0.4s ease;
                }
                .nav-full { display: inline-block; overflow: hidden; vertical-align: bottom; font-size: 19px;
                    transition: max-width 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease; }
                .nav-full { max-width: 12em; }
                .nav-full.is-off { max-width: 0; opacity: 0; }

                .nav-path { display: inline-flex; align-items: center; max-width: 0; opacity: 0; overflow: hidden; margin-left: 0;
                    font: 600 14px/1 monospace; letter-spacing: 0.3px; color: rgba(103,232,249,0.95);
                    transition: max-width 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, margin 0.4s ease; }
                .nav-path.is-on { max-width: 14em; opacity: 1; margin-left: 0; }
                .nav-path-txt { display: inline-block; animation: navType 0.5s steps(14) both; }
                @keyframes navType { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
                .nav-caret { display: inline-block; width: 7px; height: 14px; margin-left: 2px; background: rgba(103,232,249,0.85); animation: navBlink 1s steps(1) infinite; }
                @keyframes navBlink { 50% { opacity: 0; } }

                .nav-ind {
                    position: absolute; left: 0; top: 50%; height: 32px; margin-top: -16px; width: 0; opacity: 0; border-radius: 999px;
                    background: linear-gradient(90deg, rgba(52,211,153,0.14), rgba(34,211,238,0.14));
                    border: 1px solid rgba(34,211,238,0.3); box-shadow: 0 0 16px rgba(34,211,238,0.15);
                    transition: transform 0.45s cubic-bezier(0.34,1.3,0.64,1), width 0.45s cubic-bezier(0.34,1.3,0.64,1), opacity 0.3s ease;
                    pointer-events: none;
                }
                .nav-link { position: relative; z-index: 1; display: inline-block; padding: 6px 13px; border-radius: 999px; cursor: pointer;
                    color: rgba(255,255,255,0.85); transition: color 0.25s ease; }
                .nav-link:hover { color: #67e8f9; }
                .nav-link.is-on { color: #67e8f9; }
                .nav-progress { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; transform: scaleX(0); transform-origin: left;
                    background: linear-gradient(90deg, #34d399, #22d3ee); box-shadow: 0 0 8px rgba(34,211,238,0.6); pointer-events: none; }

                .lang-switch {
                    position: relative; display: grid; grid-template-columns: 1fr 1fr;
                    padding: 3px; border-radius: 999px;
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                }
                .lang-pill {
                    position: absolute; top: 3px; bottom: 3px; left: 3px; width: calc(50% - 3px); border-radius: 999px;
                    background: linear-gradient(90deg, rgba(52,211,153,0.9), rgba(34,211,238,0.9));
                    box-shadow: 0 0 14px rgba(34,211,238,0.35);
                    transition: transform 0.35s cubic-bezier(0.34,1.4,0.64,1);
                }
                .lang-switch button {
                    position: relative; z-index: 1; border: 0; background: none; cursor: pointer;
                    font: 700 11px/1 monospace; letter-spacing: 1px; padding: 6px 10px;
                    color: rgba(255,255,255,0.55); transition: color 0.25s ease;
                }
                .lang-switch button.is-on { color: #03140b; }
                .lang-switch button:not(.is-on):hover { color: #fff; }
                .lang-compact button { padding: 5px 8px; font-size: 10px; }

                .nav-bar {
                    display: block;
                    width: 22px; height: 2px;
                    background: white;
                    border-radius: 2px;
                    transition: transform 0.3s ease, opacity 0.2s ease;
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
                    background: linear-gradient(to bottom, #34d399, #22d3ee);
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
                    background: linear-gradient(90deg, rgba(6,182,212,0.06), transparent);
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }
                .drawer-link:hover::after,
                .drawer-link-active::after {
                    opacity: 1 !important;
                }
                .drawer-link:hover .drawer-icon {
                    color: rgba(34,211,238,0.8) !important;
                    transition: color 0.2s ease;
                }
                .drawer-link:hover .drawer-label {
                    color: white;
                    transform: translateX(3px);
                    display: inline-block;
                    transition: transform 0.2s ease, color 0.2s ease;
                }
            `}</style>
        </>
    );
}

export default Navbar;
