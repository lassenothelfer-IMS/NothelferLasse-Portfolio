"use client";

import { education } from "../../data/cv";
import { usePreferences, useStrings } from "../../context/PreferencesContext";
import { useDesktop } from "../../context/DesktopContext";
import { pick } from "../../i18n/pick";
import styles from "./CVWindow.module.css";

export default function CVWindow() {
    const { language } = usePreferences();
    const T = useStrings();
    const { open } = useDesktop();

    const openFrom = (id) => (e) => open(id, { from: e.currentTarget.getBoundingClientRect() });

    return (
        <div className={styles.cv}>
            <h3 className={styles.section}>{T.cv.education}</h3>

            <ol className={styles.timeline}>
                {education.map((entry) => {
                    const title = pick(entry.title, language);
                    return (
                        <li key={title} className={styles.entry}>
                            <p className={styles.years}>{pick(entry.years, language)}</p>
                            <div className={styles.body}>
                                <h4 className={styles.title}>{title}</h4>
                                <p className={styles.institution}>{pick(entry.institution, language)}</p>
                                <p className={styles.description}>{pick(entry.description, language)}</p>
                            </div>
                        </li>
                    );
                })}
            </ol>

            <div className={styles.more}>
                <p>{T.cv.more}</p>
                <div className={styles.moreActions}>
                    <button type="button" className="btn" onClick={openFrom("skills")}>{T.cv.skills}</button>
                    <button type="button" className="btn" onClick={openFrom("projects")}>{T.cv.projects}</button>
                </div>
            </div>
        </div>
    );
}
