import { useLang } from "../i18n/context";
import { useEffect, useState } from "react";

/* ══ VOLTAR AO TOPO: botão holográfico (mesmo desenho do navbar), desktop e celular ══ */
function BackToTop() {
    const { t } = useLang();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 480);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* Subida ao topo: dura o suficiente para aproveitar (1,4 s a 2,8 s, pelo tamanho da página) e
       as estrelas aceleram durante o percurso. Qualquer rolagem do usuário cancela. */
    const handleClick = () => {
        const start = window.scrollY;
        if (start <= 0) return;
        const dur = Math.min(2800, Math.max(1400, start * 0.7));
        const t0 = performance.now();
        const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
        let cancelled = false;
        const cancel = () => { cancelled = true; };
        window.addEventListener("wheel", cancel, { once: true, passive: true });
        window.addEventListener("touchstart", cancel, { once: true, passive: true });
        window.dispatchEvent(new CustomEvent("warp-hold", { detail: true }));
        const step = (now: number) => {
            const k = Math.min(1, (now - t0) / dur);
            if (!cancelled) window.scrollTo(0, start * (1 - ease(k)));
            if (k < 1 && !cancelled) requestAnimationFrame(step);
            else window.dispatchEvent(new CustomEvent("warp-hold", { detail: false }));
        };
        requestAnimationFrame(step);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                aria-label={t("Voltar ao topo", "Back to top")}
                className={`bt-holo fixed bottom-5 right-4 z-50 sm:bottom-8 sm:right-8 ${visible ? "bt-on" : ""}`}
                tabIndex={visible ? 0 : -1}
            >
                <svg className="bt-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
            </button>
            <style>{`
                .bt-holo {
                    position: fixed; display: inline-flex; align-items: center; gap: 10px;
                    width: 64px; height: 64px; padding: 0; justify-content: center; border-radius: 50%;
                    background-color: rgba(0,110,255,0.10);
                    background-image: repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,180,255,0.05) 3px 4px);
                    box-shadow: 0 0 0 1px rgba(0,149,255,0.5), 0 0 26px rgba(0,149,255,0.25), inset 0 0 20px rgba(0,100,255,0.12);
                    -webkit-backdrop-filter: blur(9px); backdrop-filter: blur(9px);
                    color: rgba(150,220,255,0.95); cursor: pointer; isolation: isolate; overflow: hidden;
                    opacity: 0; transform: translateY(14px); pointer-events: none;
                    transition: opacity .35s ease, transform .35s cubic-bezier(.22,1,.36,1), box-shadow .3s, background-color .3s;
                }
                .bt-holo.bt-on { opacity: 1; transform: none; pointer-events: auto; }
                .bt-holo::before {
                    content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: 1; pointer-events: none;
                    border: 2px solid rgba(0,190,255,0.9); opacity: .85; transition: opacity .3s;
                    -webkit-mask: linear-gradient(#000 0 0) top left / 16px 16px no-repeat, linear-gradient(#000 0 0) top right / 16px 16px no-repeat, linear-gradient(#000 0 0) bottom left / 16px 16px no-repeat, linear-gradient(#000 0 0) bottom right / 16px 16px no-repeat;
                            mask: linear-gradient(#000 0 0) top left / 16px 16px no-repeat, linear-gradient(#000 0 0) top right / 16px 16px no-repeat, linear-gradient(#000 0 0) bottom left / 16px 16px no-repeat, linear-gradient(#000 0 0) bottom right / 16px 16px no-repeat;
                }
                .bt-holo::after {
                    content: ""; position: absolute; top: 0; bottom: 0; left: -70px; width: 70px; z-index: 2; pointer-events: none;
                    background: linear-gradient(90deg, transparent, rgba(0,210,255,0.45), transparent); animation: btBeam 3.6s linear infinite;
                }
                @keyframes btBeam { to { left: 100%; } }
                .bt-holo:hover, .bt-holo:focus-visible {
                    background-color: rgba(0,149,255,0.18);
                    box-shadow: 0 0 0 1px rgba(0,190,255,0.8), 0 0 34px rgba(0,149,255,0.45), inset 0 0 22px rgba(0,100,255,0.16);
                    transform: translateY(-2px);
                }
                .bt-holo:active { transform: scale(.96); }
                .bt-label { font: 600 11px "Roboto Mono", ui-monospace, monospace; letter-spacing: .18em; text-transform: uppercase; text-shadow: 0 0 10px rgba(0,180,255,0.6); }
                .bt-arrow { width: 24px; height: 24px; flex: none; filter: drop-shadow(0 0 5px rgba(0,190,255,0.7)); }
                @media (max-width: 640px) { .bt-holo { width: 56px; height: 56px; } .bt-arrow { width: 22px; height: 22px; } }
                @media (prefers-reduced-motion: reduce) { .bt-holo::after { animation: none; display: none; } }
            `}</style>
        </>
    );
}

export default BackToTop;
