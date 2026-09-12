/* ══ ÍCONES SOCIAIS ══ */
function SocialIcon({
    href,
    label,
    icon,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="footer-social group relative flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400"
            style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.09)",
            }}
        >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-emerald-300">
                {icon}
            </span>
        </a>
    );
}

/* ══ FOOTER ══ */
function Footer() {
    const year = new Date().getFullYear();

    const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer
            className="relative overflow-hidden px-4 pt-16 pb-8"
            style={{
                background: "linear-gradient(180deg, #05070a 0%, #030405 55%, #020304 100%)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Linha superior com gradiente — separa o "chão" sólido do céu estrelado acima */}
            <div className="footer-line absolute top-0 left-1/2 h-px w-full max-w-4xl -translate-x-1/2">
                <span className="footer-line-glow absolute inset-0" />
            </div>

            {/* Grid sutil — mesma linguagem das outras seções, mas discreta sobre fundo sólido */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(6,182,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.02) 1px,transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-4xl">

                {/* ── Corpo principal: 3 colunas ── */}
                <div className="grid gap-10 sm:grid-cols-3 text-center sm:text-left">

                    {/* Marca + status */}
                    <div className="flex flex-col items-center sm:items-start gap-3">
                        <span className="text-lg font-bold tracking-tight text-white">
                            <span className="text-emerald-400/40 font-light">&lt;</span>
                            {" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                                Frontista
                            </span>
                            {" "}
                            <span className="text-emerald-400/40 font-light">/&gt;</span>
                        </span>
                        <p className="text-xs italic text-zinc-500 max-w-[220px]">
                            código, criatividade e um toque de café.
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.8)",
                                animation: "footerPulse 1.8s ease-in-out infinite",
                            }} />
                            <span className="text-[11px] font-mono tracking-wider text-emerald-400/70 uppercase">
                                disponível para novos projetos
                            </span>
                        </div>
                    </div>

                    {/* Mini terminal — bem mais divertido que uma lista de links */}
                    <div className="flex flex-col items-center sm:items-start gap-2 w-full">
                        <div
                            className="footer-terminal w-full max-w-[240px] rounded-lg overflow-hidden"
                            style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(255,255,255,0.09)",
                            }}
                        >
                            <div
                                className="flex items-center gap-1.5 px-3 py-2"
                                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                            >
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f87171" }} />
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fbbf24" }} />
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }} />
                                <span className="ml-1.5 text-[10px] font-mono text-zinc-600">status.sh</span>
                            </div>
                            <div className="px-3 py-2.5 text-left font-mono text-[11px] leading-relaxed">
                                <p className="text-zinc-500">
                                    <span className="text-emerald-400">$</span> whoami
                                </p>
                                <p className="text-zinc-300 mb-1.5">joão_batista, frontend dev</p>
                                <p className="text-zinc-500">
                                    <span className="text-emerald-400">$</span> status
                                </p>
                                <p className="text-zinc-300 mb-1.5">construindo algo novo<span className="footer-cursor">_</span></p>
                                <p className="text-zinc-500">
                                    <span className="text-emerald-400">$</span> uptime
                                </p>
                                <p className="text-cyan-300/80">codando desde 2022</p>
                            </div>
                        </div>
                    </div>

                    {/* Contato + redes */}
                    <div className="flex flex-col items-center sm:items-start gap-3">
                        <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-600 uppercase">
                            contato
                        </p>
                        <a
                            href="mailto:profissionalba1is1a@gmail.com"
                            className="text-sm text-zinc-400 hover:text-emerald-300 transition-colors duration-200 break-all"
                        >
                            profissionalba1is1a@gmail.com
                        </a>
                        <div className="flex items-center gap-3 mt-1">
                            <SocialIcon
                                href="https://github.com/joaobatis1a"
                                label="GitHub"
                                icon={
                                    <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                }
                            />
                            <SocialIcon
                                href="https://linkedin.com/in/joao-batista-silva-neto"
                                label="LinkedIn"
                                icon={
                                    <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                }
                            />
                            <SocialIcon
                                href="https://instagram.com/frontista"
                                label="Instagram"
                                icon={
                                    <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                }
                            />
                            <SocialIcon
                                href="https://tiktok.com/@frontista"
                                label="TikTok"
                                icon={
                                    <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.592 2.592 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.31 1.38V7.3s-1.88.09-3.24-1.48z" />
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* ── Linha divisória ── */}
                <div className="my-8 h-px w-full" style={{ background: "rgba(255,255,255,0.06)" }} />

                {/* ── Barra inferior ── */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-600 order-2 sm:order-1">
                        © {year} Frontista. Todos os direitos reservados.
                    </p>
                    <p className="text-xs text-zinc-600 order-1 sm:order-2">
                        feito com <span className="text-emerald-500/60">React</span> &amp;{" "}
                        <span className="text-cyan-500/60">Tailwind</span>
                    </p>
                    <button
                        onClick={scrollTop}
                        className="footer-totop order-3 flex items-center gap-1.5 text-xs text-zinc-500"
                        aria-label="Voltar ao topo"
                    >
                        voltar ao topo
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
                .footer-line {
                    background: linear-gradient(90deg, transparent, rgba(52,211,153,0.35), rgba(34,211,238,0.35), transparent);
                }
                .footer-line-glow {
                    background: linear-gradient(90deg, transparent, rgba(52,211,153,0.9), rgba(34,211,238,0.9), transparent);
                    filter: blur(2px);
                    opacity: 0.6;
                    animation: footerLineDrift 6s ease-in-out infinite;
                }
                @keyframes footerLineDrift {
                    0%, 100% { opacity: 0.35; transform: scaleX(0.85); }
                    50% { opacity: 0.75; transform: scaleX(1); }
                }
                @keyframes footerPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

                .footer-cursor {
                    animation: footerCursorBlink 1s step-end infinite;
                    color: rgb(110,231,183);
                }
                @keyframes footerCursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

                .footer-social {
                    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
                }
                .footer-social:hover {
                    transform: translateY(-2px);
                    border-color: rgba(52,211,153,0.35) !important;
                    background: rgba(52,211,153,0.06) !important;
                }

                .footer-totop {
                    transition: color 0.2s ease, transform 0.2s ease;
                }
                .footer-totop:hover {
                    color: rgb(110,231,183);
                    transform: translateY(-2px);
                }

                @media (prefers-reduced-motion: reduce) {
                    .footer-line-glow { animation: none; }
                    .footer-social, .footer-social:hover, .footer-totop, .footer-totop:hover { transition: none; transform: none; }
                    .footer-cursor { animation: none; }
                }
            `}</style>
        </footer>
    );
}

export default Footer;
