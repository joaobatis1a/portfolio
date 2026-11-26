import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-scroll";
import { useLang } from "../i18n/context";

/* Título com o efeito dominó (o mesmo do título de Sobre): cada letra é uma peça articulada na base.
   O nome tomba em onda e "Desenvolvedor Front-end" levanta no lugar, e assim por diante. */
const G1 = [0x34, 0xd3, 0x99];
const G2 = [0x22, 0xd3, 0xee];
const mix = (k: number) => "#" + G1.map((v, i) => Math.round(v + (G2[i] - v) * k).toString(16).padStart(2, "0")).join("");

function TitleLine({ text, shown, away, start }: { text: string; shown: boolean; away: boolean; start: number }) {
    const letters = [...text];
    return (
        <span className="block">
            {letters.map((ch, i) => ch === " " ? " " : (
                <span key={i} style={{
                    display: "inline-block", color: mix(i / Math.max(1, letters.length - 1)), transformOrigin: "50% 85%", backfaceVisibility: "hidden",
                    transform: shown ? "perspective(900px) rotateX(0deg)" : `perspective(900px) rotateX(${away ? 92 : -92}deg)`, opacity: shown ? 1 : 0,
                    transition: `transform 900ms cubic-bezier(.68,-0.45,.27,1.45) ${(start + i) * 32 + (shown ? 380 : 0)}ms, opacity 250ms ease ${(start + i) * 32 + (shown ? 380 : 420)}ms`,
                } as CSSProperties}>{ch}</span>
            ))}
        </span>
    );
}

/* Dobra espacial: o campo de estrelas global fica em primeiro plano, atrás só de um escurecimento suave sob o texto.
   A aceleração das estrelas só acontece ao clicar no botão de voltar ao topo. */
function Hero() {
    const { t } = useLang();
    const [started, setStarted] = useState(false);
    const [idx, setIdx] = useState(0);
    const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    useEffect(() => { const id = setTimeout(() => setStarted(true), 120); return () => clearTimeout(id); }, []);
    useEffect(() => {
        if (!started || reduced) return;
        const id = setInterval(() => setIdx(i => (i + 1) % 2), 4800);
        return () => clearInterval(id);
    }, [started, reduced]);
    const phrases = [
        [t("João", "João"), t("Batista Neto", "Batista Neto")],
        [t("Desenvolvedor", "Front-end"), t("Front-end", "Developer")],
    ];

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <div className="hero-shade absolute inset-0 pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 flex flex-col items-center gap-5 px-4 text-center">
                <h1 className="hero-name" aria-label={`João Batista Neto, ${t("Desenvolvedor Front-end", "Front-end Developer")}`}>
                    <span className="hero-swap" aria-hidden="true">
                        {phrases.map((ph, pi) => {
                            const on = started && (reduced ? pi === 0 : idx === pi);
                            return (
                                <span key={pi} className="hero-ph">
                                    <TitleLine text={ph[0]} shown={on} away={pi === 0} start={0} />
                                    <TitleLine text={ph[1]} shown={on} away={pi === 0} start={ph[0].length} />
                                </span>
                            );
                        })}
                    </span>
                </h1>

                <div className="hero-bar" />

                <div className="hero-cta">
                    <Link
                        to="projects" smooth offset={-70} duration={600}
                        className="hero-btn hero-btn-pri cursor-pointer"
                    >
                        {t("Ver projetos", "See projects")}
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
                    </Link>
                    <a href="/batista-curriculo.pdf" download="Joao-Batista-Neto-Curriculo.pdf" className="hero-btn">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v8M4.5 7L8 10.5 11.5 7M2.5 13.5h11" /></svg>
                        {t("Baixar currículo", "Download résumé (PT)")}
                    </a>
                </div>

                <div className="hero-soc">
                    <a href="https://github.com/joaobatis1a" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </a>
                    <a href="https://linkedin.com/in/joao-batista-silva-neto" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a href="https://mail.google.com/mail/?view=cm&to=profissionalba1is1a@gmail.com" target="_blank" rel="noopener noreferrer"
                        aria-label={t("Enviar e-mail", "Send email")} title={t("Enviar e-mail", "Send email")}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </a>
                </div>
            </div>

            <style>{`
                .hero-shade { background: radial-gradient(60% 55% at 50% 50%, rgba(2,8,4,0.55), transparent 75%); }
                .hero-name {
                    margin: 0; font-family: "Bebas Neue", Impact, sans-serif; font-weight: 400; letter-spacing: .02em;
                    font-size: clamp(3.4rem, 15vw, 10.5rem); line-height: .84; padding-top: .14em;
                    filter: drop-shadow(0 0 40px rgba(52,211,153,.3));
                }
                .hero-swap { display: grid; }
                .hero-ph { grid-area: 1 / 1; }
                .hero-bar { width: min(70vw, 560px); height: 3px; background: linear-gradient(90deg, transparent, #34d399, #22d3ee, transparent); }
                .hero-cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 6px; }
                .hero-btn {
                    display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 8px 18px; border-radius: 12px;
                    border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.05); text-decoration: none; font: 600 13px "Poppins", sans-serif; color: #fff;
                    transition: transform .15s, border-color .15s, background .15s, filter .15s;
                }
                .hero-btn svg { width: 14px; height: 14px; flex: none; }
                .hero-btn:hover { transform: translateY(-1px); border-color: #34d399; background: rgba(52,211,153,.14); }
                .hero-btn-pri { border-color: transparent; color: #02130a; background: linear-gradient(90deg, #34d399, #22d3ee); }
                .hero-btn-pri:hover { filter: brightness(1.1); background: linear-gradient(90deg, #34d399, #22d3ee); border-color: transparent; }
                .hero-soc { display: flex; gap: 6px; align-items: center; }
                .hero-soc a { display: grid; place-items: center; width: 44px; height: 44px; color: rgba(210,216,222,.75); transition: color .2s, transform .2s; }
                .hero-soc a:hover { color: #22d3ee; transform: translateY(-2px); }
                .hero-soc svg { width: 20px; height: 20px; }
                @media (max-width: 560px) { .hero-btn { flex: 1 1 100%; } .hero-cta { width: min(100%, 320px); } }
                            `}</style>
        </section>
    );
}

export default Hero;
