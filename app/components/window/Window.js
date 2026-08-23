"use client";

import { useEffect, useRef, useState } from "react";
import { useDraggable } from "../../hooks/useDraggable";
import styles from "./Window.module.css";

/**
 * Window
 *
 * Generic, reusable window shell with integrated drag support.
 *
 * Architecture:
 *  - Uses useDraggable hook for local position management during drag
 *  - Calls onPositionChange on drag end → persists to useWindowManager
 *  - Calls onFocus on mousedown → useWindowManager bumps z-index
 *  - Content is passed as children — Window knows nothing about its content
 *
 * Props:
 *   title            {string}     Title bar text
 *   isActive         {boolean}    Whether this window has focus
 *   colorBar         {boolean}    Rainbow gradient title bar
 *   position         {{x,y}}      Initial position (from useWindowManager)
 *   size             {{width,height}}
 *   zIndex           {number}     From useWindowManager
 *   onClose          {function}
 *   onMinimize       {function}
 *   onFocus          {function}   Called on any click → triggers focusWindow
 *   onPositionChange {function}   Called on drag end: (pos) => void
 *   children         {ReactNode}
 */
export default function Window({
                                   title            = "Untitled",
                                   isActive         = false,
                                   colorBar         = false,
                                   position         = { x: 100, y: 80 },
                                   size             = { width: 600, height: "auto" },
                                   zIndex           = 10,
                                   isMinimized      = false,
                                   forceFullscreen  = false,
                                   onClose,
                                   onMinimize,
                                   onFocus,
                                   onPositionChange,
                                   children,
                               }) {
    const ANIM_MS = 200;
    const TASKBAR_H = 40; // keep the maximized window clear of the taskbar

    // ── Maximize state ────────────────────────────────────────
    const [isMaximized, setIsMaximized] = useState(false);

    // ── Animation state ───────────────────────────────────────
    const [justOpened, setJustOpened]     = useState(true);
    const [isClosing, setIsClosing]       = useState(false);
    const [isMinimizing, setIsMinimizing] = useState(false);
    const [isRestoring, setIsRestoring]   = useState(false);
    const [hiddenAfterMin, setHiddenAfterMin] = useState(false);
    const prevMinimizedRef = useRef(isMinimized);

    useEffect(() => {
        const t = setTimeout(() => setJustOpened(false), ANIM_MS);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (prevMinimizedRef.current && !isMinimized) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setHiddenAfterMin(false);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsRestoring(true);
            const t = setTimeout(() => setIsRestoring(false), ANIM_MS);
            prevMinimizedRef.current = isMinimized;
            return () => clearTimeout(t);
        }
        prevMinimizedRef.current = isMinimized;
    }, [isMinimized]);

    const handleClose = () => {
        if (isClosing) return;
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose?.();
        }, ANIM_MS);
    };

    const handleMinimize = () => {
        if (isMinimizing) return;
        setIsMinimizing(true);
        setTimeout(() => {
            setIsMinimizing(false);
            setHiddenAfterMin(true);
            onMinimize?.();
        }, ANIM_MS);
    };

    // ── Drag system ─────────────────────────────────────────────
    const { position: livePos, isDragging, handleTitleBarMouseDown } = useDraggable({
        initialPosition: position,
        onPositionChange,        // persist on drag end
        onDragStart:     onFocus, // bump z-index when drag starts
    });

    // Fullscreen = user-maximized (desktop) OR forced (mobile).
    // A fullscreen window fills the screen and can't be dragged.
    const fullscreen = isMaximized || forceFullscreen;

    const onTitleBarMouseDown = (e) => {
        if (fullscreen) return;
        handleTitleBarMouseDown(e);
    };

    // ── CSS class lists ──────────────────────────────────────────
    const windowClass = [
        styles.window,
        isActive       ? styles.active       : "",
        isDragging     ? styles.dragging     : "",
        justOpened     ? styles.animOpen     : "",
        isClosing      ? styles.animClose    : "",
        isMinimizing   ? styles.animMinimize : "",
        isRestoring    ? styles.animRestore  : "",
        hiddenAfterMin && !isRestoring ? styles.isHidden : "",
    ].filter(Boolean).join(" ");

    const titleBarClass = [
        styles.titleBar,
        isDragging          ? styles.grabbing  : "",
        colorBar            ? styles.rainbowBar : "",
        isActive && !colorBar ? styles.activeBar  : "",
    ].filter(Boolean).join(" ");

    const titleTextClass = [
        styles.titleText,
        colorBar            ? styles.rainbowText : "",
        isActive && !colorBar ? styles.activeText  : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            className={windowClass}
            style={
                fullscreen
                    ? {
                        left:   0,
                        top:    0,
                        width:  "100vw",
                        height: `calc(100dvh - ${TASKBAR_H}px)`,
                        zIndex,
                    }
                    : {
                        left:   livePos.x,   // ← useDraggable's local state (smooth)
                        top:    livePos.y,
                        width:  size.width,
                        height: size.height ?? "auto",
                        zIndex,
                    }
            }
            // Any click anywhere in the window brings it to front
            onMouseDown={onFocus}
        >
            {/* ══ Title Bar ════════════════════════════════════════ */}
            <div
                className={titleBarClass}
                // This is what makes the window draggable
                // Buttons inside must have data-no-drag to stop propagation
                onMouseDown={onTitleBarMouseDown}
                onDoubleClick={() => !forceFullscreen && setIsMaximized((m) => !m)}
            >
                {/* Traffic light buttons */}
                <div className={styles.controls} data-no-drag>
                    <button
                        className={`${styles.btn} ${styles.btnClose}`}
                        onMouseDown={(e) => e.stopPropagation()} // prevent drag start
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                        title="Schließen"
                        aria-label="Fenster schließen"
                    />
                    <button
                        className={`${styles.btn} ${styles.btnMinimize}`}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
                        title="Minimieren"
                        aria-label="Fenster minimieren"
                    />
                    {/* Green expand button — toggles maximize / restore.
                        Hidden on mobile, where windows are always fullscreen. */}
                    {!forceFullscreen && (
                        <button
                            className={`${styles.btn} ${styles.btnExpand}`}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); setIsMaximized((m) => !m); }}
                            title={isMaximized ? "Wiederherstellen" : "Maximieren"}
                            aria-label={isMaximized ? "Fenster wiederherstellen" : "Fenster maximieren"}
                            data-no-drag
                        />
                    )}
                </div>

                {/* Title — pointer-events: none in CSS, can't accidentally start drag */}
                <span className={titleTextClass}>{title}</span>

                {/* Spacer to visually balance the traffic lights */}
                <div style={{ width: 46 }} />
            </div>

            {/* ══ Scrollable Content ══════════════════════════════ */}
            <div
                className={styles.content}
                style={{
                    maxHeight: fullscreen
                        ? `calc(100dvh - ${TASKBAR_H}px - 34px)`
                        : size.height ? size.height - 34 : "70vh",
                }}
            >
                {children}
            </div>

            {/* ══ Resize handle (visual hint only) ════════════════ */}
            {!fullscreen && <div className={styles.resizeHint} aria-hidden="true" />}
        </div>
    );
}
