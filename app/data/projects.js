// Projects shown in the Projects window, newest first.
// `icon` is a key from components/icons/iconMaps.js.
// `demo` is optional; the Live Demo button only appears when it's set.
export const projects = [
    {
        id:     "shrike",
        title:  "Shrike",
        icon:   "bow",
        kind:   { en: "Multiplayer browser game", de: "Multiplayer-Browserspiel" },
        desc: {
            en: "A multiplayer archery arena game for the browser, with ballistic arrows, online rooms joined by code and A* pathfinding bots. Server and client run the same deterministic 30 Hz simulation, so the client predicts the player's own movement and reconciles it with the server; all graphics and sounds are generated in code.",
            de: "Ein Multiplayer-Arenaspiel mit Pfeil und Bogen im Browser, mit ballistischen Pfeilen, Online-Räumen per Code und Bots mit A*-Wegfindung. Server und Client nutzen dieselbe deterministische 30-Hz-Simulation, sodass der Client die eigene Bewegung vorhersagt und mit dem Server abgleicht; Grafik und Sound entstehen komplett im Code.",
        },
        tags:   ["Three.js", "Node.js", "WebSockets", "Vite", "Web Audio API"],
        github: "https://github.com/lassenothelfer-IMS/shrike",
        demo:   "https://shrike.onrender.com",
    },
    {
        id:     "rigscout",
        title:  "RigScout",
        icon:   "rigscout",
        kind:   { en: "AI agent · web app", de: "KI-Agent · Web-App" },
        desc: {
            en: "An AI PC builder: a Claude agent searches retailers and, if you allow used parts, second-hand marketplaces in your country for parts or complete PCs that fit your games and budget. Its answer isn't taken on trust: code checks part compatibility, budget and every link, and sends problems back to the agent to fix.",
            de: "Ein KI-PC-Berater: Ein Claude-Agent durchsucht Händler und auf Wunsch Secondhand-Plattformen in Ihrem Land nach Komponenten oder Komplett-PCs für Ihre Spiele und Ihr Budget. Ungeprüft bleibt nichts: Der Code prüft die Kompatibilität der Teile, das Budget und jeden Link und meldet Probleme zur Korrektur an den Agenten zurück.",
        },
        tags:   ["Next.js", "TypeScript", "Claude API", "Zod", "Tailwind"],
        github: "https://github.com/lassenothelfer-IMS/rigscout",
        demo:   "https://rigscout.onrender.com",
    },
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
