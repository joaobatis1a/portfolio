import { createContext, useContext } from "react";

export type Lang = "pt" | "en";

/** Texto nos dois idiomas, para dados (projetos, linha do tempo, etc.) */
export type L10n<T = string> = { pt: T; en: T };

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
    lang: "pt",
    setLang: () => {},
});

export function useLang() {
    const { lang, setLang } = useContext(LangContext);
    /** t("Olá", "Hello") devolve o texto do idioma atual */
    const t = <T,>(pt: T, en: T): T => (lang === "en" ? en : pt);
    /** pick({ pt, en }) devolve o valor do idioma atual */
    const pick = <T,>(v: L10n<T>): T => v[lang];
    return { lang, setLang, t, pick };
}
