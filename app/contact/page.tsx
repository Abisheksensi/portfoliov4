"use client";

import styles from "./contact.module.css";
import ContactArtwork from "./contactArtwork";

export default function ContactPage() {
  const openContactOptions = () => {
    window.dispatchEvent(new CustomEvent("portfolio:open-contact-menu"));
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <ContactArtwork />

        <div className={styles.content}>
          <p className={styles.eyebrow}>
            <span className={styles.statusDot} aria-hidden="true" />
            Contact
          </p>

          <h1 id="contact-title" className={styles.title}>
            Let&apos;s make complex healthcare feel clear.
          </h1>

          <div className={styles.footerRow}>
            <p className={styles.description}>
              I&apos;m open to product design roles and collaborations where
              thoughtful research, accessibility, and systems thinking can make
              a meaningful difference.
            </p>

            <button
              type="button"
              className={styles.contactButton}
              onClick={openContactOptions}
            >
              <span>Start a conversation</span>
              <span className={styles.arrow} aria-hidden="true">
                ↗
              </span>
            </button>
          </div>
        </div>

        <p className={styles.disciplines}>
          Product design&nbsp;&nbsp;·&nbsp;&nbsp;Healthcare&nbsp;&nbsp;·&nbsp;&nbsp;Digital experiences
        </p>
      </section>
    </main>
  );
}
