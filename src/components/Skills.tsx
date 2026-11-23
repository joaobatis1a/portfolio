import { useEffect, useRef, useState, useCallback } from "react";
import { useLang } from "../i18n/context";

// Logos inline para evitar bloqueio de hotlink
const CLAUDE_LOGO = "/logos/claude.png";
const LOVABLE_LOGO = "/logos/lovable.png";

const CATEGORIES = [
    {
        title: { pt: "Linguagens", en: "Languages" },
        skills: [
            { name: "HTML5",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
            { name: "CSS3",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
            { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
            { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { name: "Java",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
        ],
    },
    {
        title: { pt: "Frontend", en: "Frontend" },
        skills: [
            { name: "React",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "Next.js",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg", white: true },
            { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
            { name: "Vite",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
        ],
    },
    {
        title: { pt: "Prototipação", en: "Prototyping" },
        skills: [
            { name: "Figma",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
            { name: "V0",      icon: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4" },
            { name: "Lovable", icon: LOVABLE_LOGO },
        ],
    },
    {
        title: { pt: "Backend", en: "Backend" },
        skills: [
            { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" },
        ],
    },
    {
        title: { pt: "Bancos de dados", en: "Databases" },
        skills: [
            { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
            { name: "MySQL",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        ],
    },
    {
        title: { pt: "Deploy & Ferramentas", en: "Deploy & Tools" },
        skills: [
            { name: "Git",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
            { name: "GitHub",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", white: true },
            { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
            { name: "Netlify", icon: "/logos/netlify.png" },
            { name: "Vercel",  icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", white: true },
            { name: "Canva",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
        ],
    },
    {
        title: { pt: "Mensageria & APIs", en: "Messaging & APIs" },
        skills: [
            { name: "Resend", icon: "https://avatars.githubusercontent.com/u/109384852?s=200&v=4" },
        ],
    },
    {
        title: { pt: "IA & Produtividade", en: "AI & Productivity" },
        skills: [
            { name: "Claude",  icon: CLAUDE_LOGO },
            { name: "ChatGPT", icon: "/logos/chatgpt.png" },
            { name: "Gemini",  icon: "https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" },
        ],
    },
];

const AUTO_INTERVAL = 3400;

function HoloCard({ category, active, position }: {
    category: typeof CATEGORIES[0];
    active: boolean;
    position: number;
}) {
    const { pick } = useLang();
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [flicker, setFlicker] = useState(1);

    useEffect(() => {
        const doFlicker = () => {
            const wait = 2500 + Math.random() * 5000;
            setTimeout(() => {
                setFlicker(0.65 + Math.random() * 0.25);
                setTimeout(() => {
                    setFlicker(1);
                    setTimeout(() => { setFlicker(0.82); setTimeout(() => { setFlicker(1); doFlicker(); }, 70); }, 55);
                }, 45);
            }, wait);
        };
        doFlicker();
    }, []);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!active) return;
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        setTilt({
            x: (e.clientY - rect.top) / rect.height - 0.5,
            y: (e.clientX - rect.left) / rect.width - 0.5,
        });
    };

    const getTransform = () => {
        if (active) return `perspective(1000px) rotateX(${tilt.x * 14}deg) rotateY(${tilt.y * 14}deg) scale(1) translateX(0)`;
        if (position === -1) return "perspective(1000px) rotateY(28deg) scale(0.75) translateX(-58%)";
        if (position === 1)  return "perspective(1000px) rotateY(-28deg) scale(0.75) translateX(58%)";
        return "perspective(1000px) scale(0.5)";
    };

    const isVisible = position >= -1 && position <= 1;

    return (
        <div
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseEnter={() => { if (active) setHovered(true); }}
            onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
            className="absolute rounded-2xl overflow-hidden select-none"
            style={{
                width: "min(540px, 88vw)",
                left: "50%",
                marginLeft: "calc(min(540px, 88vw) / -2)",
                transform: getTransform(),
                transition: hovered && active
                    ? "transform 0.08s ease-out, opacity 0.4s, box-shadow 0.3s"
                    : "transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.4s, box-shadow 0.3s",
                opacity: active ? flicker : isVisible ? flicker * 0.4 : 0,
                pointerEvents: active ? "auto" : "none",
                zIndex: active ? 10 : isVisible ? 5 : 0,
                background: "rgba(0,110,255,0.07)",
                boxShadow: active
                    ? hovered
                        ? "0 0 0 1.5px rgba(0,190,255,0.8), 0 0 40px rgba(0,149,255,0.45), 0 0 80px rgba(0,100,255,0.2), inset 0 0 40px rgba(0,149,255,0.1)"
                        : "0 0 0 1.5px rgba(0,149,255,0.55), 0 0 30px rgba(0,149,255,0.3), 0 0 60px rgba(0,100,255,0.12), inset 0 0 30px rgba(0,100,255,0.07)"
                    : "0 0 0 1px rgba(0,149,255,0.2), 0 0 10px rgba(0,100,255,0.08)",
            }}
        >
            {/* Scan lines */}
            <div className="absolute inset-0 pointer-events-none z-10"
                style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,180,255,0.025) 3px,rgba(0,180,255,0.025) 4px)" }} />

            {/* Scan beam */}
            <div className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
                style={{
                    background: "linear-gradient(90deg,transparent,rgba(0,210,255,0.5),transparent)",
                    animation: "scanBeam 3.5s linear infinite",
                    opacity: active ? (hovered ? 1 : 0.45) : 0.2,
                }} />

            {/* Corner accents */}
            {(["tl","tr","bl","br"] as const).map(c => (
                <div key={c} className={`absolute w-5 h-5 pointer-events-none z-20
                    ${c==="tl"?"top-0 left-0 border-t-2 border-l-2 rounded-tl-2xl":""}
                    ${c==="tr"?"top-0 right-0 border-t-2 border-r-2 rounded-tr-2xl":""}
                    ${c==="bl"?"bottom-0 left-0 border-b-2 border-l-2 rounded-bl-2xl":""}
                    ${c==="br"?"bottom-0 right-0 border-b-2 border-r-2 rounded-br-2xl":""}
                `} style={{ borderColor: "rgba(0,180,255,0.6)" }} />
            ))}

            {/* Content */}
            <div className="relative z-10 p-8">
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(0,149,255,0.9)]" />
                    <h3 className="text-base font-bold tracking-widest uppercase"
                        style={{ color: "rgba(120,210,255,0.95)", textShadow: "0 0 12px rgba(0,180,255,0.7)" }}>
                        {pick(category.title)}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
                    <span className="font-mono text-[11px] tabular-nums text-blue-300/60">
                        {String(category.skills.length).padStart(2, "0")}
                    </span>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-6 justify-center">
                    {category.skills.map((skill) => (
                        <div key={skill.name} className="flex flex-col items-center gap-2 group/skill">
                            <div className="w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover/skill:scale-110 group-hover/skill:-translate-y-1">
                                <img
                                    src={skill.icon}
                                    alt={skill.name}
                                    className={`w-11 h-11 object-contain transition-all duration-300 group-hover/skill:drop-shadow-[0_0_8px_rgba(0,180,255,0.7)] ${"white" in skill && skill.white ? "brightness-0 invert" : ""}`}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            </div>
                            <span className="text-xs text-center font-medium tracking-wide transition-colors duration-300 group-hover/skill:text-blue-200"
                                style={{ color: "rgba(150,210,255,0.8)" }}>
                                {skill.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


function Skills() {
    const { t, pick } = useLang();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [glitchTab, setGlitchTab] = useState<number | null>(null);

    const goTo = useCallback((idx: number) => {
        const next = (idx + CATEGORIES.length) % CATEGORIES.length;
        // glitch the outgoing tab
        setGlitchTab(current);
        setTimeout(() => setGlitchTab(null), 220);
        setCurrent(next);
    }, [current]);

    // Auto-advance
    useEffect(() => {
        if (paused) return;
        const id = setTimeout(() => {
            setGlitchTab(current);
            setTimeout(() => setGlitchTab(null), 220);
            setCurrent(c => (c + 1) % CATEGORIES.length);
        }, AUTO_INTERVAL);
        return () => clearTimeout(id);
    }, [current, paused]);

    const getPosition = (i: number) => {
        const diff = (i - current + CATEGORIES.length) % CATEGORIES.length;
        if (diff === 0) return 0;
        if (diff === 1) return 1;
        if (diff === CATEGORIES.length - 1) return -1;
        return 99;
    };

    return (
        <section id="skills" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">

            {/* Title */}
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold"
                    style={{
                        color: "rgba(80,180,255,0.95)",
                        textShadow: "0 0 30px rgba(0,149,255,0.5), 0 0 60px rgba(0,100,255,0.2)",
                        animation: "holoGlow 3s ease-in-out infinite",
                    }}>
                    <span className="text-blue-500/40 font-light">&lt;</span>
                    {" "}{t("Habilidades", "Skills")}{" "}
                    <span className="text-blue-500/40 font-light">/&gt;</span>
                </h2>
                <p className="mt-4 mx-auto max-w-xl text-sm leading-relaxed text-zinc-400">{t("As tecnologias e ferramentas que uso no dia a dia.", "The technologies and tools I use every day.")}</p>
            </div>

            {/* Tabs */}
            <div className="mb-10 grid w-full max-w-3xl grid-cols-2 gap-2 px-2 sm:flex sm:flex-col sm:items-center">
            {[CATEGORIES.slice(0, Math.ceil(CATEGORIES.length / 2)), CATEGORIES.slice(Math.ceil(CATEGORIES.length / 2))].map((row, r) => (
                <div key={r} className="contents sm:flex sm:flex-wrap sm:justify-center sm:gap-2">
                {row.map((cat) => {
                    const i = CATEGORIES.indexOf(cat);
                    const isActive = current === i;
                    const isGlitching = glitchTab === i;
                    return (
                        <button
                            key={cat.title.en}
                            onClick={() => { goTo(i); setPaused(true); setTimeout(() => setPaused(false), 8000); }}
                            className={`holo-tab relative flex items-center justify-center w-full min-w-0 px-3 py-2.5 sm:w-auto sm:min-w-[148px] sm:px-4 text-center text-[11px] leading-tight font-semibold tracking-wider uppercase transition-all duration-300 ${isActive ? "is-active" : ""}`}
                            style={{
                                background: isActive ? "rgba(0,149,255,0.16)" : undefined,
                                color: isActive ? "rgba(140,220,255,1)" : "rgba(150,210,255,0.8)",
                                textShadow: isActive ? "0 0 10px rgba(0,200,255,0.8)" : "none",
                                borderRadius: "999px",
                                transform: isGlitching ? `translateX(${i % 2 ? 3 : -3}px)` : "translateX(0)",
                                transition: isGlitching ? "transform 0.05s" : "all 0.3s",
                                filter: isGlitching ? "brightness(1.8) saturate(2)" : "none",
                            }}
                        >
                            {/* Fill animation on active */}
                            {isActive && (
                                <span
                                    key={`fill-${i}-${current}`}
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: "linear-gradient(90deg, rgba(0,149,255,0.22) 0%, rgba(0,220,255,0.08) 100%)",
                                        animation: `tabFill ${AUTO_INTERVAL}ms linear forwards`,
                                    }}
                                />
                            )}
                            {/* Glitch scanline overlay */}
                            {isGlitching && (
                                <span className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,200,255,0.15) 2px,rgba(0,200,255,0.15) 3px)",
                                        animation: "glitchFlash 0.22s ease-out forwards",
                                    }} />
                            )}
                            {pick(cat.title)}
                        </button>
                    );
                })}
                </div>
            ))}
            </div>

            {/* Carousel + HUD arrows */}
            <div
                className="relative w-full flex items-center justify-center"
                style={{ height: "300px" }}
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {CATEGORIES.map((cat, i) => (
                    <HoloCard
                        key={cat.title.en}
                        category={cat}
                        active={i === current}
                        position={getPosition(i)}
                    />
                ))}
            </div>

            {/* Dots + progress bar */}
            <div className="mt-16 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2.5">
                    {CATEGORIES.map((_, i) => (
                        <button key={i}
                            aria-label={`${i + 1}`}
                            onClick={() => { goTo(i); setPaused(true); setTimeout(() => setPaused(false), 8000); }}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: current === i ? "22px" : "8px",
                                height: "8px",
                                border: `1px solid ${current === i ? "rgba(0,200,255,0.9)" : "rgba(0,149,255,0.55)"}`,
                                background: current === i ? "linear-gradient(90deg,rgba(0,149,255,0.9),rgba(0,210,255,0.9))" : "rgba(0,110,255,0.08)",
                                boxShadow: current === i ? "0 0 10px rgba(0,180,255,0.7)" : "0 0 6px rgba(0,149,255,0.2)",
                            }} />
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] tabular-nums text-blue-300/60">{String(current + 1).padStart(2, "0")}</span>
                    <div className="relative w-56 h-[3px] rounded-full overflow-hidden"
                        style={{ background: "rgba(0,110,255,0.12)", boxShadow: "inset 0 0 0 1px rgba(0,149,255,0.25)" }}>
                        <div key={current}
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                                background: "linear-gradient(90deg,rgba(0,149,255,0.8),rgba(0,220,255,0.95))",
                                animation: paused ? "none" : `progressBar ${AUTO_INTERVAL}ms linear forwards`,
                                boxShadow: "0 0 8px rgba(0,180,255,0.7)",
                            }} />
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-blue-300/30">{String(CATEGORIES.length).padStart(2, "0")}</span>
                </div>
            </div>

            <style>{`
                .holo-tab {
                    position: relative; isolation: isolate; overflow: hidden;
                    background-color: rgba(0,110,255,0.08);
                    background-image: repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,180,255,0.05) 3px 4px);
                    box-shadow: 0 0 0 1px rgba(0,149,255,0.5), 0 0 28px rgba(0,149,255,0.22), inset 0 0 26px rgba(0,100,255,0.1);
                    -webkit-backdrop-filter: blur(9px); backdrop-filter: blur(9px);
                }
                .holo-tab::before {
                    content: ""; position: absolute; inset: 0; border-radius: inherit; z-index: 3; pointer-events: none;
                    border: 2px solid rgba(0,190,255,0.9); opacity: 0.85; transition: opacity 0.5s;
                    -webkit-mask: linear-gradient(#000 0 0) top left / 18px 18px no-repeat, linear-gradient(#000 0 0) top right / 18px 18px no-repeat, linear-gradient(#000 0 0) bottom left / 18px 18px no-repeat, linear-gradient(#000 0 0) bottom right / 18px 18px no-repeat;
                            mask: linear-gradient(#000 0 0) top left / 18px 18px no-repeat, linear-gradient(#000 0 0) top right / 18px 18px no-repeat, linear-gradient(#000 0 0) bottom left / 18px 18px no-repeat, linear-gradient(#000 0 0) bottom right / 18px 18px no-repeat;
                }
                .holo-tab.is-active { background-color: rgba(0,149,255,0.16); box-shadow: 0 0 0 1px rgba(0,149,255,0.7), 0 0 34px rgba(0,149,255,0.4), inset 0 0 26px rgba(0,100,255,0.16); }
                .holo-tab.is-active::before, .holo-tab:hover::before { opacity: 1; }
                @keyframes scanBeam {
                    0%   { top: -2px; }
                    100% { top: 100%; }
                }
                @keyframes holoGlow {
                    0%,100% { text-shadow: 0 0 30px rgba(0,149,255,0.5),0 0 60px rgba(0,100,255,0.2); }
                    50%     { text-shadow: 0 0 50px rgba(0,180,255,0.85),0 0 100px rgba(0,130,255,0.4); }
                }
                @keyframes progressBar {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
                @keyframes tabFill {
                    from { opacity: 0; width: 0%; }
                    to   { opacity: 1; width: 100%; }
                }
                @keyframes glitchFlash {
                    0%   { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes hudPulse {
                    0%,100% { box-shadow: 0 0 14px rgba(0,149,255,0.35),inset 0 0 8px rgba(0,100,255,0.1); }
                    50%     { box-shadow: 0 0 24px rgba(0,190,255,0.6),inset 0 0 14px rgba(0,149,255,0.2); }
                }
            `}</style>
        </section>
    );
}

export default Skills;
