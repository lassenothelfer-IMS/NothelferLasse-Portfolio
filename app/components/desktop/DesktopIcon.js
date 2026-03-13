"use client";

import { useState } from "react";
import styles from "./DesktopIcon.module.css";

/**
 * DesktopIcon
 *
 * Props:
 *   id      {string}   Matches a window id in WINDOW_CONFIGS
 *   icon    {string}   Emoji glyph
 *   label   {string}   Text beneath the icon
 *   onClick {fn(id)}   Triggers openWindow in useWindowManager
 */
export default function DesktopIcon({ id, icon, label, onClick }) {
    const [selected, setSelected] = useState(false);

    const handleClick = () => {
        // Brief visual selection flash before window opens
        setSelected(true);
        onClick(id);
        setTimeout(() => setSelected(false), 300);
    };

    return (
        <div
            className={`${styles.icon} ${selected ? styles.selected : ""}`}
            onClick={handleClick}
            role="button"
            aria-label={`${label} öffnen`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
        >
            <span className={styles.emoji} aria-hidden="true">{icon}</span>
            <span className={styles.label}>{label}</span>
        </div>
    );
}
