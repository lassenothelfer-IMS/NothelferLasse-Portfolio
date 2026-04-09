import styles from './AboutWindow.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutWindow() {
  const { language } = useLanguage();

  return (
    <div className={styles.aboutWindow}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lasse Nothelfer</h1>
        <p className={styles.subtitle}>
          {language === 'en' ? 'Aspiring Full-Stack Developer' : 'Angehender Full-Stack-Entwickler'}
        </p>
      </div>

      <div className={styles.systemInfo}>
        <h3>{language === 'en' ? 'System Information' : 'Systeminformationen'}</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>OS:</span>
            <span>Portfolio OS 1.0</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{language === 'en' ? 'Version' : 'Version'}:</span>
            <span>2024.07.18</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{language === 'en' ? 'Processor' : 'Prozessor'}:</span>
            <span>{language === 'en' ? 'Caffeine-Fueled' : 'Koffeingetrieben'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>{language === 'en' ? 'Memory' : 'Speicher'}:</span>
            <span>16GB (8GB {language === 'en' ? 'for Chrome' : 'für Chrome'})</span>
          </div>
        </div>
      </div>

      <div className={styles.personalInfo}>
        <p>
          {language === 'en' 
            ? "Welcome to my digital desktop! I'm a passionate developer with a love for creating clean, efficient, and engaging applications."
            : "Willkommen auf meinem digitalen Desktop! Ich bin ein leidenschaftlicher Entwickler mit einer Vorliebe für die Erstellung von sauberen, effizienten und interaktiven Anwendungen."}
        </p>
        <p>
          {language === 'en'
            ? "This portfolio is a playground for my ideas, showcasing my journey in web development. Feel free to explore the different windows to learn more about my skills, projects, and experiences."
            : "Dieses Portfolio ist eine Spielwiese für meine Ideen und zeigt meine Reise in der Webentwicklung. Fühlen Sie sich frei, die verschiedenen Fenster zu erkunden, um mehr über meine Fähigkeiten, Projekte und Erfahrungen zu erfahren."}
        </p>
      </div>
    </div>
  );
}
