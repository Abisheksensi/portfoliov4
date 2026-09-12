"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import portrait from "../../../assets/image/image.png";
import { tokens } from "../../../tokens/tokens";
import styles from "./profileOverview.module.css";

const strengths = ["Research", "Accessibility", "Design systems"] as const;
const portraitIntroEase = [1, -0.02, 0.12, 1] as const;

export default function ProfileOverview() {
  const [isProfileActive, setIsProfileActive] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateProfileStage = (event: Event) => {
      const { active } = (event as CustomEvent<{ active: boolean }>).detail;
      setIsProfileActive(active);
    };

    window.addEventListener("portfolio:profile-stage", updateProfileStage);
    return () =>
      window.removeEventListener("portfolio:profile-stage", updateProfileStage);
  }, []);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    gsap.killTweensOf(title);

    if (!isProfileActive) {
      gsap.set(title, { "--scan-x": "-20%" });
      return;
    }

    if (shouldReduceMotion) {
      gsap.set(title, { "--scan-x": "125%" });
      return;
    }

    const scan = gsap.fromTo(
      title,
      { "--scan-x": "-20%" },
      {
        "--scan-x": "125%",
        duration: 2.5,
        ease: "power2.out",
      }
    );

    return () => {
      scan.kill();
    };
  }, [isProfileActive, shouldReduceMotion]);

  const openContactMenu = () => {
    window.dispatchEvent(new CustomEvent("portfolio:open-contact-menu"));
  };

  return (
    <section
      id="about"
      aria-labelledby="profile-overview-title"
      className={styles.section}
      style={
        {
          "--profile-ink": tokens.primitives.color.dark,
          "--profile-accent": "#f8703e",
          "--profile-title-font": tokens.typography.font.family.title,
          "--profile-body-font": tokens.typography.font.family.body,
        } as React.CSSProperties
      }
    >
      <motion.div
        className={styles.portraitPanel}
        initial={false}
        animate={
          isProfileActive || shouldReduceMotion
            ? {
                opacity: 1,
                clipPath: "inset(0 0% 0 0)",
                x: 0,
                scale: 1,
              }
            : {
                opacity: 0,
                clipPath: "inset(0 100% 0 0)",
                x: -24,
                scale: 0.985,
              }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 1.2, ease: portraitIntroEase }
        }
        style={{ transformOrigin: "left center" }}
      >
        <Image
          src={portrait}
          alt="Monochrome portrait of the product designer"
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          className={styles.portrait}
          unoptimized
          priority={false}
        />
        <div className={styles.portraitShade} aria-hidden="true" />
      </motion.div>

      <div className={styles.contentPanel}>
        <div className={styles.content}>
          <div className={styles.copy}>
            <header className={styles.headingGroup}>
              <div className={styles.eyebrow}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>Product Designer</span>
              </div>

              <h2
                ref={titleRef}
                id="profile-overview-title"
                className={styles.title}
                style={
                  {
                    "--scan-x": "-20%",
                    "--scan-color": "var(--profile-ink)",
                    color: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    backgroundImage: `linear-gradient(
                      90deg,
                      var(--scan-color) 0%,
                      var(--scan-color) calc(var(--scan-x) - 16%),
                      #fc5d20 var(--scan-x),
                      rgba(252, 93, 32, 0) calc(var(--scan-x) + 16%)
                    )`,
                    backgroundSize: "100% 100%",
                  } as React.CSSProperties
                }
              >
                Designing clear, accessible experiences for complex healthcare
                journeys.
              </h2>
            </header>

            <p className={styles.description}>
              I work end to end—from framing ambiguous problems and mapping
              patient flows to prototyping, usability testing, design systems,
              and engineering handoff. Much of my healthcare work is protected
              by NDA, so selected stories focus on the real decisions,
              constraints, and outcomes I can responsibly share.
            </p>

            <ul className={styles.strengths} aria-label="Core product design strengths">
              {strengths.map((strength) => (
                <li key={strength} className={styles.strength}>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className={styles.contactButton}
            onClick={openContactMenu}
          >
            <span>Get in touch</span>
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
