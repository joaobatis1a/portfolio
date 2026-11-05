import { useEffect, useState } from "react";
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
    const { t, pick } = useLang();
    const [active, setActive]   = useState("hero");
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen]       = useState(false);

    // shrink on scroll — no hide
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
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

    // lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const fireWarp = () => window.dispatchEvent(new CustomEvent("warp"));

    const linkClass = (id: string) =>
        `relative inline-block cursor-pointer transition-all duration-300
        ${active === id
            ? "text-cyan-300 after:w-full"
            : "text-white hover:text-cyan-300 after:w-0 hover:after:w-full"
        }
        after:absolute after:left-0 after:-bottom-1 after:h-[2px]
        after:bg-gradient-to-r after:from-emerald-400 after:via-green-400 after:to-cyan-400
        after:transition-all after:duration-300`;

    return (
        <>
            {/* ── Navbar pill — shrinks on scroll ── */}
            <div className="fixed top-4 left-0 w-full z-50 flex justify-center transition-all duration-500">
                <nav
                    className="w-[95%] max-w-6xl rounded-full border border-white/10 backdrop-blur-md shadow-lg shadow-cyan-500/10 transition-all duration-500"
                    style={{ padding: scrolled ? "11px 0" : "16px 0", background: scrolled ? "rgba(24,24,27,0.88)" : "rgba(24,24,27,0.7)" }}
                >
                    <div
                        className="flex items-center justify-between transition-all duration-500"
                        style={{ padding: scrolled ? "0 30px" : "0 48px" }}
                    >
                        {/* Logo */}
                        <Link
                            to="hero" smooth duration={500} onClick={fireWarp}
                            aria-label={t("Voltar ao início", "Back to top")}
                            className="cursor-pointer font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500"
                            style={{ fontSize: scrolled ? "18px" : "22px" }}
                        >
                            JOÃO BATISTA
                        </Link>

                        {/* Desktop links */}
                        <ul
                            className="hidden lg:flex gap-7 transition-all duration-500"
                            style={{ fontSize: scrolled ? "13px" : "14px" }}
                        >
                            {NAV_LINKS.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to} smooth offset={-70} duration={500}
                                        className={linkClass(to)}
                                        onClick={fireWarp}
                                    >
                                        {pick(label)}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-3">
                        <LangSwitch compact={scrolled} />

                        {/* Hamburger — 3 linhas → X */}
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
