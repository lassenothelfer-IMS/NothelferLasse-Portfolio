import Desktop from "./components/desktop/Desktop";
import { PreferencesProvider } from "./context/PreferencesContext";
import { getInitialPrefs } from "./lib/prefs.server";

export default async function Page() {
    const { language, wallpaper, booted } = await getInitialPrefs();
    return (
        <PreferencesProvider initialLanguage={language} initialWallpaper={wallpaper}>
            <Desktop showBoot={!booted} />
        </PreferencesProvider>
    );
}
