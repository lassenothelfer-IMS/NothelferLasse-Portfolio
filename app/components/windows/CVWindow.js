import { cv } from '../../data/cv';
import styles from './CVWindow.module.css';

export default function CVWindow() {
  const handleDownload = () => {
    // In a real scenario, you would link to the actual PDF file
    alert("CV download functionality to be implemented!");
  };

  return (
    <div className={styles.cvWindow}>
      <ul className={styles.timeline}>
        {cv.map((item, index) => (
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
        Download CV (PDF)
      </a>
    </div>
  );
}

