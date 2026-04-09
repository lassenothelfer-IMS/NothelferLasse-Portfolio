"use client";

import { skills } from '../../data/skills';
import styles from './SkillsWindow.module.css';
import { useState, useEffect } from 'react';

function SkillItem({ skill }) {
  const [displayedLevel, setDisplayedLevel] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 1500; // ms
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = timestamp - startTimestamp;
      const fraction = Math.min(progress / duration, 1);
      
      // ease-out cubic
      const easeOut = 1 - Math.pow(1 - fraction, 3);
      
      setDisplayedLevel(Math.floor(easeOut * skill.level));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setDisplayedLevel(skill.level);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [skill.level]);

  return (
    <li className={styles.skillItem}>
      <div className={styles.skillHeader}>
        <div className={styles.skillName}>{skill.name}</div>
        <div className={styles.skillPercent} style={{ color: skill.color }}>{displayedLevel}%</div>
      </div>
      <div className={styles.skillBar}>
        <div
          className={styles.skillLevel}
          style={{
            width: `${displayedLevel}%`,
            backgroundColor: skill.color,
          }}
        />
      </div>
    </li>
  );
}

export default function SkillsWindow() {
  return (
    <div className={styles.skillsWindow}>
      <ul className={styles.skillList}>
        {skills.map(skill => (
          <SkillItem key={skill.name} skill={skill} />
        ))}
      </ul>
    </div>
  );
}
