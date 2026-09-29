// Projects shown in the Projects window, newest first.
// `icon` is a key from components/icons/iconMaps.js.
// `demo` is optional; the Live Demo button only appears when it's set.
export const projects = [
    {
        id:     "betquiz",
        title:  "BetQuiz",
        icon:   "die",
        kind:   { en: "Real-time web app", de: "Echtzeit-Web-App" },
        desc: {
            en: "A real-time multiplayer quiz where you don't just answer — you bet points on your answer against live, parimutuel-style odds that shift as everyone wagers. No signup, 4-letter room codes, slot-machine bonus rounds.",
            de: "Ein Echtzeit-Multiplayer-Quiz, bei dem Sie nicht nur antworten — Sie setzen Punkte auf Ihre Antwort gegen dynamische Live-Quoten im Totalisator-Stil, die sich mit jeder Wette verschieben. Ohne Anmeldung, 4-stellige Raumcodes, Slot-Machine-Bonusrunden.",
        },
        tags:   ["Next.js", "Socket.io", "Node.js", "Tailwind"],
        github: "https://github.com/lassenothelfer-IMS/BetQuiz",
        demo:   "https://betquiz.onrender.com",
    },
    {
        id:     "portfolio",
        title:  "Portfolio OS",
        icon:   "computer",
        kind:   { en: "Website", de: "Website" },
        desc: {
            en: "This site: a working Mac OS 8–style desktop built from scratch — draggable, resizable windows, menus, pixel-art icons, and a mobile mode — in Next.js and React with plain CSS.",
            de: "Diese Website: ein funktionierender Desktop im Stil von Mac OS 8, von Grund auf gebaut — verschieb- und skalierbare Fenster, Menüs, Pixel-Icons und ein Mobile-Modus — mit Next.js, React und reinem CSS.",
        },
        tags:   ["Next.js", "React", "CSS"],
        github: "https://github.com/lassenothelfer-IMS/NothelferLasse-Portfolio",
    },
    {
        id:     "shipshooter",
        title:  "UltimateShipShooter",
        icon:   "rocket",
        kind:   { en: "Game · team project", de: "Spiel · Teamprojekt" },
        desc: {
            en: "A classic top-down shoot 'em up where you battle waves of enemy ships. Developed as a team project.",
            de: "Ein klassisches Top-Down-Shoot-'em-up, in dem Sie gegen Wellen feindlicher Schiffe kämpfen. Als Teamprojekt entwickelt.",
        },
        tags:   ["Java", "Processing"],
        github: "https://github.com/Kevin-Rechsteiner/UltimateShipShooter",
    },
    {
        id:     "economy",
        title:  "2008 Financial Crisis",
        icon:   "chart",
        kind:   { en: "Research", de: "Recherche" },
        desc: {
            en: "Data analysis and presentation on the 2008 global financial crisis, exploring its causes and economic impact.",
            de: "Datenanalyse und Präsentation zur globalen Finanzkrise 2008 — ihre Ursachen und wirtschaftlichen Auswirkungen.",
        },
        tags:   ["Data Analysis", "Research"],
        github: "https://github.com/Kian452/PRWR-2008-Wirtschaftskrise",
    },
];
