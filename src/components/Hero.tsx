import { TypeAnimation } from "react-type-animation";
import { Link } from "react-scroll";

function Hero() {
    const fireWarp = () => window.dispatchEvent(new CustomEvent("warp"));

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center gap-6 overflow-hidden">

            {/* Fundo iluminado — mais vida, sem ser esverdeado demais */}
            <div className="absolute inset-0 pointer-events-none">
                {/* base escura */}
                <div className="absolute inset-0" style={{ background: "#030a06" }} />

                {/* glow central verde/ciano — principal fonte de luz */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full"
                    style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.13) 0%, rgba(6,182,212,0.09) 35%, transparent 70%)" }} />

                {/* orb flutuante esquerda */}
                <div className="absolute hero-orb-left w-[380px] h-[380px] rounded-full"
                    style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 65%)", top: "20%", left: "-8%" }} />

                {/* orb flutuante direita */}
                <div className="absolute hero-orb-right w-[320px] h-[320px] rounded-full"
                    style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.09) 0%, transparent 65%)", top: "30%", right: "-5%" }} />

                {/* acento inferior — ciano */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px]"
                    style={{ background: "radial-gradient(ellipse at bottom, rgba(6,182,212,0.1) 0%, transparent 70%)" }} />

                {/* vinheta nas bordas */}
                <div className="absolute inset-0"
                    style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />

                {/* grid de pontos — um pouco mais visível */}
                <div className="absolute inset-0"
                    style={{ backgroundImage: "radial-gradient(rgba(6,182,212,0.13) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

                {/* scanlines sutis */}
                <div className="absolute inset-0"
                    style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)" }} />
            </div>

            {/* Conteúdo */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
                <p className="relative rounded-full px-4 py-2 text-sm text-green-300 ring-1 ring-cyan-500/60"
                    style={{ background: "rgba(6,182,212,0.08)" }}>
                    SEJA BEM-VINDO(A)!
                </p>

                <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent min-h-[1.4em]">
                    <TypeAnimation
                        sequence={[
                            "JOÃO BATISTA DA SILVA NETO",
                            2000,
                            "",
                            500,
                            "DESENVOLVEDOR FRONT-END",
                            2000,
                        ]}
                        repeat={Infinity}
                    />
                </h1>

                <div className="h-[3px] w-95 md:w-200 rounded-full bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400" />

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    {/* Ver Projetos — shimmer no hover */}
                    <Link
                        to="projects"
                        smooth
                        offset={-70}
                        duration={600}
                        onClick={fireWarp}
                        className="hero-btn-primary cursor-pointer flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-black shadow-lg shadow-cyan-500/20"
                        style={{
                            background: "linear-gradient(135deg, #34d399, #22d3ee)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <span className="hero-btn-shimmer" />
                        <svg className="w-4 h-4 relative z-10 hero-btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="relative z-10">Ver Projetos</span>
                    </Link>

                    {/* Baixar Currículo — border glow no hover */}
                    <a
                        href="/batista-curriculo.pdf"
                        download="Joao-Batista-Curriculo.pdf"
                        className="hero-btn-secondary flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-white"
                        style={{
                            position: "relative",
                            border: "1px solid rgba(255,255,255,0.2)",
                            overflow: "hidden",
                        }}
                    >
                        <span className="hero-btn-border-glow" />
                        <svg className="w-4 h-4 relative z-10 hero-btn-dl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="relative z-10">Baixar Currículo</span>
                    </a>
                </div>

                {/* Sociais */}
                <div className="flex items-center gap-6 mt-1">
                    <a href="https://github.com/joaobatis1a" target="_blank" rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-cyan-300 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </a>
                    <a href="https://linkedin.com/in/joao-batista-silva-neto" target="_blank" rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-cyan-300 transition-colors duration-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a href="https://mail.google.com/mail/?view=cm&to=profissionalba1is1a@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-cyan-300 transition-colors duration-300"
                        title="Enviar email"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </a>
                </div>
            </div>

            <style>{`
                @keyframes orbFloat {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50%       { transform: translateY(-18px) scale(1.04); }
                }
                @keyframes orbFloatR {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50%       { transform: translateY(14px) scale(0.97); }
                }
                .hero-orb-left  { animation: orbFloat  7s ease-in-out infinite; }
                .hero-orb-right { animation: orbFloatR 9s ease-in-out infinite; }

                /* Ver Projetos — shimmer sweep */
                .hero-btn-shimmer {
                    position: absolute; inset: 0;
                    background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%);
                    transform: translateX(-100%);
                    z-index: 1;
                }
                .hero-btn-primary:hover .hero-btn-shimmer {
                    animation: heroShimmer 0.55s ease forwards;
                }
                .hero-btn-primary:hover {
                    transform: scale(1.04);
                    transition: transform 0.2s ease;
                    box-shadow: 0 0 28px rgba(34,211,238,0.45), 0 4px 20px rgba(0,0,0,0.3);
                }
                .hero-btn-primary:hover .hero-btn-arrow {
                    animation: arrowBounce 0.45s ease infinite alternate;
                }
                @keyframes heroShimmer {
                    from { transform: translateX(-100%); }
                    to   { transform: translateX(200%); }
                }
                @keyframes arrowBounce {
                    from { transform: translateX(0); }
                    to   { transform: translateX(4px); }
                }

                /* Baixar Currículo — border glow sweep */
                .hero-btn-border-glow {
                    position: absolute;
                    width: 60px; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(34,211,238,0.6), transparent);
                    top: 0; left: -60px;
                    z-index: 0;
                }
                .hero-btn-secondary:hover .hero-btn-border-glow {
                    animation: borderSweep 0.6s ease forwards;
                }
                .hero-btn-secondary:hover {
                    border-color: rgba(34,211,238,0.55) !important;
                    color: #67e8f9 !important;
                    box-shadow: 0 0 20px rgba(6,182,212,0.2), inset 0 0 20px rgba(6,182,212,0.05);
                    transition: border-color 0.3s, color 0.3s, box-shadow 0.3s;
                }
                .hero-btn-secondary:hover .hero-btn-dl {
                    animation: dlBounce 0.45s ease infinite alternate;
                }
                @keyframes borderSweep {
                    from { left: -60px; opacity: 1; }
                    to   { left: 110%;  opacity: 0; }
                }
                @keyframes dlBounce {
                    from { transform: translateY(0); }
                    to   { transform: translateY(3px); }
                }
            `}</style>
        </section>
    );
}

export default Hero;
