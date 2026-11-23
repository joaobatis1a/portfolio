import { Link } from "react-scroll";
import { useLang } from "../i18n/context";

/* ══ LINKS DO MENU (mesmos destinos do navbar) ══ */
const NAV = [
    { to: "about",     pt: "Sobre",       en: "About" },
    { to: "skills",    pt: "Habilidades", en: "Skills" },
    { to: "projects",  pt: "Projetos",    en: "Projects" },
    { to: "frontista", pt: "Frontista",   en: "Frontista" },
    { to: "training",  pt: "Trajetória",  en: "Journey" },
    { to: "contact",   pt: "Contato",     en: "Contact" },
];

const SOCIALS = [
    {
        label: "GitHub",
        href: "https://github.com/joaobatis1a",
        d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/joao-batista-silva-neto",
        d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
        label: "Instagram",
        href: "https://instagram.com/frontista",
        d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    },
    {
        label: "TikTok",
        href: "https://tiktok.com/@frontista",
        d: "M16.6 5.82s.51.5 0 0A4.278 4.278 0 0115.54 3h-3.09v12.4a2.592 2.592 0 01-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 004.31 1.38V7.3s-1.88.09-3.24-1.48z",
    },
];

/* ══ FOOTER: card de vidro solto sobre o fundo de estrelas ══ */
function Footer() {
    const { t } = useLang();
    const year = new Date().getFullYear();
    const emailHref = "https://mail.google.com/mail/?view=cm&to=profissionalba1is1a@gmail.com";
    const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <footer className="ftx-wrap relative z-10 px-4 pb-6 pt-10">
            <div className="ftx">
                {/* Chamada */}
                <div className="ftx-cta">
                    <div>
                        <h2 className="ftx-h">
                            {t("Vamos tirar sua", "Let's get your")}
                            <br />
                            {t("ideia do papel?", "idea off the ground?")}
                        </h2>
                        <div className="ftx-line" />
                        <p className="ftx-sub">
                            {t("Aberto a oportunidades, networking e sites sob orçamento. Toda mensagem tem resposta.",
                               "Open to opportunities, networking and custom websites. Every message gets a reply.")}
                        </p>
                    </div>
                    <div className="ftx-btns">
                        <a href={emailHref} target="_blank" rel="noopener noreferrer" className="ftx-btn ftx-btn-pri">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5" /></svg>
                            {t("Enviar e-mail", "Send email")}
                        </a>
                        <a href="/batista-curriculo.pdf" download="Joao-Batista-Neto-Curriculo.pdf" className="ftx-btn">
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 2v8M4.5 7L8 10.5 11.5 7M2.5 13.5h11" /></svg>
                            {t("Baixar currículo", "Download résumé (PT)")}
                        </a>
                    </div>
                </div>

                <div className="ftx-sep" />

                {/* Corpo */}
                <div className="ftx-grid">
                    <div className="ftx-c1">
                        <p className="ftx-brand">
                            <i>&lt;</i> <b>Frontista</b> <i>/&gt;</i>
                        </p>
                        <p className="ftx-tag">{t("código, criatividade e um toque de café.", "code, creativity and a dash of coffee.")}</p>
                        <span className="ftx-st"><i />{t("disponível para novos projetos", "available for new projects")}</span>
                        <div className="ftx-soc">
                            {SOCIALS.map((s) => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.d} /></svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="ftx-term">
                        <div className="ftx-term-tb">
                            <i style={{ background: "#f87171" }} /><i style={{ background: "#fbbf24" }} /><i style={{ background: "#4ade80" }} />
                            <span>status.sh</span>
                        </div>
                        <div className="ftx-term-bd">
                            <p className="c"><b>$</b> whoami</p>
                            <p className="o">{t("joão_batista, frontend dev", "joão_batista, frontend dev")}</p>
                            <p className="c"><b>$</b> status</p>
                            <p className="o">{t("construindo algo novo", "building something new")}<span className="ftx-cur" /></p>
                            <p className="c"><b>$</b> uptime</p>
                            <p className="o cy">{t("codando desde 2022", "coding since 2022")}</p>
                        </div>
                    </div>

                    <div>
                        <p className="ftx-lab">{t("navegue", "explore")}</p>
                        <nav className="ftx-nav" aria-label={t("Rodapé", "Footer")}>
                            {NAV.map((n) => (
                                <Link key={n.to} to={n.to} smooth offset={-70} duration={500} href={`#${n.to}`}>
                                    {t(n.pt, n.en)}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Barra inferior */}
                <div className="ftx-bot">
                    <span>© {year} Frontista. {t("Todos os direitos reservados.", "All rights reserved.")}</span>
                    <span className="ftx-mk">
                        {t("feito com", "made with")} <span>React</span> &amp; <span>Tailwind</span>
                    </span>
                    <button type="button" onClick={scrollTop} aria-label={t("Voltar ao topo", "Back to top")}>
                        {t("voltar ao topo", "back to top")}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 15l7-7 7 7" /></svg>
                    </button>
                </div>
            </div>

            <style>{`
                .ftx { position: relative; max-width: 1400px; margin: 0 auto; border-radius: 28px; padding: 48px 48px 22px; overflow: hidden; isolation: isolate;
                    background: linear-gradient(135deg, rgba(52,211,153,.07), rgba(34,211,238,.04) 45%, rgba(0,0,0,.35));
                    border: 1px solid rgba(52,211,153,.24); -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
                    box-shadow: 0 40px 90px -20px rgba(0,0,0,.85), 0 0 70px -10px rgba(52,211,153,.14); }
                .ftx::before { content: ""; position: absolute; left: 8%; right: 8%; top: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(52,211,153,.9), rgba(34,211,238,.9), transparent); opacity: .8; }
                .ftx::after { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(420px 260px at 0% 0%, rgba(52,211,153,.14), transparent 70%); }
                .ftx-cta { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; flex-wrap: wrap; }
                .ftx-h { margin: 0; font: 400 clamp(3.2rem, 7.4vw, 6.2rem)/.9 "Bebas Neue", Impact, sans-serif; letter-spacing: .01em; text-transform: uppercase;
                    background: linear-gradient(90deg, #34d399, #22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }
                .ftx-line { height: 2px; width: min(420px, 70%); margin: 18px 0 14px; border-radius: 2px; background: linear-gradient(90deg, #34d399, #22d3ee, transparent); box-shadow: 0 0 14px rgba(34,211,238,.45); }
                .ftx-sub { margin: 0; max-width: 44ch; font-size: 14px; line-height: 1.6; color: #a1a1aa; }
                .ftx-btns { display: flex; gap: 10px; flex-wrap: wrap; }
                .ftx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 8px 18px; border-radius: 12px;
                    border: 1px solid rgba(255,255,255,.14); background: rgba(255,255,255,.05); text-decoration: none; font: 600 13px "Poppins", sans-serif; color: #fff;
                    transition: transform .15s, border-color .15s, background .15s, filter .15s; }
                .ftx-btn svg { width: 14px; height: 14px; flex: none; }
                .ftx-btn:hover { transform: translateY(-1px); border-color: #34d399; background: rgba(52,211,153,.14); }
                .ftx-btn-pri { border-color: transparent; color: #02130a; background: linear-gradient(90deg, #34d399, #22d3ee); }
                .ftx-btn-pri:hover { filter: brightness(1.1); background: linear-gradient(90deg, #34d399, #22d3ee); border-color: transparent; }
                .ftx-sep { height: 1px; margin: 38px 0 32px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.1) 12%, rgba(255,255,255,.1) 88%, transparent); }
                .ftx-grid { display: grid; grid-template-columns: 1.1fr 1fr .8fr; gap: 36px; align-items: start; }
                .ftx-brand { margin: 0; font: 700 26px "Poppins", sans-serif; letter-spacing: -.01em; }
                .ftx-brand i { font-style: normal; font-weight: 300; color: rgba(52,211,153,.4); }
                .ftx-brand b { background: linear-gradient(90deg, #34d399, #4ade80, #22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }
                .ftx-tag { margin: 8px 0 14px; font-size: 13px; font-style: italic; color: #71717a; }
                .ftx-st { display: inline-flex; align-items: center; gap: 8px; font: 500 11px ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; color: rgba(52,211,153,.8); }
                .ftx-st i { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 8px rgba(74,222,128,.8); animation: ftxPulse 1.8s ease-in-out infinite; }
                @keyframes ftxPulse { 50% { opacity: .35; } }
                .ftx-soc { display: flex; gap: 10px; margin-top: 20px; }
                .ftx-soc a { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.09); color: #a1a1aa; transition: color .2s, border-color .2s, transform .2s; }
                .ftx-soc a:hover { color: #6ee7b7; border-color: rgba(52,211,153,.5); transform: translateY(-2px); }
                .ftx-soc svg { width: 18px; height: 18px; fill: currentColor; }
                .ftx-term { border-radius: 12px; overflow: hidden; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.09); font: 400 12px/1.75 ui-monospace, "Roboto Mono", monospace; }
                .ftx-term-tb { display: flex; align-items: center; gap: 6px; padding: 9px 12px; border-bottom: 1px solid rgba(255,255,255,.07); }
                .ftx-term-tb i { width: 8px; height: 8px; border-radius: 50%; }
                .ftx-term-tb span { margin-left: 6px; font-size: 10.5px; color: #52525b; }
                .ftx-term-bd { padding: 12px 14px; }
                .ftx-term-bd p { margin: 0; }
                .ftx-term-bd .c { color: #71717a; } .ftx-term-bd .c b { color: #34d399; font-weight: 400; }
                .ftx-term-bd .o { color: #d4d4d8; margin-bottom: 6px; } .ftx-term-bd .o.cy { color: rgba(103,232,249,.85); margin-bottom: 0; }
                .ftx-cur { display: inline-block; width: 7px; height: 13px; margin-left: 2px; vertical-align: -2px; background: #d4d4d8; animation: ftxBlink 1s steps(1) infinite; }
                @keyframes ftxBlink { 50% { opacity: 0; } }
                .ftx-lab { margin: 0 0 14px; font: 500 10.5px ui-monospace, monospace; letter-spacing: .2em; text-transform: uppercase; color: #52525b; }
                .ftx-nav { display: grid; gap: 9px; }
                .ftx-nav a { font-size: 14px; color: #a1a1aa; text-decoration: none; width: max-content; cursor: pointer; transition: color .2s; }
                .ftx-nav a:hover { color: #6ee7b7; }
                .ftx-bot { display: flex; align-items: center; justify-content: space-between; gap: 12px 20px; flex-wrap: wrap; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.06); font-size: 12px; color: #52525b; }
                .ftx-mk span:first-child { color: rgba(52,211,153,.65); } .ftx-mk span:last-child { color: rgba(34,211,238,.65); }
                .ftx-bot button { display: inline-flex; align-items: center; gap: 6px; background: none; border: 0; padding: 0; cursor: pointer; color: #71717a; font-size: 12px; }
                .ftx-bot button:hover { color: #6ee7b7; }
                .ftx-bot button svg { width: 12px; height: 12px; }
                @media (max-width: 860px) { .ftx { padding: 36px 24px 18px; border-radius: 24px; } .ftx-grid { grid-template-columns: 1fr 1fr; } .ftx-c1 { grid-column: 1 / -1; } }
                @media (max-width: 560px) { .ftx-grid { grid-template-columns: 1fr; gap: 28px; } .ftx-nav { grid-template-columns: 1fr 1fr; column-gap: 20px; } .ftx-btns { width: 100%; } .ftx-btns .ftx-btn { flex: 1 1 100%; } .ftx-bot { flex-direction: column; align-items: flex-start; } }
                @media (prefers-reduced-motion: reduce) { .ftx-st i, .ftx-cur { animation: none; } }
            `}</style>
        </footer>
    );
}

export default Footer;
