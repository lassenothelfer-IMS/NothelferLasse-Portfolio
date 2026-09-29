"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { COOKIE, writeCookie } from "../lib/prefs";
import { STRINGS } from "../i18n/strings";

const PreferencesContext = createContext(null);

/**
 * Language + wallpaper, seeded from the server (which read the cookies),
 * so the first paint is already correct. Changes are written back to
 * cookies for the next visit.
 */
export function PreferencesProvider({ initialLanguage, initialWallpaper, children }) {
    const [language,  setLanguageState]  = useState(initialLanguage);
    const [wallpaper, setWallpaperState] = useState(initialWallpaper);

    const setLanguage = useCallback((next) => {
        setLanguageState(next);
        writeCookie(COOKIE.language, next);
    }, []);

    const setWallpaper = useCallback((next) => {
        setWallpaperState(next);
        writeCookie(COOKIE.wallpaper, next);
    }, []);

    // Keep <html lang> in sync for screen readers and hyphenation.
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(
        () => ({ language, setLanguage, wallpaper, setWallpaper }),
        [language, setLanguage, wallpaper, setWallpaper],
    );

    return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
    return useContext(PreferencesContext);
}

/** Interface strings for the current language. */
export function useStrings() {
    return STRINGS[useContext(PreferencesContext).language];
}
