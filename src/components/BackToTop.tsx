import { useLang } from "../i18n/context";
import { useEffect, useState } from "react";

/* ══ BOTÃO "VOLTAR AO TOPO" — nave minimalista, vista de cima ══ */
function BackToTop() {
    const { t } = useLang();
    const [visible, setVisible] = useState(false);
    const [hovering, setHovering] = useState(false);

    /* Mostra o botão após rolar uma certa distância */
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 480);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = () => {
        window.dispatchEvent(new Event("warp"));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
        <button
            type="button"
            onClick={handleClick}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            aria-label={t("Voltar ao topo", "Back to top")}
            className="backtotop-btn fixed bottom-6 right-5 z-50 sm:bottom-8 sm:right-8"
            style={{
                opacity: visible ? 1 : 0,
                transform: `translateY(${visible ? 0 : 16}px)`,
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            <span
                className="backtotop-shell relative flex h-14 w-14 items-center justify-center rounded-full"
                style={{
                    transform: `translateY(${hovering ? -3 : 0}px)`,
                }}
            >
                {/* anel holográfico giratório */}
                <span className="backtotop-holo-ring pointer-events-none absolute -inset-[2px] rounded-full" />

                {/* glow ambiente */}
                <span
                    className="backtotop-ambient pointer-events-none absolute inset-0 rounded-full"
                    style={{ opacity: hovering ? 1 : 0 }}
                />

                {/* seta — estilo holográfico */}
                <svg
                    className="backtotop-arrow relative z-10 h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 19V5M5 12l7-7 7 7"
                        stroke="url(#arrowGradient)"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient id="arrowGradient" x1="12" y1="5" x2="12" y2="19" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#eafff7" />
                            <stop offset="55%" stopColor="#5eead4" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>
                </svg>
            </span>
        </button>
        <style>{`
                .backtotop-btn {
                    transition: opacity 0.4s ease, transform 0.4s ease;
                    cursor: pointer;
                    background: transparent;
                    border: none;
                    padding: 0;
                }
                .backtotop-shell {
                    background: radial-gradient(circle at 50% 40%, rgba(34,211,238,0.08), rgba(255,255,255,0.04));
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    box-shadow: 0 8px 30px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.06);
                    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
                }
                .backtotop-btn:hover .backtotop-shell {
                    box-shadow: 0 8px 32px rgba(0,0,0,0.32), inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 22px rgba(52,211,153,0.18);
                }
                .backtotop-holo-ring {
                    background: conic-gradient(from 0deg, rgba(52,211,153,0) 0%, rgba(52,211,153,0.8) 18%, rgba(34,211,238,0.9) 32%, rgba(52,211,153,0) 50%, rgba(52,211,153,0) 100%);
                    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
                    mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
                    opacity: 0.55;
                    animation: holoRingSpin 4s linear infinite;
                    filter: blur(0.3px);
                }
                .backtotop-btn:hover .backtotop-holo-ring {
                    opacity: 0.9;
                    animation-duration: 2.2s;
                }
                @keyframes holoRingSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .backtotop-arrow {
                    filter: drop-shadow(0 0 5px rgba(52,211,153,0.55));
                    animation: holoArrowFlicker 3.4s ease-in-out infinite;
                }
                @keyframes holoArrowFlicker {
                    0%, 100% { opacity: 1; }
                    92% { opacity: 1; }
                    93% { opacity: 0.7; }
                    94% { opacity: 1; }
                    96% { opacity: 0.85; }
                    97% { opacity: 1; }
                }
                .backtotop-ambient {
                    background: radial-gradient(60% 60% at 50% 35%, rgba(52,211,153,0.24), transparent 70%);
                    transition: opacity 0.35s ease;
                }
                .backtotop-btn:active .backtotop-shell { transform: scale(0.95); }

                @media (prefers-reduced-motion: reduce) {
                    .backtotop-btn, .backtotop-shell {
                        transition: opacity 0.2s ease;
                    }
                    .backtotop-holo-ring, .backtotop-arrow {
                        animation: none;
                    }
                }
            `}</style>
        </>
    );
}

export default BackToTop;
