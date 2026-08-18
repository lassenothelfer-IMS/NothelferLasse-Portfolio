'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './ContactWindow.module.css';

export default function ContactWindow() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    company: '', // honeypot — must stay empty
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const validate = () => {
    let tempErrors = {};
    if (language === 'en') {
      if (!formData.name) tempErrors.name = "Name is required.";
      if (!formData.email) {
        tempErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = "Email is invalid.";
      }
      if (!formData.message) tempErrors.message = "Message is required.";
    } else {
      if (!formData.name) tempErrors.name = "Name ist erforderlich.";
      if (!formData.email) {
        tempErrors.email = "E-Mail ist erforderlich.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        tempErrors.email = "E-Mail ist ungültig.";
      }
      if (!formData.message) tempErrors.message = "Nachricht ist erforderlich.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    if (validate()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSubmitStatus('success');
          setFormData({ name: '', email: '', message: '', company: '' });
        } else {
          setSubmitStatus('error');
        }
      } catch (error) {
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className={styles.contactWindow}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Honeypot: hidden from users, tempting to bots. Kept out of the
            tab order and hidden from assistive tech. */}
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={styles.honeypot}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>{language === 'en' ? 'Name' : 'Name'}</label>
          <input
            type="text"
            id="name"
            name="name"
            maxLength={100}
            placeholder={language === 'en' ? "Your Name" : "Dein Name"}
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>{language === 'en' ? 'Email' : 'E-Mail'}</label>
          <input
            type="email"
            id="email"
            name="email"
            maxLength={254}
            placeholder={language === 'en' ? "your.email@example.com" : "deine.email@beispiel.de"}
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>{language === 'en' ? 'Message' : 'Nachricht'}</label>
          <textarea
            id="message"
            name="message"
            maxLength={5000}
            placeholder={language === 'en' ? "How can I help you?" : "Wie kann ich dir helfen?"}
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
          />
          {errors.message && <p className={styles.error}>{errors.message}</p>}
        </div>
        
        {submitStatus === 'success' && (
          <p className={styles.successText}>
            {language === 'en' ? 'Message sent successfully!' : 'Nachricht erfolgreich gesendet!'}
          </p>
        )}
        {submitStatus === 'error' && (
          <p className={styles.error}>
            {language === 'en' ? 'Error sending message. Please try again.' : 'Fehler beim Senden. Bitte versuche es erneut.'}
          </p>
        )}

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting 
            ? (language === 'en' ? 'Sending...' : 'Senden...') 
            : (language === 'en' ? 'Send Message' : 'Nachricht senden')}
        </button>
      </form>
    </div>
  );
}
