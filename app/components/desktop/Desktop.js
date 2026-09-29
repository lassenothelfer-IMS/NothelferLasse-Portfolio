"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { WINDOW_CONFIGS, CONFIG_BY_ID, STARTUP_WINDOWS } from "../../constants/windows";
import { useWindowManager } from "../../hooks/useWindowManager";
import { usePreferences, useStrings } from "../../context/PreferencesContext";
import { DesktopContext } from "../../context/DesktopContext";
import { LANGUAGES } from "../../lib/prefs";
import { getWallpaper } from "../../data/wallpapers";
import { SITE, publicLinks } from "../../config/site";
import { pick } from "../../i18n/pick";

import MenuBar from "../menubar/MenuBar";
import Clock from "../menubar/Clock";
import menuStyles from "../menubar/MenuBar.module.css";
import DesktopIcon from "./DesktopIcon";
import Window from "../window/Window";
import BootScreen from "../boot/BootScreen";
import PixelIcon from "../icons/PixelIcon";

import AboutWindow from "../windows/AboutWindow";
import ProjectsWindow from "../windows/ProjectsWindow";
import SkillsWindow from "../windows/SkillsWindow";
import CVWindow from "../windows/CVWindow";
import ContactWindow from "../windows/ContactWindow";
import AppearanceWindow from "../windows/AppearanceWindow";

import styles from "./Desktop.module.css";

const CONTENT = {
    about:      AboutWindow,
    projects:   ProjectsWindow,
    skills:     SkillsWindow,
    cv:         CVWindow,
    contact:    ContactWindow,
    appearance: AppearanceWindow,
};

/**
 * The whole screen: menu bar, desktop icons, windows and (on a first
 * visit or after "Restart…") the startup screen.
 */
