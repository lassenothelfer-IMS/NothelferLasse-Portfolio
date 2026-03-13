import styles from './AboutWindow.module.css';

export default function AboutWindow() {
  return (
    <div className={styles.aboutWindow}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lasse Nothelfer</h1>
        <p className={styles.subtitle}>Aspiring Full-Stack Developer</p>
      </div>

      <div className={styles.systemInfo}>
        <h3>System Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>OS:</span>
            <span>Portfolio OS 1.0</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Version:</span>
            <span>2024.07.18</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Processor:</span>
            <span>Caffeine-Fueled</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Memory:</span>
            <span>16GB (8GB for Chrome)</span>
          </div>
        </div>
      </div>

      <div className={styles.personalInfo}>
        <p>
          Welcome to my digital desktop! I'm a passionate developer with a love for creating clean, efficient, and engaging applications.
        </p>
        <p>
          This portfolio is a playground for my ideas, showcasing my journey in web development. Feel free to explore the different windows to learn more about my skills, projects, and experiences.
        </p>
      </div>
    </div>
  );
}
