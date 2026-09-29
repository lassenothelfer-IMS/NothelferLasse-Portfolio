import PixelIcon from "../icons/PixelIcon";
import styles from "./DesktopIcon.module.css";

/**
 * A desktop icon. Either opens a window (`onOpen`, called with the icon's
 * on-screen rect for the zoom animation) or, with `href`, is an alias to an
 * external site — Mac OS showed aliases with an arrow badge and an italic
 * name.
 */
export default function DesktopIcon({ icon, label, ariaLabel, isOpen = false, onOpen, href }) {
    const art = (
        <span className={styles.art}>
            <PixelIcon name={icon} size={32} />
            {href && <PixelIcon name="alias" size={14} className={styles.aliasBadge} />}
        </span>
    );

    if (href) {
        return (
            <a
                className={`${styles.icon} ${styles.alias}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
            >
                {art}
                <span className={styles.label}>{label}</span>
            </a>
        );
    }

    return (
        <button
            type="button"
            className={`${styles.icon} ${isOpen ? styles.opened : ""}`}
            aria-label={ariaLabel}
            onClick={(e) => onOpen(e.currentTarget.firstChild.getBoundingClientRect())}
        >
            {art}
            <span className={styles.label}>{label}</span>
        </button>
    );
}
