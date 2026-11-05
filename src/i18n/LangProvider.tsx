import { useEffect, useState, type ReactNode } from "react";
import { LangContext, type Lang } from "./context";

const META = {
    pt: {
        title: "João Batista Neto | Desenvolvedor Front-End | React, Next.js, TypeScript",
        description: "João Batista Neto, desenvolvedor front-end de Paulista, PE. React, Next.js e TypeScript. Projetos premiados por banca técnica: P.O.N.T.E., Limpattack e Benevo.",
    },
    en: {
        title: "João Batista Neto | Front-End Developer | React, Next.js, TypeScript",
        description: "João Batista Neto, front-end developer from Paulista, Brazil. React, Next.js and TypeScript. Award-winning projects: P.O.N.T.E., Limpattack and Benevo.",
    },
};

function initialLang(): Lang {
    try {
        const saved = localStorage.getItem("lang");
        if (saved === "pt" || saved === "en") return saved;
    } catch { /* armazenamento indisponível */ }
    return "pt";
}

export default function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(initialLang);

    const setLang = (l: Lang) => {
        setLangState(l);
        try { localStorage.setItem("lang", l); } catch { /* ignora */ }
    };

    useEffect(() => {
        document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
        document.title = META[lang].title;
        document.querySelector('meta[name="description"]')?.setAttribute("content", META[lang].description);
    }, [lang]);

    return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}
