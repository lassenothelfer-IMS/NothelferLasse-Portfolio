import { projects } from '../../data/projects';
import styles from './ProjectsWindow.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function ProjectsWindow() {
  const { language } = useLanguage();
  const currentProjects = projects[language] || projects.en;

  return (
    <div className={styles.projectsWindow}>
      <div className={styles.grid}>
        {currentProjects.map(project => (
          <div key={project.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>{project.icon}</span>
              <h3 className={styles.cardTitle}>{project.title}</h3>
            </div>
            <p className={styles.cardDescription}>{project.desc}</p>
            <div className={styles.cardTags}>
              {project.tags.map(tag => (
                <span key={tag} className={styles.tag} style={{ backgroundColor: project.color + '40' }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.cardLinks}>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
