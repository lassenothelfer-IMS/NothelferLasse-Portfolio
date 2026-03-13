"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useDraggable
 *
 * Provides mouse-based drag functionality for a positioned element.
 *
 * Design decisions:
 *  - Local position state → smooth 60fps updates without re-rendering parent
 *  - isDraggingRef (not state) → used inside mousemove without stale closure
 *  - Global window listeners → drag doesn't break when mouse moves fast
 *  - onPositionChange fired ONLY on mouseup → parent state updated once per drag
 *
 * @param {object}   params
 * @param {{x,y}}    params.initialPosition  - Position when window mounts
 * @param {function} params.onPositionChange - Called on drag end: ({x,y}) => void
 * @param {function} params.onDragStart      - Called on drag begin (for z-index focus)
 */
export function useDraggable({ initialPosition, onPositionChange, onDragStart }) {
    // ── Local position state (authoritative during drag) ───────
    const [position, setPosition]   = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);

    // ── Refs: values needed in event handlers (no stale closure) ──
    const isDraggingRef   = useRef(false);
    const dragOffset      = useRef({ x: 0, y: 0 });
    const positionRef     = useRef(initialPosition); // always mirrors state

    // Keep positionRef in sync whenever state changes
    const updatePosition = useCallback((pos) => {
        positionRef.current = pos;
        setPosition(pos);
    }, []);

    // ── Title bar mousedown handler ────────────────────────────
    const handleTitleBarMouseDown = useCallback((e) => {
        // Left click only
        if (e.button !== 0) return;

        // Skip if the user clicked a button inside the title bar
        // Buttons must have data-no-drag attribute
        if (e.target.closest("[data-no-drag]")) return;

        // Prevent text selection while dragging
        e.preventDefault();

        // Record cursor offset from window's top-left corner
        dragOffset.current = {
            x: e.clientX - positionRef.current.x,
            y: e.clientY - positionRef.current.y,
        };

        isDraggingRef.current = true;
        setIsDragging(true);
        onDragStart?.(); // tell parent to bump z-index
    }, [onDragStart]);

    // ── Global mousemove + mouseup ─────────────────────────────
    // Registered ONCE on mount. Uses refs to avoid stale closures.
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDraggingRef.current) return;

            const rawX = e.clientX - dragOffset.current.x;
            const rawY = e.clientY - dragOffset.current.y;

            // Clamp so the title bar always stays reachable:
            //   - never above top of viewport
            //   - never fully off-screen horizontally
            //   - never behind taskbar (bottom 40px)
            const x = Math.max(-200, Math.min(rawX, window.innerWidth  - 80));
            const y = Math.max(0,    Math.min(rawY, window.innerHeight - 80));

            updatePosition({ x, y });
        };

        const handleMouseUp = () => {
            if (!isDraggingRef.current) return;

            isDraggingRef.current = false;
            setIsDragging(false);

            // Persist final position to parent (useWindowManager)
            // positionRef.current is always current – no stale closure issue
            onPositionChange?.(positionRef.current);
        };

        // Attach to the global window so drag never "breaks"
        // when the cursor moves faster than the element
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup",   handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup",   handleMouseUp);
        };
    }, [updatePosition, onPositionChange]); // both stable (useCallback / prop)

    return {
        position,    // { x, y } – use as CSS left/top
        isDragging,  // boolean – use for cursor style
        handleTitleBarMouseDown, // attach to title bar onMouseDown
    };
}
