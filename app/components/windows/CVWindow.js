import { cv } from '../../data/cv';
import styles from './CVWindow.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function CVWindow() {
  const { language } = useLanguage();

  const handleDownload = () => {
    // In a real scenario, you would link to the actual PDF file
    alert(language === 'en' ? "CV download functionality to be implemented!" : "Lebenslauf-Download noch nicht implementiert!");
  };

  const currentCv = cv[language] || cv.en;

  return (
    <div className={styles.cvWindow}>
      <ul className={styles.timeline}>
        {currentCv.map((item, index) => (
          <li key={index} className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineYear}>{item.year}</div>
            <h3 className={styles.timelineTitle}>{item.title}</h3>
            <p className={styles.timelineInstitution}>{item.institution}</p>
            <p className={styles.timelineDescription}>{item.description}</p>
          </li>
        ))}
      </ul>
      <a
        href="/Lasse_Nothelfer_CV.pdf"
        download
        className={styles.downloadButton}
        onClick={(e) => {
          e.preventDefault();
          handleDownload();
        }}
      >
        {language === 'en' ? 'Download CV (PDF)' : 'Lebenslauf herunterladen (PDF)'}
      </a>
    </div>
  );
}
