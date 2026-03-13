"use client";

import Clock from "./Clock";
import styles from "./Taskbar.module.css";

const RAINBOW = ["#FF6B6B", "#FFB347", "#FFE66D", "#50fa7b", "#8be9fd", "#bd93f9", "#ff79c6"];

/**
 * Taskbar
 *
 * Props:
 *   windows         {Array}    All windows where isOpen === true
 *   activeWindowId  {string}   Id of the currently focused window
 *   onWindowClick   {fn(id)}   Called when a taskbar item is clicked
 */
export default function Taskbar({ windows = [], activeWindowId, onWindowClick, onColorChange }) {
    return (
        <footer className={styles.taskbar} aria-label="Taskbar">

            {/* ══ Brand: rainbow dots ═════════════════════════════ */}
            <div className={styles.brand} aria-label="Hintergrundfarbe wählen">
                {RAINBOW.map((color) => (
                    <button
                        key={color}
                        type="button"
                        className={styles.dotButton}
                        style={{ background: color }}
                        onClick={() => onColorChange?.(color)}
                        aria-label={`Desktop-Hintergrund auf ${color} setzen`}
                    />
                ))}
            </div>

            {/* ══ Open window buttons ══════════════════════════════ */}
            <nav className={styles.windowList} aria-label="Offene Fenster">
                {windows.map((win) => {
                    const isActive    = win.id === activeWindowId;
                    const isMinimized = win.isMinimized;

                    return (
                        <button
                            key={win.id}
                            className={[
                                styles.taskItem,
                                isActive    ? styles.activeItem : "",
                                isMinimized ? styles.minimized  : "",
                            ].filter(Boolean).join(" ")}
                            onClick={() => onWindowClick(win.id)}
                            title={win.title}
                            aria-pressed={isActive}
                            aria-label={`${win.title}${isMinimized ? " (minimiert)" : ""}`}
                        >
                            <span aria-hidden="true">{win.icon}</span>
                            <span>{win.title}</span>
                        </button>
                    );
                })}
            </nav>

            {/* ══ System clock ════════════════════════════════════ */}
            <div className={styles.clock}>
                <Clock />
            </div>

        </footer>
    );
}
