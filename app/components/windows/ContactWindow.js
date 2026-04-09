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
          setFormData({ name: '', email: '', message: '' });
          alert(language === 'en' ? "Message sent successfully!" : "Nachricht erfolgreich gesendet!");
        } else {
          setSubmitStatus('error');
          alert((language === 'en' ? "Error sending message: " : "Fehler beim Senden der Nachricht: ") + (data.error || "Unknown error"));
        }
      } catch (error) {
        setSubmitStatus('error');
        alert(language === 'en' ? "An unexpected error occurred." : "Ein unerwarteter Fehler ist aufgetreten.");
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
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>{language === 'en' ? 'Name' : 'Name'}</label>
          <input
            type="text"
            id="name"
            name="name"
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
