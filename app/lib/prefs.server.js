import { cookies, headers } from "next/headers";
import { COOKIE, resolveLanguage, resolveWallpaper } from "./prefs";

/** Read the visitor's preferences for server rendering. */
export async function getInitialPrefs() {
    const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
    return {
        language:  resolveLanguage(cookieStore.get(COOKIE.language)?.value, headerStore.get("accept-language")),
        wallpaper: resolveWallpaper(cookieStore.get(COOKIE.wallpaper)?.value),
        booted:    cookieStore.get(COOKIE.booted)?.value === "1",
    };
}
