/**
 * Resolve a translatable field for the given language.
 *
 * Content is stored as `{ en, de }` objects wherever it differs between
 * languages, and as a plain string where it doesn't (names, tags, URLs).
 * This keeps a single entry per item instead of parallel en/de arrays that
 * drift apart.
 */
export function pick(field, language) {
    if (field && typeof field === "object" && !Array.isArray(field)) {
        return field[language] ?? field.en;
    }
    return field;
}
