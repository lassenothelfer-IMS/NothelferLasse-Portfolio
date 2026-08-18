// Single source of truth for every desktop icon → window mapping.
//
// `label` (desktop icon + taskbar text) and `title` (window title bar) are
// stored per-language. Resolve them with the `t()` helper below so there is
// exactly ONE place that defines window names.
export const WINDOW_CONFIGS = [
  {
    id:              "about",
    title:           { en: "About.txt", de: "Ich.txt" },
    icon:            "👤",
    label:           { en: "About", de: "Ich" },
    defaultPosition: { x: 80,  y: 55  },
    defaultSize:     { width: 740, height: 480 },
    colorBar:        false,
  },
  {
    id:              "projects",
    title:           { en: "Projects/", de: "Projekte/" },
    icon:            "📁",
    label:           { en: "Projects", de: "Projekte" },
    defaultPosition: { x: 150, y: 80  },
    defaultSize:     { width: 780, height: 560 },
    colorBar:        false,
  },
  {
    id:              "skills",
    title:           { en: "Skills.dat", de: "Fähigkeiten.dat" },
    icon:            "⚙️",
    label:           { en: "Skills", de: "Fähigkeiten" },
    defaultPosition: { x: 200, y: 70  },
    defaultSize:     { width: 720, height: 520 },
    colorBar:        false,
  },
  {
    id:              "cv",
    title:           { en: "CV.doc", de: "Lebenslauf.doc" },
    icon:            "📄",
    label:           { en: "CV", de: "Lebenslauf" },
    defaultPosition: { x: 260, y: 90  },
    defaultSize:     { width: 660, height: 540 },
    colorBar:        false,
  },
  {
    id:              "contact",
    title:           { en: "Contact.form", de: "Kontakt.form" },
    icon:            "✉️",
    label:           { en: "Contact", de: "Kontakt" },
    defaultPosition: { x: 310, y: 85  },
    defaultSize:     { width: 580, height: 520 },
    colorBar:        true,
  },
  {
    id:              "settings",
    title:           { en: "Settings.exe", de: "Einstellungen.exe" },
    icon:            "🖥️",
    label:           { en: "Settings", de: "Einstellungen" },
    defaultPosition: { x: 360, y: 100 },
    defaultSize:     { width: 400, height: 300 },
    colorBar:        false,
  },
];

/**
 * Resolve a per-language field to a string.
 * Accepts either a { en, de } object or a plain string (defensive fallback).
 */
export function t(field, language) {
  if (field && typeof field === "object") return field[language] ?? field.en;
  return field;
}
