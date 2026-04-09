"use client";

import { useWindowManager }  from "../../hooks/useWindowManager";
import { useState } from "react";
import { WINDOW_CONFIGS }    from "../../constants/windows";

import DesktopIcon    from "./DesktopIcon";
import Window         from "../window/Window";
import Taskbar        from "../taskbar/Taskbar";

// ── Window content components ─────────────────────────────────
import AboutWindow    from "../windows/AboutWindow";
import ProjectsWindow from "../windows/ProjectsWindow";
import SkillsWindow   from "../windows/SkillsWindow";
import CVWindow       from "../windows/CVWindow";
import ContactWindow  from "../windows/ContactWindow";
import SettingsWindow from "../windows/SettingsWindow";
import { useLanguage } from "../../context/LanguageContext";

import styles from "./Desktop.module.css";

// Maps window id → content component
// Keeps JSX clean — no giant switch statement
const CONTENT_MAP = {
    about:    AboutWindow,
    projects: ProjectsWindow,
    skills:   SkillsWindow,
    cv:       CVWindow,
    contact:  ContactWindow,
    settings: SettingsWindow,
};

const TRANSLATIONS = {
    en: {
        labels: { about: "About", projects: "Projects", skills: "Skills", cv: "CV", contact: "Contact", settings: "Settings" },
        titles: { about: "About.txt", projects: "Projects/", skills: "Skills.dat", cv: "CV.doc", contact: "Contact.form", settings: "Settings.exe" }
    },
    de: {
        labels: { about: "Ich", projects: "Projekte", skills: "Fähigkeiten", cv: "Lebenslauf", contact: "Kontakt", settings: "Einstellungen" },
        titles: { about: "Ich.txt", projects: "Projekte/", skills: "Fähigkeiten.dat", cv: "Lebenslauf.doc", contact: "Kontakt.form", settings: "Einstellungen.exe" }
    }
};

/**
 * Desktop
 *
 * Root UI component — coordinates all OS-level UI:
 *   background / icons / windows / taskbar
 *
 * State ownership:
 *   All window state lives in useWindowManager.
 *   Desktop only reads state and passes callbacks down.
 *   useDraggable (inside Window) owns position during drag.
 */
export default function Desktop() {
    const { language } = useLanguage();
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;
    const [backgroundColor, setBackgroundColor] = useState("#008080");

    const {
        windows,
        activeWindowId,
        taskbarWindows,
        openWindow,
        closeWindow,
        minimizeWindow,
        focusWindow,
        updatePosition,
    } = useWindowManager();

    return (
        <div
            className={styles.desktop}
            style={{ backgroundColor: backgroundColor }}
        >

            {/* ══ Desktop Icons ═══════════════════════════════════ */}
            <div className={styles.iconGrid}>
                {WINDOW_CONFIGS.map((cfg) => (
                    <DesktopIcon
                        key={cfg.id}
                        id={cfg.id}
                        icon={cfg.icon}
                        label={t.labels[cfg.id] || cfg.label}
                        onClick={openWindow}
                    />
                ))}
            </div>

            {/* ══ Open, non-minimized Windows ═════════════════════ */}
            {windows
                .filter((w) => w.isOpen)
                .map((win) => {
                    const Content = CONTENT_MAP[win.id];
                    return (
                        <Window
                            key={win.id}
                            title={t.titles[win.id] || win.title}
                            isActive={win.id === activeWindowId}
                            colorBar={win.colorBar}
                            position={win.position}
                            size={win.defaultSize}
                            zIndex={win.zIndex}
                            isMinimized={win.isMinimized}
                            // Window management callbacks
                            onClose={()    => closeWindow(win.id)}
                            onMinimize={()  => minimizeWindow(win.id)}
                            onFocus={()     => focusWindow(win.id)}
                            // Called by useDraggable on mouseup to persist final position
                            onPositionChange={(pos) => updatePosition(win.id, pos)}
                        >
                            {Content && <Content />}
                        </Window>
                    );
                })
            }

            {/* ══ Taskbar ═════════════════════════════════════════ */}
            <Taskbar
                windows={taskbarWindows.map(w => ({ ...w, title: t.titles[w.id] || w.title }))}
                activeWindowId={activeWindowId}
                onWindowClick={(id) => {
                    const win = windows.find((w) => w.id === id);
                    if (!win) return;
                    // Minimized → restore and focus
                    // Visible → just bring to front
                    win.isMinimized ? openWindow(id) : focusWindow(id);
                }}
                onColorChange={setBackgroundColor}
            />
        </div>
    );
}
