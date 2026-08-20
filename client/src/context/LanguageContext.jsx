import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n/translations.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("leziz-lang") || "az");

  useEffect(() => {
    localStorage.setItem("leziz-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    const keys = key.split(".");
    let node = translations[lang];
    for (const k of keys) node = node?.[k];
    if (node == null) return key;
    return node;
  };

  const tr = (obj, field) => {
    if (!obj) return "";
    const base = String(field).replace(/_(az|en|ru)$/, "");
    return obj[`${base}_${lang}`] || obj[`${base}_az`] || obj[`${base}_en`] || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}