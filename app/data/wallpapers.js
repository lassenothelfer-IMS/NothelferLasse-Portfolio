// Desktop patterns for the Appearance control panel.
// Each pattern is a 2×2 dither of two close shades, like the classic
// Mac OS desktop patterns: flat from a distance, textured up close.
export const WALLPAPERS = [
    { id: "periwinkle", name: { en: "Periwinkle", de: "Lavendel" },  a: "#6c72b9", b: "#6268ae" },
    { id: "teal",       name: { en: "Teal",       de: "Petrol" },    a: "#2b7f86", b: "#26757b" },
    { id: "bondi",      name: { en: "Bondi Blue", de: "Bondi-Blau" },a: "#1f97a3", b: "#1b8b96" },
    { id: "night",      name: { en: "Night",      de: "Nachtblau" }, a: "#34528e", b: "#2e4a82" },
    { id: "graphite",   name: { en: "Graphite",   de: "Graphit" },   a: "#80838b", b: "#777a82" },
    { id: "rose",       name: { en: "Rose",       de: "Rosé" },      a: "#b36c7e", b: "#a86475" },
];

export const DEFAULT_WALLPAPER = WALLPAPERS[0].id;

export function getWallpaper(id) {
    return WALLPAPERS.find((w) => w.id === id) ?? WALLPAPERS[0];
}
