// Server Component — thin entry point
import Desktop from "./components/desktop/Desktop";
import { LanguageProvider } from "./context/LanguageContext";

export default function Page() {
  return (
    <LanguageProvider>
      <Desktop />
    </LanguageProvider>
  );
}
