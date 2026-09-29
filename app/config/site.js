// Personal details and public links, in one place.
export const SITE = {
    name: "Lasse Nothelfer",
    version: "2026.01.08", // repo start date, shown as the "OS version"
    links: {
        github:   "https://github.com/lassenothelfer-IMS",
        // While empty, every LinkedIn link on the site (desktop alias, menu,
        // About, Contact) stays hidden.
        linkedin: "https://www.linkedin.com/in/lasse-nothelfer-8a2554397",
    },
};

/** External links that actually have a URL, in display order. */
export function publicLinks() {
    return [
        { id: "github",   label: "GitHub",   href: SITE.links.github },
        { id: "linkedin", label: "LinkedIn", href: SITE.links.linkedin },
    ].filter((link) => link.href);
}
