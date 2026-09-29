"use client";

import { LEVELS, levelIndex, skillGroups } from "../../data/skills";
import { projects } from "../../data/projects";
import { usePreferences, useStrings } from "../../context/PreferencesContext";
import { useDesktop } from "../../context/DesktopContext";
import { pick } from "../../i18n/pick";
import styles from "./SkillsWindow.module.css";

const PROJECT_TITLES = Object.fromEntries(projects.map((p) => [p.id, p.title]));

/** Three-segment level meter. Decorative: the level is also written out. */
function Meter({ index }) {
    return (
        <span className={styles.meter} aria-hidden="true">
            {LEVELS.map((_, i) => (
                <span key={i} className={i <= index ? styles.filled : undefined} />
            ))}
        </span>
    );
}

export default function SkillsWindow() {
    const { language } = usePreferences();
    const T = useStrings();
    const { open } = useDesktop();

    const showProject = (projectId) => (e) =>
        open("projects", { from: e.currentTarget.getBoundingClientRect(), params: { projectId } });

    return (
        <div className={styles.skills}>
            <p className={styles.intro}>{T.skills.intro}</p>

            <div className={styles.legend}>
                <span className={styles.legendTitle}>{T.skills.scale}</span>
                <ul className={styles.legendItems}>
                    {LEVELS.map((level, i) => (
                        <li key={i}>
                            <Meter index={i} />
                            {pick(level.label, language)}
                        </li>
                    ))}
                </ul>
            </div>

            {skillGroups.map((group) => (
                <section key={group.id} className={styles.group} aria-labelledby={`skills-${group.id}`}>
                    <h3 id={`skills-${group.id}`} className={styles.groupTitle}>{pick(group.title, language)}</h3>
                    <ul>
                        {group.skills.map((skill) => {
                            const index = levelIndex(skill.level);
                            const name = pick(skill.name, language);
                            return (
                                <li key={name} className={styles.skill}>
                                    <span className={styles.name}>{name}</span>
                                    <span className={styles.level}>
                                        <Meter index={index} />
                                        {pick(LEVELS[index].label, language)}
                                    </span>
                                    {skill.usedIn.length > 0 && (
                                        <p className={styles.usedIn}>
                                            <span>{T.skills.usedIn}:</span>
                                            {skill.usedIn.map((projectId) => (
                                                <button
                                                    key={projectId}
                                                    type="button"
                                                    className={styles.projectLink}
                                                    onClick={showProject(projectId)}
                                                >
                                                    {PROJECT_TITLES[projectId]}
                                                </button>
                                            ))}
                                        </p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ))}
        </div>
    );
}
