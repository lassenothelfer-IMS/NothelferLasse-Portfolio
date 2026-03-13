"use client";

import { useState, useCallback } from "react";
import { WINDOW_CONFIGS } from "../constants/windows";

// Build initial window state from config — all windows start closed
function buildInitialWindows() {
    return WINDOW_CONFIGS.map((cfg) => ({
        ...cfg,
        isOpen:      false,
        isMinimized: false,
        position:    { ...cfg.defaultPosition },
        zIndex:      10,
    }));
}

/**
 * useWindowManager
 *
 * Single source of truth for all window state.
 * Exposes clean action functions — no raw setState outside this hook.
 *
 * Z-index strategy: monotonically increasing counter.
 * The focused window always gets ++highestZ.
 * No need to recalculate all windows — just bump the target.
 */
export function useWindowManager() {
    const [windows,  setWindows]  = useState(buildInitialWindows);
    const [highestZ, setHighestZ] = useState(10);

    // ── Private helpers ──────────────────────────────────────────

    /** Increment the global z-counter and return the new value */
    const bumpZ = useCallback(() => {
        const next = highestZ + 1;
        setHighestZ(next);
        return next;
    }, [highestZ]);

    /** Apply a partial update to one window by id */
    const updateWindow = useCallback((id, patch) => {
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
        );
    }, []);

    // ── Public actions ───────────────────────────────────────────

    /**
     * openWindow
     * Opens (or restores) a window and brings it to front.
     * Safe to call on an already-open window — just refocuses.
     */
    const openWindow = useCallback((id) => {
        const z = bumpZ();
        updateWindow(id, { isOpen: true, isMinimized: false, zIndex: z });
    }, [bumpZ, updateWindow]);

    /**
     * closeWindow
     * Removes window from screen and taskbar entirely.
     * Next openWindow call will re-mount it at its default position.
     */
    const closeWindow = useCallback((id) => {
        updateWindow(id, { isOpen: false, isMinimized: false });
    }, [updateWindow]);

    /**
     * minimizeWindow
     * Hides the window but keeps it in the taskbar.
     * isOpen stays true — the window is just not rendered.
     */
    const minimizeWindow = useCallback((id) => {
        updateWindow(id, { isMinimized: true });
    }, [updateWindow]);

    /**
     * focusWindow
     * Brings an existing window to the front (highest z-index).
     * Also un-minimizes if needed.
     */
    const focusWindow = useCallback((id) => {
        const z = bumpZ();
        updateWindow(id, { zIndex: z, isMinimized: false });
    }, [bumpZ, updateWindow]);

    /**
     * updatePosition
     * Called by useDraggable on mouseup to persist the final drag position.
     */
    const updatePosition = useCallback((id, position) => {
        updateWindow(id, { position });
    }, [updateWindow]);

    // ── Derived values ───────────────────────────────────────────

    /**
     * activeWindowId
     * The window with the highest z-index that is visible.
     * Used for title bar highlighting and taskbar active state.
     */
    const activeWindowId = windows
        .filter((w) => w.isOpen && !w.isMinimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null;

    /**
     * taskbarWindows
     * All windows that should appear in the taskbar.
     * Includes minimized windows (they live in the taskbar).
     */
    const taskbarWindows = windows.filter((w) => w.isOpen);

    return {
        windows,
        activeWindowId,
        taskbarWindows,
        openWindow,
        closeWindow,
        minimizeWindow,
        focusWindow,
        updatePosition,
    };
}