export default function Desktop({ showBoot }) {
    const { language, setLanguage, wallpaper } = usePreferences();
    const T = useStrings();
    const {
        windows, order, activeId, zIndexOf,
        open, close, focus, toggleCollapse, toggleZoom, setRect,
        collapseAll, expandAll, cleanUp, closeAll, reset,
    } = useWindowManager(STARTUP_WINDOWS);

    const [boot, setBoot] = useState({ visible: showBoot, fromNavigation: true, run: 0 });
    const finishBoot = useCallback(() => setBoot((b) => ({ ...b, visible: false })), []);

    const restart = useCallback(() => {
        reset(STARTUP_WINDOWS);
        setBoot((b) => ({ visible: true, fromNavigation: false, run: b.run + 1 }));
    }, [reset]);

    const links = publicLinks();
    const titleOf = (id) => pick(CONFIG_BY_ID[id].title, language);

    /** Close a window and hand keyboard focus to the one now in front. */
    const closeWindow = useCallback((id) => {
        const next = order.filter((x) => x !== id).at(-1);
        // `next` is already mounted, so focus can move before the close renders.
        if (next) document.getElementById(`window-${next}`)?.focus({ preventScroll: true });
        close(id);
    }, [order, close]);

    // Esc closes the front window — unless you're typing in a field.
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key !== "Escape" || e.defaultPrevented || !activeId) return;
            if (document.activeElement?.matches("input, textarea, select")) return;
            closeWindow(activeId);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [activeId, closeWindow]);

    const desktopActions = useMemo(() => ({ open, restart }), [open, restart]);

    const hasWindows = order.length > 0;
    const menus = [
        {
            id:    "system",
            label: SITE.name,
            title: (
                <>
                    <PixelIcon name="computer" size={16} />
                    <span className={menuStyles.brand}>{SITE.name}</span>
                </>
            ),
            items: [
                { type: "action", label: T.menu.aboutThis, onSelect: () => open("about") },
                { type: "separator" },
                { type: "action", label: T.menu.appearance, onSelect: () => open("appearance") },
                ...(links.length ? [{ type: "separator" }] : []),
                ...links.map((link) => ({ type: "link", label: link.label, href: link.href })),
                { type: "separator" },
                { type: "action", label: T.menu.restart, onSelect: restart },
            ],
        },
        {
            id:            "file",
            label:         T.menu.file,
            title:         T.menu.file,
            compactHidden: true,
            items: [
                { type: "action", label: T.menu.closeWindow, hint: "Esc", disabled: !activeId, onSelect: () => closeWindow(activeId) },
                { type: "action", label: T.menu.closeAll, disabled: !hasWindows, onSelect: closeAll },
            ],
        },
        {
            id:            "view",
            label:         T.menu.view,
            title:         T.menu.view,
            compactHidden: true,
            items: [
                { type: "action", label: T.menu.cleanUp,     disabled: !hasWindows, onSelect: cleanUp },
                { type: "action", label: T.menu.collapseAll, disabled: !hasWindows, onSelect: collapseAll },
                { type: "action", label: T.menu.expandAll,   disabled: !hasWindows, onSelect: expandAll },
            ],
        },
        {
            id:    "windows",
            label: T.menu.windows,
            title: T.menu.windows,
            // Every window, so this doubles as the app switcher on phones.
            // ✓ marks the front window, ◆ the others that are open.
            items: WINDOW_CONFIGS.map((cfg) => ({
                type:     "action",
                label:    titleOf(cfg.id),
                checked:  cfg.id === activeId,
                hint:     windows[cfg.id].isOpen && cfg.id !== activeId ? "◆" : undefined,
                onSelect: () => open(cfg.id),
            })),
        },
    ];

    const wp = getWallpaper(wallpaper);

    return (
        <DesktopContext.Provider value={desktopActions}>
            <div className={styles.screen} style={{ "--wp-a": wp.a, "--wp-b": wp.b }}>
                <MenuBar menus={menus} label={T.menu.menuBar}>
                    <div className={menuStyles.langToggle} role="group" aria-label={T.menu.language}>
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                lang={lang}
                                aria-pressed={language === lang}
                                onClick={() => setLanguage(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <Clock locale={T.locale} />
                </MenuBar>

                <main className={styles.desktop}>
                    <nav className={styles.icons} aria-label={T.desktop.label}>
                        {WINDOW_CONFIGS.map((cfg) => {
                            const label = pick(cfg.label, language);
                            return (
                                <DesktopIcon
                                    key={cfg.id}
                                    icon={cfg.icon}
                                    label={label}
                                    ariaLabel={T.desktop.open(label)}
                                    isOpen={windows[cfg.id].isOpen}
                                    onOpen={(from) => open(cfg.id, { from })}
                                />
                            );
                        })}
                        {links.map((link) => (
                            <DesktopIcon
                                key={link.id}
                                icon="globe"
                                label={link.label}
                                ariaLabel={T.desktop.external(link.label)}
                                href={link.href}
                            />
                        ))}
                    </nav>

                    {WINDOW_CONFIGS.filter((cfg) => windows[cfg.id].isOpen).map((cfg) => {
                        const win = windows[cfg.id];
                        const Content = CONTENT[cfg.id];
                        return (
                            <Window
                                key={cfg.id}
                                id={cfg.id}
                                title={titleOf(cfg.id)}
                                variant={cfg.variant}
                                rect={win.rect}
                                min={cfg.min}
                                zIndex={10 + zIndexOf(cfg.id)}
                                isActive={cfg.id === activeId}
                                isCollapsed={win.isCollapsed}
                                isZoomed={win.isZoomed}
                                openSeq={win.openSeq}
                                focusSeq={win.focusSeq}
                                openedFrom={win.openedFrom}
                                labels={T.window}
                                onActivate={() => focus(cfg.id)}
                                onClose={() => closeWindow(cfg.id)}
                                onToggleCollapse={() => toggleCollapse(cfg.id)}
                                onToggleZoom={() => toggleZoom(cfg.id)}
                                onRectChange={(rect) => setRect(cfg.id, rect)}
                            >
                                <Content params={win.params} />
                            </Window>
                        );
                    })}
                </main>

                {boot.visible && (
                    <BootScreen key={boot.run} fromNavigation={boot.fromNavigation} onDone={finishBoot} />
                )}
            </div>
        </DesktopContext.Provider>
    );
}
