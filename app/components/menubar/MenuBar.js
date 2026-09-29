"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MenuBar.module.css";

/*
 * Menu items:
 *   { type: "action", label, onSelect, disabled?, checked?, hint? }
 *   { type: "link", label, href }            — opens in a new tab
 *   { type: "separator" }
 *
 * Menus:
 *   { id, title (node), label (string, for a11y), items, compactHidden? }
 */

const ITEM_SELECTOR = '[role^="menuitem"]:not([aria-disabled="true"])';

export default function MenuBar({ menus, label, children }) {
    const [openId, setOpenId] = useState(null);
    const [keyboardOpened, setKeyboardOpened] = useState(false);
    const barRef = useRef(null);
    const titleRefs = useRef({});

    const open = (id, viaKeyboard = false) => {
        setKeyboardOpened(viaKeyboard);
        setOpenId(id);
    };

    const close = (returnFocusTo = null) => {
        setOpenId(null);
        if (returnFocusTo) titleRefs.current[returnFocusTo]?.focus();
    };

    const visibleIds = () =>
        [...barRef.current.querySelectorAll("[data-menu-title]")]
            .filter((el) => el.offsetParent !== null)
            .map((el) => el.dataset.menuTitle);

    const adjacentId = (fromId, step) => {
        const ids = visibleIds();
        return ids[(ids.indexOf(fromId) + step + ids.length) % ids.length];
    };

    // Close on outside click; Esc closes before anything else sees the key.
    useEffect(() => {
        if (!openId) return;
        const onPointerDown = (e) => {
            if (!barRef.current.contains(e.target)) setOpenId(null);
        };
        const onKeyDown = (e) => {
            if (e.key !== "Escape") return;
            e.stopPropagation();
            e.preventDefault();
            setOpenId(null);
            titleRefs.current[openId]?.focus();
        };
        document.addEventListener("pointerdown", onPointerDown);
        window.addEventListener("keydown", onKeyDown, true);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            window.removeEventListener("keydown", onKeyDown, true);
        };
    }, [openId]);

    // Keyboard-opened menus put focus on their first item.
    useEffect(() => {
        if (!openId || !keyboardOpened) return;
        barRef.current.querySelector(`[data-menu="${openId}"] ${ITEM_SELECTOR}`)?.focus();
    }, [openId, keyboardOpened]);

    const onTitleKeyDown = (e, id) => {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open(id, true);
        } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            const next = adjacentId(id, e.key === "ArrowRight" ? 1 : -1);
            titleRefs.current[next]?.focus();
            if (openId) open(next, true);
        }
    };

    const onMenuKeyDown = (e, id) => {
        const items = [...e.currentTarget.querySelectorAll(ITEM_SELECTOR)];
        const index = items.indexOf(document.activeElement);
        const focusAt = (i) => items[(i + items.length) % items.length]?.focus();

        switch (e.key) {
            case "ArrowDown": e.preventDefault(); focusAt(index + 1); break;
            case "ArrowUp":   e.preventDefault(); focusAt(index - 1); break;
            case "Home":      e.preventDefault(); focusAt(0); break;
            case "End":       e.preventDefault(); focusAt(items.length - 1); break;
            case "ArrowRight":
            case "ArrowLeft": {
                e.preventDefault();
                const next = adjacentId(id, e.key === "ArrowRight" ? 1 : -1);
                titleRefs.current[next]?.focus();
                open(next, true);
                break;
            }
            case "Tab": setOpenId(null); break;
        }
    };

    return (
        <div className={styles.menuBar} ref={barRef}>
            <nav aria-label={label}>
                <ul className={styles.menus} role="menubar">
                    {menus.map((menu) => {
                        const isOpen = openId === menu.id;
                        return (
                            <li
                                key={menu.id}
                                role="none"
                                className={`${styles.menu} ${menu.compactHidden ? styles.compactHidden : ""}`}
                            >
                                <button
                                    ref={(el) => { titleRefs.current[menu.id] = el; }}
                                    type="button"
                                    role="menuitem"
                                    aria-haspopup="menu"
                                    aria-expanded={isOpen}
                                    aria-label={menu.label}
                                    data-menu-title={menu.id}
                                    className={`${styles.menuTitle} ${isOpen ? styles.menuTitleOpen : ""}`}
                                    onClick={() => (isOpen ? close() : open(menu.id))}
                                    onPointerEnter={(e) => {
                                        if (openId && openId !== menu.id && e.pointerType === "mouse") open(menu.id);
                                    }}
                                    onKeyDown={(e) => onTitleKeyDown(e, menu.id)}
                                >
                                    {menu.title}
                                </button>

                                {isOpen && (
                                    <ul
                                        className={styles.dropdown}
                                        role="menu"
                                        aria-label={menu.label}
                                        data-menu={menu.id}
                                        onKeyDown={(e) => onMenuKeyDown(e, menu.id)}
                                    >
                                        {menu.items.map((item, i) => (
                                            <MenuItem key={i} item={item} onDone={() => close()} />
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.extras}>{children}</div>
        </div>
    );
}

function MenuItem({ item, onDone }) {
    if (item.type === "separator") {
        return <li role="separator" className={styles.separator} />;
    }

    if (item.type === "link") {
        return (
            <li role="none">
                <a
                    role="menuitem"
                    className={styles.item}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onDone}
                    tabIndex={-1}
                >
                    <span className={styles.check} aria-hidden="true" />
                    <span className={styles.itemLabel}>{item.label}</span>
                    <span className={styles.hint} aria-hidden="true">↗</span>
                </a>
            </li>
        );
    }

    const role = item.checked === undefined ? "menuitem" : "menuitemradio";
    return (
        <li role="none">
            <button
                type="button"
                role={role}
                aria-checked={role === "menuitemradio" ? item.checked : undefined}
                aria-disabled={item.disabled || undefined}
                className={styles.item}
                tabIndex={-1}
                onClick={() => {
                    if (item.disabled) return;
                    onDone();
                    item.onSelect();
                }}
            >
                <span className={styles.check} aria-hidden="true">{item.checked ? "✓" : ""}</span>
                <span className={styles.itemLabel}>{item.label}</span>
                {item.hint && <span className={styles.hint} aria-hidden="true">{item.hint}</span>}
            </button>
        </li>
    );
}
