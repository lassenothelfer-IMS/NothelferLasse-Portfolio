"use client";

import { useSyncExternalStore } from "react";
import styles from "./MenuBar.module.css";

// The snapshot is the current minute, so React only re-renders when the
// displayed time actually changes. The server snapshot is null, which
// keeps the server HTML and first client render identical.
const subscribe = (onChange) => {
    const id = setInterval(onChange, 5_000);
    return () => clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

export default function Clock({ locale }) {
    const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);
    if (minute === null) return <span className={styles.clock} />;

    const now = new Date(minute * 60_000);
    const day  = now.toLocaleDateString(locale, { weekday: "short" });
    const time = now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

    return (
        <time className={styles.clock} dateTime={now.toISOString()}>
            {day} {time}
        </time>
    );
}
