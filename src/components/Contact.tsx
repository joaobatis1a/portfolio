/* ══ CARD DE CONTATO ══ */
function ContactCard({
    icon,
    title,
    desc,
    href,
    cta,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    href: string;
    cta: string;
    accent: "emerald" | "cyan" | "violet";
}) {
    const accents = {
        emerald: {
            ring: "rgba(52,211,153,0.35)",
            glow: "rgba(52,211,153,0.16)",
            text: "text-emerald-300",
            iconBg: "rgba(52,211,153,0.1)",
        },
        cyan: {
            ring: "rgba(34,211,238,0.35)",
            glow: "rgba(34,211,238,0.16)",
            text: "text-cyan-300",
            iconBg: "rgba(34,211,238,0.1)",
        },
        violet: {
            ring: "rgba(167,139,250,0.35)",
            glow: "rgba(167,139,250,0.16)",
            text: "text-violet-300",
            iconBg: "rgba(167,139,250,0.1)",
        },
    }[accent];

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card group relative flex flex-col gap-4 rounded-2xl p-7 text-left"
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <span
                className="contact-card-glow absolute inset-0 rounded-2xl pointer-events-none opacity-0"
                style={{ background: `radial-gradient(120px circle at var(--mx,50%) var(--my,0%), ${accents.glow}, transparent 70%)` }}
            />

            <div
                className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: accents.iconBg }}
            >
                <span className={accents.text}>{icon}</span>
            </div>

            <div className="relative flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
            </div>

            <span
                className={`relative mt-1 inline-flex items-center gap-1.5 text-sm font-medium ${accents.text}`}
            >
                {cta}
                <svg
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </span>
        </a>
    );
}

/* ══ CARD DE E-MAIL (destaque principal) ══ */
function FeaturedEmailCard({ href }: { href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="featured-card group relative flex flex-col items-start gap-5 overflow-hidden rounded-3xl p-8 text-left sm:col-span-2 sm:flex-row sm:items-center sm:gap-8 sm:p-10"
            style={{
                background: "linear-gradient(135deg, rgba(52,211,153,0.08), rgba(34,211,238,0.06))",
                border: "1px solid rgba(52,211,153,0.3)",
            }}
        >
            <span
                className="featured-card-glow absolute inset-0 pointer-events-none opacity-0"
                style={{ background: `radial-gradient(220px circle at var(--mx,50%) var(--my,0%), rgba(52,211,153,0.18), transparent 70%)` }}
            />

            <div
                className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: "rgba(52,211,153,0.14)" }}
            >
                <svg className="h-7 w-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>

            <div className="relative flex flex-1 flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-emerald-400/70">
                    Canal principal
                </span>
                <h3 className="text-2xl font-bold text-white">E-mail</h3>
                <p className="text-sm leading-relaxed text-zinc-300 sm:max-w-md">
                    A forma mais rápida de falar comigo, seja pra orçamento, dúvida ou oportunidade. Respondo em até 24h.
                </p>
            </div>

            <span
                className="featured-card-cta relative mt-2 inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black sm:mt-0"
                style={{ background: "linear-gradient(135deg, #34d399, #22d3ee)" }}
            >
                <span className="relative z-10">Enviar e-mail</span>
                <svg
                    className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </span>
        </a>
    );
}

/* ══ SEÇÃO DE CONTATO ══ */
function Contact() {
    const emailHref = "https://mail.google.com/mail/?view=cm&to=profissionalba1is1a@gmail.com";

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const cards = e.currentTarget.querySelectorAll<HTMLElement>(".contact-card, .featured-card");
        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
            card.style.setProperty("--my", `${e.clientY - rect.top}px`);
        });
    };

    return (
        <section
            id="contact"
            className="relative flex flex-col items-center justify-center px-4 py-28 overflow-hidden"
        >
            {/* Grid sutil — mesma linguagem das outras seções */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(6,182,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.02) 1px,transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 w-full max-w-3xl text-center">
                <p className="text-xs tracking-widest text-emerald-500/40 uppercase">
                    // vamos construir algo juntos
                </p>
                <h2 className="mt-3 text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">
                    <span className="text-emerald-400/40 font-light">&lt;</span>
                    {" "}Contato{" "}
                    <span className="text-emerald-400/40 font-light">/&gt;</span>
                </h2>

                <p className="mx-auto mt-6 max-w-xl text-sm md:text-base leading-relaxed text-zinc-400">
                    Estou aberto a oportunidades e networking, e também desenvolvo{" "}
                    <span className="text-zinc-200">sites e soluções web sob orçamento</span>.
                    Toda mensagem tem resposta.
                </p>
            </div>

            {/* Cards de contato */}
            <div
                onMouseMove={handleMouseMove}
                className="relative z-10 mt-14 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2"
            >
                <FeaturedEmailCard href={emailHref} />

                <ContactCard
                    accent="emerald"
                    href="https://github.com/joaobatis1a"
                    title="GitHub"
                    desc="Veja o código dos meus projetos, contribuições e o que ando construindo."
                    cta="Ver perfil"
                    icon={
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    }
                />
                <ContactCard
                    accent="cyan"
                    href="https://linkedin.com/in/joao-batista-silva-neto"
                    title="LinkedIn"
                    desc="Trajetória profissional, experiências e conexões de carreira."
                    cta="Conectar"
                    icon={
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    }
                />
            </div>

            <style>{`
                .contact-card {
                    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
                }
                .contact-card:hover {
                    transform: translateY(-3px);
                    border-color: rgba(255,255,255,0.16) !important;
                    background: rgba(255,255,255,0.035) !important;
                }
                .contact-card:hover .contact-card-glow {
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }

                .featured-card {
                    transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
                }
                .featured-card:hover {
                    transform: translateY(-3px);
                    border-color: rgba(52,211,153,0.55) !important;
                    box-shadow: 0 0 32px rgba(52,211,153,0.16), 0 4px 24px rgba(0,0,0,0.25);
                }
                .featured-card:hover .featured-card-glow {
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }
            `}</style>
        </section>
    );
}

export default Contact;
