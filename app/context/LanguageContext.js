"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();
const LANG_STORAGE_KEY = "site-language";

export function LanguageProvider({ children }) {
  // Start with the default so server and first client render match,
  // then hydrate from localStorage on the client.
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "en" || saved === "de") setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
