"use client";

import { useState } from "react";
import PixelIcon from "../icons/PixelIcon";
import { projects } from "../../data/projects";
import { usePreferences, useStrings } from "../../context/PreferencesContext";
import { pick } from "../../i18n/pick";
import styles from "./ProjectsWindow.module.css";

/**
 * Finder-style list view with a detail pane.
 * `params.projectId` (e.g. from a skill's "used in" link) selects a project.
 */
export default function ProjectsWindow({ params }) {
    const { language } = usePreferences();
    const T = useStrings();
    const [selectedId, setSelectedId] = useState(params?.projectId ?? projects[0].id);

    // Follow new selection requests while the window stays open.
    // (Adjusting state during render is React's recommended pattern here.)
    const [seenParams, setSeenParams] = useState(params);
    if (params !== seenParams) {
        setSeenParams(params);
        if (params?.projectId) setSelectedId(params.projectId);
    }

    const index = projects.findIndex((p) => p.id === selectedId);
    const selected = projects[index];

    const onListKeyDown = (e) => {
        const moves = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: projects.length - 1 };
        if (!(e.key in moves)) return;
        e.preventDefault();
        const next = Math.min(Math.max(moves[e.key], 0), projects.length - 1);
        setSelectedId(projects[next].id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.finder}>
                <p className={styles.infoBar}>{T.projects.items(projects.length)}</p>

                <div className={styles.split}>
                    <div className={`${styles.listPane} scroll`}>
                        <div className={styles.listHeader} aria-hidden="true">
                            <span>{T.projects.name}</span>
                            <span>{T.projects.kind}</span>
                        </div>
                        <ul
                            className={styles.list}
                            role="listbox"
                            aria-label={T.projects.list}
                            aria-activedescendant={`project-${selectedId}`}
                            tabIndex={0}
                            onKeyDown={onListKeyDown}
                        >
                            {projects.map((project) => (
                                <li
                                    key={project.id}
                                    id={`project-${project.id}`}
                                    role="option"
                                    aria-selected={project.id === selectedId}
                                    className={styles.row}
                                    onClick={() => setSelectedId(project.id)}
                                >
                                    <span className={styles.nameCell}>
                                        <PixelIcon name={project.icon} size={16} />
                                        <span>{project.title}</span>
                                    </span>
                                    <span className={styles.kindCell}>{pick(project.kind, language)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <article className={`${styles.detail} scroll`} aria-labelledby="project-detail-title">
                        <div className={styles.detailHead}>
                            <PixelIcon name={selected.icon} size={48} />
                            <div>
                                <h3 id="project-detail-title" className={styles.title}>{selected.title}</h3>
                                <p className={styles.kind}>{pick(selected.kind, language)}</p>
                            </div>
                        </div>

                        <p className={styles.desc}>{pick(selected.desc, language)}</p>

                        <ul className={styles.tags}>
                            {selected.tags.map((tag) => <li key={tag} className="chip">{tag}</li>)}
                        </ul>

                        <div className={styles.actions}>
                            {selected.demo && (
                                <a className="btn btn-default" href={selected.demo} target="_blank" rel="noopener noreferrer">
                                    {T.projects.demo}
                                </a>
                            )}
                            <a className="btn" href={selected.github} target="_blank" rel="noopener noreferrer">
                                {T.projects.github}
                            </a>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
