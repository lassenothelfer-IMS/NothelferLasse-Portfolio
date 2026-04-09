"use client";

import { useState, useEffect } from "react";

/**
 * Clock
 *
 * Intentionally isolated into its own component.
 * The 1-second setInterval ONLY re-renders this tiny leaf node,
 * not the Taskbar, not the Desktop.
 */
export default function Clock() {
    const [time, setTime] = useState(null);

    useEffect(() => {
        // Set immediately to avoid blank flash
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTime(new Date());
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    // ── Formatting ───────────────────────────────────────────────

    // Avoid hydration mismatch (server has no time)
    if (!time) return null;

    const timeStr = time.toLocaleTimeString("de-DE", {
        hour:   "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const dateStr = time.toLocaleDateString("de-DE", {
        weekday: "short",
        day:     "2-digit",
        month:   "2-digit",
        year:    "numeric",
    });

    return (
        <div style={{ textAlign: "right", lineHeight: "1.5", fontFamily: "'Courier New', monospace" }}>
            <div style={{ fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", color: "#111" }}>
                {timeStr}
            </div>
            <div style={{ fontSize: "10px", color: "#666" }}>
                {dateStr}
            </div>
        </div>
    );
}
