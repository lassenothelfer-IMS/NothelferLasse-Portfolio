"use client";

import { createContext, useContext } from "react";

/**
 * Lets window content act on the desktop — e.g. About's buttons opening
 * Projects, or a skill's "used in" link selecting a project.
 * Provided by Desktop: { open(id, { from, params }), restart() }.
 */
export const DesktopContext = createContext(null);

export function useDesktop() {
    return useContext(DesktopContext);
}
