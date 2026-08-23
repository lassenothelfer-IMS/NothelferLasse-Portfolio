"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * useIsMobile
 *
 * Returns true when the viewport is narrower than `breakpoint`.
 *
 * SSR-safe: defaults to false so the server render and the first client
 * render agree (desktop-first), then corrects on mount. Uses matchMedia
 * so it reacts to rotation / resize without a manual resize listener.
 */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [breakpoint]);

    return isMobile;
}
