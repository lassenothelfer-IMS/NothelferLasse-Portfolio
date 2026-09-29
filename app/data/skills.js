// Self-assessed skills, grouped by category.
//
// `level` is your own 0–100 rating. It isn't shown as a number — it's
// mapped to one of the three LEVELS below via the `min` thresholds, so you
// can keep fine-tuning numbers without the site claiming false precision.
//
// `usedIn` lists project ids (see projects.js); each becomes a link that
// opens that project. Leave it empty rather than listing work that isn't
// in the Projects window.
export const LEVELS = [
    { min: 0,  label: { en: "Familiar",    de: "Grundkenntnisse" } },
    { min: 50, label: { en: "Comfortable", de: "Gute Kenntnisse" } },
    { min: 65, label: { en: "Proficient",  de: "Sehr gute Kenntnisse" } },
];

/** Index into LEVELS for a 0–100 rating. */
export function levelIndex(value) {
    let index = 0;
    LEVELS.forEach((level, i) => { if (value >= level.min) index = i; });
    return index;
}

export const skillGroups = [
    {
        id:    "web",
        title: { en: "Web", de: "Web" },
        skills: [
            { name: { en: "Web Development (HTML, CSS, JS)", de: "Webentwicklung (HTML, CSS, JS)" }, level: 70, usedIn: ["betquiz", "portfolio"] },
            { name: "React",                                                                          level: 55, usedIn: ["betquiz", "portfolio"] },
        ],
    },
    {
        id:    "languages",
        title: { en: "Programming Languages", de: "Programmiersprachen" },
        skills: [
            { name: "Python", level: 60, usedIn: [] },
            { name: "Java",   level: 45, usedIn: ["shipshooter"] },
        ],
    },
    {
        id:    "data",
        title: { en: "Data", de: "Daten" },
        skills: [
            { name: { en: "Databases / SQL", de: "Datenbanken / SQL" }, level: 70, usedIn: [] },
        ],
    },
];
