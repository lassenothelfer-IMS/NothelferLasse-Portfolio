"use client";

import { useEffect, useState } from "react";
import PixelIcon from "../icons/PixelIcon";
import { useStrings } from "../../context/PreferencesContext";
import { COOKIE, writeCookie } from "../../lib/prefs";
import { SITE } from "../../config/site";
import styles from "./BootScreen.module.css";

const BOOT_MS = 1600; // end of the CSS timeline in BootScreen.module.css
const FADE_MS = 250;

// The "extensions" that load along the bottom of the screen
const EXTENSIONS = ["folder", "document", "toolbox", "envelope", "globe", "monitor"];

/**
 * Startup screen, shown once per browser (and again via "Restart…").
 *
 * The animation is pure CSS, so on a first visit it starts with the
 * server-rendered HTML — before any JavaScript loads. `fromNavigation`
 * tells the timer to count from page load rather than from mount.
 */
export default function BootScreen({ fromNavigation, onDone }) {
    const T = useStrings();
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        writeCookie(COOKIE.booted, "1");

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            onDone();
            return;
        }

        const elapsed = fromNavigation ? performance.now() : 0;
        const timer = setTimeout(() => setLeaving(true), Math.max(0, BOOT_MS - elapsed));

        // Any key or click skips — and is swallowed so it doesn't also
        // act on the desktop underneath (e.g. Esc closing a window).
        const skip = (e) => {
            e.stopPropagation();
            setLeaving(true);
        };
        window.addEventListener("keydown", skip, true);
        window.addEventListener("pointerdown", skip, true);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("keydown", skip, true);
            window.removeEventListener("pointerdown", skip, true);
        };
    }, [fromNavigation, onDone]);

    useEffect(() => {
        if (!leaving) return;
        const timer = setTimeout(onDone, FADE_MS);
        return () => clearTimeout(timer);
    }, [leaving, onDone]);

    return (
        <div
            className={`${styles.boot} ${leaving ? styles.leaving : ""}`}
            role="status"
            aria-label={`${T.boot.starting}…`}
        >
            <div className={styles.startup}>
                <PixelIcon name="computer" size={96} />
            </div>

            <div className={styles.welcome}>
                <div className={styles.welcomeBody}>
                    <PixelIcon name="computer" size={48} />
                    <div>
                        <p className={styles.small}>{T.boot.welcome}</p>
                        <p className={styles.name}>{SITE.name}</p>
                        <p className={styles.small}>{T.boot.os}</p>
                    </div>
                </div>
                <div className={styles.progress}>
                    <span />
                </div>
                <p className={styles.status}>{T.boot.starting}…</p>
            </div>

            <ul className={styles.extensions} aria-hidden="true">
                {EXTENSIONS.map((name, i) => (
                    <li key={name} style={{ animationDelay: `${600 + i * 120}ms` }}>
                        <PixelIcon name={name} size={32} />
                    </li>
                ))}
            </ul>

            <p className={styles.skip}>{T.boot.skip}</p>
        </div>
    );
}
