import { useEffect, useState } from "react";
import { Link } from "react-scroll";

const NAV_LINKS = [
    { to: "hero",       label: "Início",      icon: "⌂" },
    { to: "about",      label: "Sobre",       icon: "◈" },
    { to: "skills",     label: "Habilidades", icon: "◆" },
    { to: "projects",   label: "Projetos",    icon: "◉" },
    { to: "frontista",  label: "Criação",     icon: "◈" },
    { to: "training",   label: "Formação",    icon: "◎" },
    { to: "experience", label: "Experiência", icon: "◇" },
    { to: "contact",    label: "Contato",     icon: "◈" },
];

function Navbar() {
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
            entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
            { threshold: 0.5 }
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
                        <div
                            className="font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500"
                            style={{ fontSize: scrolled ? "18px" : "22px" }}
                        >
                            JOÃO BATISTA
                        </div>

                        {/* Desktop links */}
                        <ul
                            className="hidden md:flex gap-6 transition-all duration-500"
                            style={{ fontSize: scrolled ? "13px" : "14px" }}
                        >
                            {NAV_LINKS.map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to} smooth offset={-70} duration={500}
                                        className={linkClass(to)}
                                        onClick={fireWarp}
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Hamburger — 3 linhas → X */}
                        <button
                            className="md:hidden flex flex-col justify-center items-center gap-[5px] focus:outline-none"
                            style={{ width: scrolled ? 28 : 30, height: scrolled ? 28 : 30 }}
                            onClick={() => setOpen(o => !o)}
                            aria-label="Menu"
                        >
                            <span className="nav-bar" style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
                            <span className="nav-bar" style={{ opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }} />
                            <span className="nav-bar" style={{ transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
                        </button>
                    </div>
                </nav>
            </div>

            {/* ── Mobile full-screen drawer ── */}
            <div
                className="md:hidden fixed inset-0 z-40"
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
                            <span className="drawer-label">{label}</span>
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
                        toque fora para fechar
                    </p>
                </nav>
            </div>

            <style>{`
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
