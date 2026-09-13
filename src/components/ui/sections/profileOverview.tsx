"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import portrait from "../../../assets/image/image.png";
import { tokens } from "../../../tokens/tokens";
import styles from "./profileOverview.module.css";

const portraitIntroEase = [1, -0.02, 0.12, 1] as const;

const projectSlides = [
  {
    slug: "form-charleston",
    name: "Form Charleston",
    title: "Designing clear, accessible experiences for complex healthcare journeys.",
    description:
      "A healthcare-focused product design story presented through the real decisions, constraints, and outcomes that can be responsibly shared.",
    strengths: ["Research", "Accessibility", "Design systems"],
  },
  {
    slug: "blueshield",
    name: "Blueshield",
    title: "Simplifying complex healthcare choices into a clearer digital journey.",
    description:
      "A selected healthcare experience focused on making dense information easier to understand, navigate, and act on with confidence.",
    strengths: ["Journey mapping", "Accessibility", "Interaction design"],
  },
  {
    slug: "cryptolabs-otc",
    name: "Cryptolabs OTC",
    title: "Building clarity and trust into high-stakes OTC workflows.",
    description:
      "A product experience shaped around clear decisions, dependable interaction patterns, and a more confident path through complex transactions.",
    strengths: ["Product strategy", "UX design", "Prototyping"],
  },
  {
    slug: "activate-camera",
    name: "Activate Camera",
    title: "Making camera-led interactions feel simple, guided, and human.",
    description:
      "An interaction concept focused on reducing uncertainty and guiding people naturally from activation through successful completion.",
    strengths: ["Interaction design", "Usability", "Motion"],
  },
] as const;

export default function ProfileOverview() {
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const project = projectSlides[projectIndex] ?? projectSlides[0];

  useEffect(() => {
    const updateProfileStage = (event: Event) => {
      const { active } = (event as CustomEvent<{ active: boolean }>).detail;
      setIsProfileActive(active);
    };

    const updateProjectSelection = (event: Event) => {
      const { projectIndex: nextProjectIndex } = (
        event as CustomEvent<{ projectIndex: number }>
      ).detail;
      setProjectIndex(Math.max(0, Math.min(projectSlides.length - 1, nextProjectIndex)));
    };

    window.addEventListener("portfolio:profile-stage", updateProfileStage);
    window.addEventListener("portfolio:project-selection", updateProjectSelection);
    return () => {
      window.removeEventListener("portfolio:profile-stage", updateProfileStage);
      window.removeEventListener("portfolio:project-selection", updateProjectSelection);
    };
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
  }, [isProfileActive, projectIndex, shouldReduceMotion]);

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
        <AnimatePresence initial={false}>
          <motion.div
            key={project.name}
            className={styles.portraitFrame}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.46, ease: "easeOut" }}
          >
            <Image
              src={portrait}
              alt={`Monochrome visual for ${project.name}`}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.portrait}
              unoptimized
              priority={false}
            />
            <div className={styles.portraitShade} aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className={styles.contentPanel}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={project.name}
            className={styles.content}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.46, ease: "easeOut" }}
          >
          <div className={styles.copy}>
            <header className={styles.headingGroup}>
              <div className={styles.eyebrow}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>{project.name}</span>
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
                {project.title}
              </h2>
            </header>

            <p className={styles.description}>
              {project.description}
            </p>

            <ul className={styles.strengths} aria-label="Core product design strengths">
              {project.strengths.map((strength) => (
                <li key={strength} className={styles.strength}>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.actions}>
            <Link className={styles.projectButton} href={`/work/${project.slug}`}>
              <span>View case study</span>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </Link>
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
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
