'use client';

import {
  AnimatePresence,
  motion,
  cubicBezier,
  useReducedMotion,
} from "framer-motion";
import { tokens } from "../../../tokens/tokens";

interface VideoButtonProps {
  readonly onClick?: () => void;
  readonly onProjectSelect?: (index: number) => void;
  readonly selectedProjectIndex?: number;
  readonly showProjectState?: boolean;
}

const projects = [
  {
    name: "Form Charleston",
    image:
      "linear-gradient(145deg, rgba(22, 29, 31, 0.05), rgba(22, 29, 31, 0.44)), url('/images/backgrounds/hero-bg.png')",
    position: "66% 70%",
  },
  {
    name: "Blueshield",
    image:
      "linear-gradient(145deg, rgba(30, 72, 122, 0.05), rgba(17, 53, 91, 0.5)), url('/images/backgrounds/hero-bg.png')",
    position: "34% 58%",
  },
  {
    name: "Cryptolabs OTC",
    image:
      "linear-gradient(145deg, rgba(76, 54, 112, 0.04), rgba(38, 26, 61, 0.52)), url('/images/backgrounds/hero-bg.png')",
    position: "76% 44%",
  },
  {
    name: "Activate Camera",
    image:
      "linear-gradient(145deg, rgba(91, 77, 50, 0.04), rgba(51, 43, 28, 0.48)), url('/images/backgrounds/hero-bg.png')",
    position: "50% 80%",
  },
] as const;

const ease = cubicBezier(0.22, 1, 0.36, 1);
const projectLineWidth = 168.4702606201172;
const projectLineDrawProgress = 610.246 / 2000;
const projectLineEase = cubicBezier(
  0.7725619673728943,
  0.005301329307258129,
  0,
  0.9946944713592529
);

/* -------------------------------------------------------------------------- */
/*                                   Motion                                   */
/* -------------------------------------------------------------------------- */

const cardMotion = {
  initial: {
    opacity: 1,
    y: 0,
    scaleX: 1,
    scaleY: 2,
    transformOrigin: "top",
  },

  animate: {
    opacity: 1,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    transformOrigin: "top",
  },

  whileTap: {
    scale: 0.98,
    transformOrigin: "top",
  },

  transition: {
    duration: 0.6,
    ease,
  },
};

const dotMotion = {
  initial: {
    opacity: 0,
    scale: 0,
  },

  animate: {
    opacity: 1,
    scale: 1,
  },

  transition: {
    delay: 0.15,
    duration: 0.35,
    ease: cubicBezier(0.45, 1.45, 0.8, 1),
  },
};

const titleMotion = {
  initial: {
    opacity: 0,
    x: 10,
  },

  animate: {
    opacity: 1,
    x: 0,
  },

  transition: {
    delay: 0.2,
    duration: 0.4,
  },
};

const previewMotion = {
  initial: {
    opacity: 0,
    scaleY: 0,
    transformOrigin: "bottom",
  },

  animate: {
    opacity: 1,
    scaleY: 1,
    transformOrigin: "bottom",
  },

  transition: {
    delay: 0.3,
    duration: 0.5,
    ease,
  },
};

/* -------------------------------------------------------------------------- */
/*                                    Styles                                  */
/* -------------------------------------------------------------------------- */

