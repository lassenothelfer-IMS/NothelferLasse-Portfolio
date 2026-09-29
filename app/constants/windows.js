// Every window on the desktop: its title, desktop icon and default frame.
//
// variant:  "document" — white page (reading content)
//           "panel"    — platinum surface (forms, control panels)
// rect:     default position/size on a ~1280×800 screen; clamped to the
//           viewport when the window opens.
export const WINDOW_CONFIGS = [
    {
        id:      "about",
        title:   { en: "About Lasse", de: "Über Lasse" },
        label:   { en: "About Me", de: "Über mich" },
        icon:    "person",
        variant: "document",
        rect:    { x: 48,  y: 44,  w: 580, h: 590 },
        min:     { w: 340, h: 260 },
    },
    {
        id:      "projects",
        title:   { en: "Projects", de: "Projekte" },
        label:   { en: "Projects", de: "Projekte" },
        icon:    "folder",
        variant: "document",
        rect:    { x: 120, y: 70,  w: 740, h: 480 },
        min:     { w: 360, h: 280 },
    },
    {
        id:      "skills",
        title:   { en: "Skills", de: "Fähigkeiten" },
        label:   { en: "Skills", de: "Fähigkeiten" },
        icon:    "toolbox",
        variant: "document",
        rect:    { x: 180, y: 92,  w: 560, h: 610 },
        min:     { w: 340, h: 260 },
    },
    {
        id:      "cv",
        title:   { en: "Curriculum Vitae", de: "Lebenslauf" },
        label:   { en: "CV", de: "Lebenslauf" },
        icon:    "document",
        variant: "document",
        rect:    { x: 240, y: 60,  w: 580, h: 560 },
        min:     { w: 340, h: 260 },
    },
    {
        id:      "contact",
        title:   { en: "Contact", de: "Kontakt" },
        label:   { en: "Contact", de: "Kontakt" },
        icon:    "envelope",
        variant: "panel",
        rect:    { x: 300, y: 84,  w: 480, h: 580 },
        min:     { w: 320, h: 320 },
    },
    {
        id:      "appearance",
        title:   { en: "Appearance", de: "Erscheinungsbild" },
        label:   { en: "Appearance", de: "Erscheinungsbild" },
        icon:    "monitor",
        variant: "panel",
        rect:    { x: 360, y: 108, w: 470, h: 480 },
        min:     { w: 320, h: 280 },
    },
];

export const CONFIG_BY_ID = Object.fromEntries(WINDOW_CONFIGS.map((cfg) => [cfg.id, cfg]));

/** Windows open on a fresh start (and after "Restart…"). */
export const STARTUP_WINDOWS = ["about"];

/** Height of the menu bar in px — keep in sync with --menubar-h in globals.css. */
export const MENUBAR_H = 24;
