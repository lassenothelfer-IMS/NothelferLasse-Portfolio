'use client';

import { useState } from 'react';
import styles from './ContactWindow.module.css';

export default function ContactWindow() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required.";
    if (!formData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid.";
    }
    if (!formData.message) tempErrors.message = "Message is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Form submitted! (This is a demo)");
        setFormData({ name: '', email: '', message: '' });
      }, 1000);
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
          <label htmlFor="name" className={styles.label}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="How can I help you?"
            value={formData.message}
            onChange={handleChange}
            className={styles.textarea}
          />
          {errors.message && <p className={styles.error}>{errors.message}</p>}
        </div>
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
