import { skills } from '../../data/skills';
import styles from './SkillsWindow.module.css';

export default function SkillsWindow() {
  return (
    <div className={styles.skillsWindow}>
      <ul className={styles.skillList}>
        {skills.map(skill => (
          <li key={skill.name} className={styles.skillItem}>
            <div className={styles.skillName}>{skill.name}</div>
            <div className={styles.skillBar}>
              <div
                className={styles.skillLevel}
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: skill.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

