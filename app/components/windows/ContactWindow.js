"use client";

import { useState } from "react";
import PixelIcon from "../icons/PixelIcon";
import { useStrings } from "../../context/PreferencesContext";
import { publicLinks } from "../../config/site";
import styles from "./ContactWindow.module.css";

const EMPTY = { name: "", email: "", message: "", company: "" }; // company = honeypot
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
    const errors = {};
    if (!form.name.trim()) errors.name = "name";
    if (!form.email.trim()) errors.email = "email";
    else if (!EMAIL_RE.test(form.email.trim())) errors.email = "emailBad";
    if (!form.message.trim()) errors.message = "message";
    return errors;
}

export default function ContactWindow() {
    const T = useStrings();
    const C = T.contact;
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | sending | sent | tooMany | failed

    const update = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const submit = async (e) => {
        e.preventDefault();
        const found = validate(form);
        setErrors(found);
        if (Object.keys(found).length) {
            e.currentTarget.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
            return;
        }

        setStatus("sending");
        try {
            const res = await fetch("/api/contact", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(form),
            });
            if (res.ok) {
                setStatus("sent");
                setForm(EMPTY);
            } else {
                setStatus(res.status === 429 ? "tooMany" : "failed");
            }
        } catch {
            setStatus("failed");
        }
    };

    const field = (name) => ({
        id:                 `contact-${name}`,
        name,
        value:              form[name],
        onChange:           update,
        className:          "field",
        "aria-invalid":     errors[name] ? true : undefined,
        "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    });

    const errorFor = (name) =>
        errors[name] && (
            <p id={`contact-${name}-error`} className={styles.fieldError}>{C.errors[errors[name]]}</p>
        );

    const links = publicLinks();

    return (
        <div className={styles.contact}>
            <p className={styles.intro}>{C.intro}</p>

            <form className={styles.form} onSubmit={submit} noValidate>
                {/* Honeypot: invisible to people, tempting to bots */}
                <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={update}
                    className={styles.honeypot}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                />

                <div className={styles.row}>
                    <label htmlFor="contact-name" className={styles.label}>{C.name}</label>
                    <input {...field("name")} type="text" autoComplete="name" maxLength={100} placeholder={C.namePh} />
                    {errorFor("name")}
                </div>

                <div className={styles.row}>
                    <label htmlFor="contact-email" className={styles.label}>{C.email}</label>
                    <input {...field("email")} type="email" autoComplete="email" maxLength={254} placeholder={C.emailPh} />
                    {errorFor("email")}
                </div>

                <div className={styles.row}>
                    <label htmlFor="contact-message" className={styles.label}>{C.message}</label>
                    <textarea {...field("message")} rows={6} maxLength={5000} placeholder={C.messagePh} />
                    {errorFor("message")}
                </div>

                <div className={styles.submitRow}>
                    <p className={styles.status} role="status" aria-live="polite">
                        {status === "sent" && (
                            <><PixelIcon name="check" size={16} /><span className={styles.ok}>{C.success}</span></>
                        )}
                        {(status === "tooMany" || status === "failed") && (
                            <><PixelIcon name="caution" size={16} /><span className={styles.bad}>{C.errors[status]}</span></>
                        )}
                    </p>
                    <button type="submit" className="btn btn-default" disabled={status === "sending"}>
                        {status === "sending" ? C.sending : C.send}
                    </button>
                </div>
            </form>

            {links.length > 0 && (
                <fieldset className={`group ${styles.elsewhere}`}>
                    <legend>{C.elsewhere}</legend>
                    <div className={styles.links}>
                        {links.map((link) => (
                            <a key={link.id} className="btn" href={link.href} target="_blank" rel="noopener noreferrer">
                                <PixelIcon name="globe" size={16} />
                                {link.label}
                            </a>
                        ))}
                    </div>
                </fieldset>
            )}
        </div>
    );
}