const styles = {
  card: {
    height: 215,
    width: 193,
    padding: tokens.tokens.space.button.padding.y,
    border: "none",
    borderRadius: 24,
    background: "#23282B",
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },

  defaultButton: {
    width: "100%",
    height: "100%",
    padding: 0,
    border: "none",
    background: "transparent",
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
    cursor: "pointer",
  },

  header: {
    width: "100%",
    display: "flex",
    paddingRight: 12,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  dotWrapper: {
    width: 28,
    height: 28,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#B6FF63",
  },

  title: {
    color: "#E5E5E5",
    fontSize: 16,
    fontWeight: 400,
    fontFamily: "Outfit, sans-serif",
    lineHeight: "24px",
    whiteSpace: "nowrap" as const,
  },

  preview: {
    position: "relative" as const,
    overflow: "hidden",
    height :"100vh",
    width: "100%",
    borderRadius: 20,
    backgroundImage: "url('/images/backgrounds/hero-bg.png')",
    backgroundPosition: "66% 70%",
    backgroundSize: "cover",
  },

  projectPreview: {
    width: "100%",
    height: 174,
    flexShrink: 0,
    borderRadius: 20,
    border: "none",
    padding: 0,
    backgroundSize: "cover",
    filter: "grayscale(1)",
    cursor: "pointer",
  },

  projectContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    padding: "0 8px",
    textAlign: "right" as const,
    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
  },

  projectLine: {
    position: "absolute" as const,
    right: 4,
    bottom: 0,
    height: 0.8,
    flexShrink: 0,
    background: "#797979",
    transformOrigin: "right center",
  },

  projectList: {
    width: "100%",
    display: "flex",
    flexDirection: "column" as const,
    fontSize: 16,
    lineHeight: "150%",
  },

  projectItem: {
    position: "relative" as const,
    width: "100%",
    height: 32,
    padding: "4px 4px 4px 0",
    border: "none",
    borderRadius: 6,
    background: "transparent",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    fontFamily: "inherit",
    fontSize: "inherit",
    lineHeight: "inherit",
    textAlign: "right" as const,
    cursor: "pointer",
  },
};

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function VideoButton({
  onClick,
  onProjectSelect,
  selectedProjectIndex = 0,
  showProjectState = false,
}: VideoButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const selectedProject = projects[selectedProjectIndex] ?? projects[0];

  return (
    <motion.div
      layout
      initial={cardMotion.initial}
      animate={{
        ...cardMotion.animate,
        height: showProjectState ? 330 : 215,
      }}
      whileTap={cardMotion.whileTap}
      transition={cardMotion.transition}
      style={{
        ...styles.card,
        gap: showProjectState ? 12 : 16,
        paddingBottom: showProjectState ? 8 : tokens.tokens.space.button.padding.y,
        cursor: showProjectState ? "default" : "pointer",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {showProjectState ? (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.button
                key={selectedProject.name}
                type="button"
                onClick={onClick}
                aria-label={`Open pitch deck for ${selectedProject.name}`}
                title={`Open ${selectedProject.name} in the pitch deck`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.28, ease }}
                style={{
                  ...styles.projectPreview,
                  backgroundImage: selectedProject.image,
                  backgroundPosition: selectedProject.position,
                }}
              />
            </AnimatePresence>

            <div style={styles.projectContent}>
              <div style={styles.projectList}>
                {projects.map((project, index) => {
                  const isSelected = index === selectedProjectIndex;

                  return (
                    <motion.button
                      key={project.name}
                      type="button"
                      onClick={() => onProjectSelect?.(index)}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.18, ease }}
                      style={{
                        ...styles.projectItem,
                        color: isSelected ? "#EDECEC" : "#A1A1A1",
                        fontWeight: isSelected ? 500 : 300,
                      }}
                      aria-label={`Show ${project.name}`}
                      aria-pressed={isSelected}
                    >
                      <span>{project.name}</span>
                      {isSelected ? (
                        <motion.span
                          key={`${project.name}-selection-line`}
                          aria-hidden="true"
                          initial={
                            shouldReduceMotion
                              ? false
                              : { width: 0.00009999999747378752 }
                          }
                          animate={
                            shouldReduceMotion
                              ? { width: projectLineWidth }
                              : {
                                  width: [
                                    0.00009999999747378752,
                                    projectLineWidth,
                                    projectLineWidth,
                                  ],
                                }
                          }
                          transition={
                            shouldReduceMotion
                              ? { duration: 0 }
                              : {
                                  width: {
                                    duration: 2,
                                    times: [0, projectLineDrawProgress, 1],
                                    ease: [projectLineEase, "linear"],
                                    repeat: Infinity,
                                  },
                                }
                          }
                          style={styles.projectLine}
                        />
                      ) : null}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pitch-deck"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease }}
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 16 }}
          >
            <button
              type="button"
              onClick={onClick}
              aria-label="Open pitch deck"
              title="Open pitch deck"
              style={styles.defaultButton}
            >
              <div style={styles.header}>
                <motion.div {...dotMotion} style={styles.dotWrapper}>
                  <div style={styles.dot} />
                </motion.div>

                <motion.div {...titleMotion} style={styles.title}>
                  Pitch Deck
                </motion.div>
              </div>

              <motion.div {...previewMotion} style={styles.preview}>
                <video
                  src="/videos/please_add_very_little_movemen.mp4"
                  poster="/images/backgrounds/hero-bg.png"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  style={{
                    objectPosition: "center",
                    transform: "translateY(6px) scale(1.15)",
                    transformOrigin: "center",
                  }}
                />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
