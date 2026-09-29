"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { MENUBAR_H } from "../../constants/windows";
import styles from "./Window.module.css";

// Below this width windows are fullscreen and fixed (see Window.module.css).
const COMPACT_QUERY = "(max-width: 767px)";
const isCompact = () => window.matchMedia(COMPACT_QUERY).matches;
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Mac OS "zoom rects": a few outlines that grow from the launching icon
 * to the window's final frame. Resolves when done; cancel() cleans up.
 */
function playZoomRects(from, to) {
    const layer = document.createElement("div");
    layer.className = styles.zoomLayer;
    document.body.appendChild(layer);

    const frames = [
        { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` },
        { left: `${to.left}px`,   top: `${to.top}px`,   width: `${to.width}px`,   height: `${to.height}px` },
    ];
    const animations = [0, 45, 90].map((delay) => {
        const outline = document.createElement("div");
        outline.className = styles.zoomRect;
        layer.appendChild(outline);
        return outline.animate(frames, { duration: 170, delay, easing: "ease-out", fill: "both" });
    });

    // Animations only advance while the page is rendering (not in a
    // background tab), so a timer guarantees the window is revealed anyway.
    const fallback = new Promise((resolve) => setTimeout(resolve, 400));
    const done = Promise.race([Promise.all(animations.map((a) => a.finished)), fallback])
        .catch(() => {})
        .finally(() => layer.remove());

    return {
        done,
        cancel: () => {
            animations.forEach((a) => a.cancel());
            layer.remove();
        },
    };
}

/**
 * Track a pointer gesture on `target` with pointer capture, calling
 * onMove(dx, dy) as it moves and onEnd() once when it's released.
 * The release position counts as a final move: moves can be coalesced,
 * so the last pointermove isn't guaranteed to be where the pointer let go.
 */
function trackPointer(event, onMove, onEnd) {
    const target = event.currentTarget;
    const startX = event.clientX;
    const startY = event.clientY;
    target.setPointerCapture(event.pointerId);

    const move = (e) => onMove(e.clientX - startX, e.clientY - startY);
    const end = (e) => {
        target.removeEventListener("pointermove", move);
        target.removeEventListener("pointerup", end);
        target.removeEventListener("pointercancel", end);
        if (e.type === "pointerup" && (e.clientX !== startX || e.clientY !== startY)) move(e);
        onEnd();
    };
    target.addEventListener("pointermove", move);
    target.addEventListener("pointerup", end);
    target.addEventListener("pointercancel", end);
}

/**
 * A Platinum window: striped title bar, close box on the left, zoom and
 * windowshade boxes on the right, grow box in the corner.
 *
 * Dragging and resizing write straight to the element's style while the
 * pointer moves (no React re-render per frame) and commit the final frame
 * through onRectChange once, on release.
 */
export default function Window({
    id,
    title,
    variant = "document",
    rect,
    min,
    zIndex,
    isActive,
    isCollapsed,
    isZoomed,
    openSeq,
    focusSeq,
    openedFrom,
    labels,
    onActivate,
    onClose,
    onToggleCollapse,
    onToggleZoom,
    onRectChange,
    children,
}) {
    const ref = useRef(null);
    const animating = useRef(false);
    const pendingFocus = useRef(false);
    const titleId = `window-title-${id}`;

    // ── Open animation (zoom rects from the icon) ──────────────
    useLayoutEffect(() => {
        const el = ref.current;
        if (!openSeq || !openedFrom || reducedMotion() || isCompact()) return;

        el.style.visibility = "hidden";
        animating.current = true;
        let cancelled = false;
        const zoom = playZoomRects(openedFrom, el.getBoundingClientRect());

        zoom.done.then(() => {
            if (cancelled) return;
            el.style.visibility = "";
            animating.current = false;
            if (pendingFocus.current) {
                pendingFocus.current = false;
                el.focus({ preventScroll: true });
            }
        });

        return () => {
            cancelled = true;
            zoom.cancel();
            el.style.visibility = "";
            animating.current = false;
        };
    }, [openSeq, openedFrom]);

    // ── Move keyboard focus in whenever the window is explicitly opened ──
    useEffect(() => {
        if (!focusSeq) return;
        if (animating.current) pendingFocus.current = true;   // focus once visible
        else ref.current?.focus({ preventScroll: true });
    }, [focusSeq]);

    // ── Drag by the title bar ──────────────────────────────────
    const startDrag = (e) => {
        if (e.button !== 0 || e.target.closest("[data-no-drag]")) return;
        if (isZoomed || isCompact()) return;
        const el = ref.current;
        let next = null;

        trackPointer(
            e,
            (dx, dy) => {
                next = {
                    ...rect,
                    // keep at least 80px of the title bar reachable
                    x: clamp(rect.x + dx, 80 - rect.w, window.innerWidth - 80),
                    y: clamp(rect.y + dy, MENUBAR_H, window.innerHeight - 40),
                };
                el.style.left = `${next.x}px`;
                el.style.top  = `${next.y}px`;
            },
            () => { if (next) onRectChange(next); },
        );
    };

    // ── Resize by the grow box ─────────────────────────────────
    const startResize = (e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        const el = ref.current;
        let next = null;

        trackPointer(
            e,
            (dx, dy) => {
                next = {
                    ...rect,
                    w: clamp(rect.w + dx, min.w, window.innerWidth - rect.x - 4),
                    h: clamp(rect.h + dy, min.h, window.innerHeight - rect.y - 4),
                };
                el.style.width  = `${next.w}px`;
                el.style.height = `${next.h}px`;
            },
            () => { if (next) onRectChange(next); },
        );
    };

    const className = [
        styles.window,
        styles[variant],
        isActive    && styles.active,
        isCollapsed && styles.collapsed,
        isZoomed    && styles.zoomed,
    ].filter(Boolean).join(" ");

    const frame = isZoomed
        ? { zIndex }
        : {
            left:   rect.x,
            top:    rect.y,
            width:  rect.w,
            height: isCollapsed ? undefined : rect.h,
            zIndex,
        };

    return (
        <section
            ref={ref}
            id={`window-${id}`}
            className={className}
            style={frame}
            role="dialog"
            aria-labelledby={titleId}
            tabIndex={-1}
            onPointerDown={onActivate}
            onFocus={onActivate}
        >
            <header
                className={styles.titleBar}
                onPointerDown={startDrag}
                onDoubleClick={(e) => {
                    if (!e.target.closest("[data-no-drag]") && !isCompact()) onToggleCollapse();
                }}
            >
                <span className={styles.stripes} aria-hidden="true" />
                <button
                    type="button"
                    className={`${styles.box} ${styles.closeBox}`}
                    data-no-drag
                    onClick={onClose}
                    aria-label={labels.close}
                    title={labels.close}
                />
                <h2 id={titleId} className={styles.title}>{title}</h2>
                <button
                    type="button"
                    className={`${styles.box} ${styles.zoomBox}`}
                    data-no-drag
                    onClick={onToggleZoom}
                    aria-label={labels.zoom}
                    aria-pressed={isZoomed}
                    title={labels.zoom}
                />
                <button
                    type="button"
                    className={`${styles.box} ${styles.collapseBox}`}
                    data-no-drag
                    onClick={onToggleCollapse}
                    aria-label={isCollapsed ? labels.expand : labels.collapse}
                    aria-expanded={!isCollapsed}
                    title={isCollapsed ? labels.expand : labels.collapse}
                />
            </header>

            <div className={`${styles.content} scroll`} hidden={isCollapsed}>
                {children}
            </div>

            {!isCollapsed && (
                <footer className={styles.footer}>
                    {!isZoomed && (
                        <span
                            className={styles.growBox}
                            onPointerDown={startResize}
                            aria-hidden="true"
                            title={labels.resize}
                        />
                    )}
                </footer>
            )}
        </section>
    );
}
