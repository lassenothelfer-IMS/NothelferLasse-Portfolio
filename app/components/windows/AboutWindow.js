"use client";

import PixelIcon from "../icons/PixelIcon";
import { useStrings } from "../../context/PreferencesContext";
import { useDesktop } from "../../context/DesktopContext";
import { SITE, publicLinks } from "../../config/site";
import styles from "./AboutWindow.module.css";

export default function AboutWindow() {
    const T = useStrings();
    const { open } = useDesktop();
    const A = T.about;

    const openFrom = (id) => (e) => open(id, { from: e.currentTarget.getBoundingClientRect() });

    return (
        <div className={styles.about}>
            <header className={styles.header}>
                <div className={styles.portrait}>
                    <PixelIcon name="person" size={64} />
                </div>
                <div>
                    <h1 className={styles.name}>{SITE.name}</h1>
                    <p className={styles.role}>{A.role}</p>
                    <p className={styles.meta}>
                        <span>{A.location}</span>
                        <span className={styles.status}>
                            <span className={styles.dot} aria-hidden="true" />
                            {A.status}
                        </span>
                    </p>
                </div>
            </header>

            <dl className={styles.facts}>
                {A.facts.map((fact) => (
                    <div key={fact.label} className={styles.fact}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                    </div>
                ))}
            </dl>

            <div className={styles.bio}>
                {A.bio.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
            </div>

            <div className={styles.actions}>
                <button type="button" className="btn btn-default" onClick={openFrom("projects")}>{A.projects}</button>
                <button type="button" className="btn" onClick={openFrom("cv")}>{A.cv}</button>
                <button type="button" className="btn" onClick={openFrom("contact")}>{A.contact}</button>
                {publicLinks().map((link) => (
                    <a key={link.id} className="btn" href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                    </a>
                ))}
            </div>

            <p className={styles.version}>
                Portfolio OS · {A.version} {SITE.version}
            </p>
        </div>
    );
}
