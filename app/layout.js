import { Pixelify_Sans, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { getInitialPrefs } from "./lib/prefs.server";
import "./globals.css";

// Self-hosted at build time by next/font — no request to Google at runtime.
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const body  = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const mono  = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const META = {
    en: {
        title:       "Lasse Nothelfer — Application Developer, Zurich",
        description: "Portfolio of Lasse Nothelfer, application developer in training in Zurich. Projects, skills and CV in a working Mac OS 8–style desktop.",
    },
    de: {
        title:       "Lasse Nothelfer — Applikationsentwickler, Zürich",
        description: "Portfolio von Lasse Nothelfer, angehender Applikationsentwickler in Zürich. Projekte, Fähigkeiten und Lebenslauf auf einem funktionierenden Desktop im Stil von Mac OS 8.",
    },
};

export async function generateMetadata() {
    const { language } = await getInitialPrefs();
    const meta = META[language];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    return {
        ...(siteUrl && { metadataBase: new URL(siteUrl) }),
        title:       meta.title,
        description: meta.description,
        openGraph: {
            title:       meta.title,
            description: meta.description,
            type:        "website",
            locale:      language === "de" ? "de_CH" : "en_GB",
        },
        twitter: { card: "summary_large_image" },
    };
}

export const viewport = {
    width:        "device-width",
    initialScale: 1,
    themeColor:   "#dddddd",
};

export default async function RootLayout({ children }) {
    const { language } = await getInitialPrefs();
    return (
        <html lang={language} className={`${pixel.variable} ${body.variable} ${mono.variable}`}>
            <body>{children}</body>
        </html>
    );
}
