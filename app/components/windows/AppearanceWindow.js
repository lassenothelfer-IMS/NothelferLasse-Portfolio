"use client";

import { WALLPAPERS } from "../../data/wallpapers";
import { LANGUAGES } from "../../lib/prefs";
import { usePreferences, useStrings } from "../../context/PreferencesContext";
import { useDesktop } from "../../context/DesktopContext";
import { pick } from "../../i18n/pick";
import styles from "./AppearanceWindow.module.css";

const LANGUAGE_NAMES = { en: "English", de: "Deutsch" };

/** Control panel: desktop pattern, language, and replaying the startup screen. */
export default function AppearanceWindow() {
    const { language, setLanguage, wallpaper, setWallpaper } = usePreferences();
    const T = useStrings();
    const { restart } = useDesktop();

    return (
        <div className={styles.panel}>
            <fieldset className="group">
                <legend>{T.appearance.pattern}</legend>
                <div className={styles.swatches}>
                    {WALLPAPERS.map((wp) => (
                        <label key={wp.id} className={styles.swatch}>
                            <input
                                type="radio"
                                name="wallpaper"
                                value={wp.id}
                                checked={wallpaper === wp.id}
                                onChange={() => setWallpaper(wp.id)}
                                className="visually-hidden"
                            />
                            <span
                                className={styles.sample}
                                style={{ "--a": wp.a, "--b": wp.b }}
                                aria-hidden="true"
                            />
                            <span className={styles.name}>{pick(wp.name, language)}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="group">
                <legend>{T.appearance.language}</legend>
                <div className={styles.radios}>
                    {LANGUAGES.map((lang) => (
                        <label key={lang} className="radio-label" lang={lang}>
                            <input
                                type="radio"
                                name="language"
                                value={lang}
                                checked={language === lang}
                                onChange={() => setLanguage(lang)}
                                className="radio"
                            />
                            {LANGUAGE_NAMES[lang]}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="group">
                <legend>{T.appearance.startup}</legend>
                <button type="button" className="btn" onClick={restart}>{T.appearance.replay}</button>
            </fieldset>
        </div>
    );
}
