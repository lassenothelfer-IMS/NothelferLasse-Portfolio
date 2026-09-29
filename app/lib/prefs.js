// Visitor preferences, shared by server and client.
//
// Stored in cookies (not localStorage) so the server can render the right
// language, wallpaper and boot state on the very first paint — no flash of
// the wrong language for returning visitors.
import { WALLPAPERS, DEFAULT_WALLPAPER } from "../data/wallpapers";

export const LANGUAGES = ["en", "de"];

export const COOKIE = {
    language:  "ln_lang",
    wallpaper: "ln_wallpaper",
    booted:    "ln_booted",
};

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Saved choice wins. On a first visit, follow the browser: any German
 * locale (de, de-CH, de-AT …) gets German, everything else English.
 */
export function resolveLanguage(saved, acceptLanguage) {
    if (LANGUAGES.includes(saved)) return saved;
    const preferred = (acceptLanguage ?? "").split(",")[0].trim().toLowerCase();
    return preferred.startsWith("de") ? "de" : "en";
}

export function resolveWallpaper(saved) {
    return WALLPAPERS.some((w) => w.id === saved) ? saved : DEFAULT_WALLPAPER;
}

/** Client-only: persist a preference for a year. */
export function writeCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
}
