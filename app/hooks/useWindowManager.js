"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer } from "react";
import { WINDOW_CONFIGS, CONFIG_BY_ID, MENUBAR_H } from "../constants/windows";

/*
 * Window state as a pure reducer.
 *
 * Stacking is an array of open window ids, back to front — the last entry
 * is the active window, and z-index is just the array position. Focusing a
 * window that's already in front returns the same state object, so it costs
 * no re-render.
 *
 * Per-window counters:
 *   openSeq  — bumps when a closed window opens (plays the zoom animation)
 *   focusSeq — bumps on every explicit open (moves keyboard focus into it)
 */

function createState(openIds) {
    const windows = {};
    for (const cfg of WINDOW_CONFIGS) {
        windows[cfg.id] = {
            isOpen:      openIds.includes(cfg.id),
            isCollapsed: false,
            isZoomed:    false,
            rect:        { ...cfg.rect },
            openSeq:     0,
            focusSeq:    0,
            openedFrom:  null,
            params:      null,
        };
    }
    return { windows, order: [...openIds] };
}

function patch(state, id, changes) {
    return { ...state, windows: { ...state.windows, [id]: { ...state.windows[id], ...changes } } };
}

function toFront(order, id) {
    return [...order.filter((x) => x !== id), id];
}

function reducer(state, action) {
    const { id } = action;
    const win = id ? state.windows[id] : null;

    switch (action.type) {
        case "open": {
            const order = toFront(state.order, id);
            if (win.isOpen) {
                return {
                    ...patch(state, id, {
                        isCollapsed: false,
                        params:      action.params ?? win.params,
                        focusSeq:    win.focusSeq + 1,
                    }),
                    order,
                };
            }
            return {
                ...patch(state, id, {
                    isOpen:      true,
                    isCollapsed: false,
                    isZoomed:    false,
                    rect:        action.rect,
                    openedFrom:  action.from,
                    params:      action.params,
                    openSeq:     win.openSeq + 1,
                    focusSeq:    win.focusSeq + 1,
                }),
                order,
            };
        }
        case "close":
            if (!win.isOpen) return state;
            return {
                ...patch(state, id, { isOpen: false, isCollapsed: false, isZoomed: false }),
                order: state.order.filter((x) => x !== id),
            };
        case "focus":
            if (!win.isOpen || state.order.at(-1) === id) return state;
            return { ...state, order: toFront(state.order, id) };
        case "toggleCollapse":
            return patch(state, id, { isCollapsed: !win.isCollapsed });
        case "toggleZoom":
            return patch(state, id, { isZoomed: !win.isZoomed, isCollapsed: false });
        case "setRect":
            return patch(state, id, { rect: action.rect });
        case "setAll": {
            // Apply the same change to every open window (collapse/expand all, clean up).
            let next = state;
            for (const openId of state.order) {
                const changes = typeof action.changes === "function"
                    ? action.changes(openId, state.windows[openId])
                    : action.changes;
                next = patch(next, openId, changes);
            }
            return next;
        }
        case "closeAll": {
            let next = state;
            for (const openId of state.order) {
                next = patch(next, openId, { isOpen: false, isCollapsed: false, isZoomed: false });
            }
            return { ...next, order: [] };
        }
        case "reset":
            return createState(action.openIds);
        default:
            return state;
    }
}

/** Default frame clamped so the whole window fits the current viewport. */
function fitToViewport({ x, y, w, h }) {
    if (typeof window === "undefined") return { x, y, w, h };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const top = MENUBAR_H + 8;
    const fw = Math.min(w, vw - 16);
    const fh = Math.min(h, vh - top - 8);
    return {
        x: Math.max(8, Math.min(x, vw - fw - 8)),
        y: Math.max(top, Math.min(y, vh - fh - 8)),
        w: fw,
        h: fh,
    };
}

export function useWindowManager(startupIds) {
    const [state, dispatch] = useReducer(reducer, startupIds, createState);

    const actions = useMemo(() => ({
        /**
         * Open a window, or bring it to front if it's already open.
         * `from`   — DOMRect of whatever launched it, for the zoom animation.
         * `params` — passed to the window content (e.g. which project to select).
         */
        open: (id, { from = null, params = null } = {}) =>
            dispatch({ type: "open", id, from, params, rect: fitToViewport(CONFIG_BY_ID[id].rect) }),
        close:          (id) => dispatch({ type: "close", id }),
        focus:          (id) => dispatch({ type: "focus", id }),
        toggleCollapse: (id) => dispatch({ type: "toggleCollapse", id }),
        toggleZoom:     (id) => dispatch({ type: "toggleZoom", id }),
        setRect:        (id, rect) => dispatch({ type: "setRect", id, rect }),
        collapseAll:    () => dispatch({ type: "setAll", changes: { isCollapsed: true, isZoomed: false } }),
        expandAll:      () => dispatch({ type: "setAll", changes: { isCollapsed: false } }),
        cleanUp:        () => dispatch({
            type: "setAll",
            changes: (id) => ({ rect: fitToViewport(CONFIG_BY_ID[id].rect), isCollapsed: false, isZoomed: false }),
        }),
        /** Pull every open window back inside the viewport (after hydration / resize). */
        fitAll:         () => dispatch({ type: "setAll", changes: (id, win) => ({ rect: fitToViewport(win.rect) }) }),
        closeAll:       () => dispatch({ type: "closeAll" }),
        reset:          (openIds) => dispatch({ type: "reset", openIds }),
    }), []);

    // The server can't know the screen size, so startup windows render at
    // their default frame; fit them before the first client paint, and
    // again whenever the browser window is resized.
    useLayoutEffect(() => {
        actions.fitAll();
    }, [actions]);

    useEffect(() => {
        let frame = 0;
        const onResize = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(actions.fitAll);
        };
        window.addEventListener("resize", onResize);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onResize);
        };
    }, [actions]);

    const zIndexOf = useCallback((id) => state.order.indexOf(id), [state.order]);

    return {
        windows:  state.windows,
        order:    state.order,
        activeId: state.order.at(-1) ?? null,
        zIndexOf,
        ...actions,
    };
}
