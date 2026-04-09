"use client";

import { useLanguage } from "../../context/LanguageContext";
import styles from "./SettingsWindow.module.css";

export default function SettingsWindow() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.settingsWindow}>
      <h2>{language === 'en' ? 'Settings' : 'Einstellungen'}</h2>
      <p>{language === 'en' ? 'Choose your language:' : 'Wähle deine Sprache:'}</p>
      
      <div className={styles.languageOptions}>
        <button 
          className={`${styles.button} ${language === 'en' ? styles.active : ''}`}
          onClick={() => setLanguage('en')}
        >
          🇬🇧 English
        </button>
        <button 
          className={`${styles.button} ${language === 'de' ? styles.active : ''}`}
          onClick={() => setLanguage('de')}
        >
          🇩🇪 Deutsch
        </button>
      </div>
    </div>
  );
}
