import { useEffect, useState, useRef } from "react";

const ITEMS = [
    { key: "nome     ", value: "João Batista da Silva Neto" },
    { key: "idade    ", value: "19 anos" },
    { key: "local    ", value: "Paulista, PE 📍" },
    { key: "curso    ", value: "ADS — Frassinetti do Recife" },
    { key: "foco     ", value: "Front-End Development 💻" },
    { key: "projetos ", value: "5 entregues · 2 premiados 🏆" },
];

const STEP_MS = 520;

function Terminal() {
    const [step, setStep] = useState(-1); // -1 = not started
    const [pct, setPct] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    // Intersection trigger
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    setStep(0); // show "Inicializando..."
                    ITEMS.forEach((_, i) => {
                        setTimeout(() => {
                            setStep(i + 1);
                            setPct(Math.round(((i + 1) / ITEMS.length) * 100));
                        }, (i + 1) * STEP_MS);
                    });
                    // final line
                    setTimeout(() => setStep(ITEMS.length + 1), (ITEMS.length + 1) * STEP_MS);
                }
            },
            { threshold: 0.25 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Blinking cursor
    useEffect(() => {
        const id = setInterval(() => setShowCursor(c => !c), 530);
        return () => clearInterval(id);
    }, []);

    const done = step > ITEMS.length;

    return (
        <div ref={ref} className="w-full font-mono text-xs">
            {/* Title bar */}
            <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-t-lg px-3 py-2 border border-white/8">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[10px] text-zinc-500 tracking-wider">about.sh — bash</span>
            </div>

            {/* Body */}
            <div className="bg-[#0d0d0d] border border-t-0 border-white/8 rounded-b-lg px-4 py-4 min-h-[230px] leading-6">

                {/* Init line */}
                {step >= 0 && (
                    <div className="text-zinc-500 mb-2">
                        <span className="text-emerald-400">~/portfolio</span>
                        <span className="text-zinc-600"> $ </span>
                        <span>./about.sh</span>
                    </div>
                )}

                {step >= 0 && (
                    <div className="text-zinc-400 mb-3">&gt; Inicializando João Batista...</div>
                )}

                {/* Data items */}
                {ITEMS.slice(0, Math.max(0, step)).map((item, i) => (
                    <div key={i} className="flex gap-2 text-[11px]">
                        <span className="text-cyan-500 select-none">✓</span>
                        <span className="text-zinc-500">{item.key}</span>
                        <span className="text-zinc-300">{item.value}</span>
                    </div>
                ))}

                {/* Progress bar */}
                {step >= 1 && (
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-zinc-600">[</span>
                        <div className="flex-1 h-[6px] bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-500"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="text-zinc-600">]</span>
                        <span className="text-cyan-400 w-8 text-right">{pct}%</span>
                    </div>
                )}

                {/* Final line */}
                {done && (
                    <div className="mt-3 text-emerald-400">
                        ✓ Build concluído. Pronto para colaborar!
                    </div>
                )}

                {/* Cursor */}
                {!done && step >= 0 && (
                    <span className={`inline-block w-[7px] h-[13px] bg-cyan-400 ml-0.5 align-middle mt-1 ${showCursor ? "opacity-100" : "opacity-0"}`} />
                )}
            </div>
        </div>
    );
}

function About() {
    return (
        <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">

            {/* Nebula glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/4 blur-3xl" />
            </div>

            {/* Section title */}
            <div className="relative z-10 text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent"
                    style={{ textShadow: "none" }}>
                    <span className="text-emerald-400/40 font-light">&lt;</span>
                    {" "}Sobre{" "}
                    <span className="text-emerald-400/40 font-light">/&gt;</span>
                </h2>
            </div>

            <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 md:gap-24 items-center">

                {/* ── Foto ── */}
                <div className="flex justify-center md:justify-start">
                    <div
                        className="relative flex-shrink-0"
                        style={{ perspective: "800px" }}
                        onMouseMove={e => {
                            const el = e.currentTarget;
                            const rect = el.getBoundingClientRect();
                            const x = (e.clientX - rect.left) / rect.width  - 0.5;
                            const y = (e.clientY - rect.top)  / rect.height - 0.5;
                            const card = el.querySelector<HTMLElement>(".photo-tilt");
                            const glow = el.querySelector<HTMLElement>(".photo-glow");
                            if (card) card.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.04)`;
                            if (glow) { glow.style.left = `${(x + 0.5) * 100}%`; glow.style.top = `${(y + 0.5) * 100}%`; glow.style.opacity = "1"; }
                        }}
                        onMouseLeave={e => {
                            const el = e.currentTarget;
                            const card = el.querySelector<HTMLElement>(".photo-tilt");
                            const glow = el.querySelector<HTMLElement>(".photo-glow");
                            if (card) card.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
                            if (glow) glow.style.opacity = "0";
                        }}
                    >
                        {/* Gradient border */}
                        <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-green-400 opacity-60 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Tilt card */}
                        <div
                            className="photo-tilt relative rounded-2xl overflow-hidden"
                            style={{ transition: "transform 0.15s ease-out", transformStyle: "preserve-3d", willChange: "transform" }}
                        >
                            <img
                                src="/foto_perfil.jpeg"
                                alt="João Batista"
                                className="w-56 h-72 md:w-64 md:h-80 object-cover object-top rounded-2xl block"
                            />
                            {/* Moving shine */}
                            <div
                                className="photo-glow pointer-events-none absolute w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2"
                                style={{
                                    background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)",
                                    opacity: 0,
                                    transition: "opacity 0.2s ease",
                                    top: "50%", left: "50%",
                                }}
                            />
                            {/* Scanline overlay */}
                            <div className="absolute inset-0 pointer-events-none rounded-2xl"
                                style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)" }} />
                        </div>
                    </div>
                </div>

                {/* ── Conteúdo ── */}
                <div className="flex flex-col gap-5">
                    <h2 className="text-2xl md:text-3xl font-bold leading-snug text-white">
                        Dev front-end em construção,{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            com projetos reais
                        </span>{" "}
                        pra mostrar.
                    </h2>

                    <p className="text-zinc-400 text-sm leading-relaxed max-w-xl text-justify">
                        Comecei cedo, aprendo rápido e já entreguei projetos reconhecidos por bancas técnicas.
                        Acredito que bom front-end não é só visual — é código limpo, experiência fluida e atenção
                        ao detalhe que faz a diferença.
                    </p>

                    <Terminal />
                </div>
            </div>
        </section>
    );
}

export default About;
