'use client';

import {
  AnimatePresence,
  motion,
  cubicBezier,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
    slug: "form-charleston",
    image:
      "linear-gradient(145deg, rgba(22, 29, 31, 0.05), rgba(22, 29, 31, 0.44)), url('/images/backgrounds/hero-bg.png')",
    position: "66% 70%",
  },
  {
    name: "Blueshield",
    slug: "blueshield",
    image:
      "linear-gradient(145deg, rgba(30, 72, 122, 0.05), rgba(17, 53, 91, 0.5)), url('/images/backgrounds/hero-bg.png')",
    position: "34% 58%",
  },
  {
    name: "Cryptolabs OTC",
    slug: "cryptolabs-otc",
    image:
      "linear-gradient(145deg, rgba(76, 54, 112, 0.04), rgba(38, 26, 61, 0.52)), url('/images/backgrounds/hero-bg.png')",
    position: "76% 44%",
  },
  {
    name: "Activate Camera",
    slug: "activate-camera",
    image:
      "linear-gradient(145deg, rgba(91, 77, 50, 0.04), rgba(51, 43, 28, 0.48)), url('/images/backgrounds/hero-bg.png')",
    position: "50% 80%",
  },
] as const;

const previewVideos = [
  "/videos/i_wanna_same_video_same_pose_b.mp4",
  "/videos/there_is_weird_hand_gexture_in.mp4",
] as const;

const previewCrossfadeSeconds = 0.6;
const stateTransitionDelayMs = 520;

type VideoButtonDisplayState = "pitch" | "collapsed" | "projects";

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
    overflow: "hidden",
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
    position: "absolute" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    borderRadius: 20,
    border: "none",
    padding: 0,
    backgroundSize: "cover",
    filter: "grayscale(1)",
    cursor: "pointer",
  },

  projectPreviewFrame: {
    position: "relative" as const,
    width: "100%",
    height: 174,
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: 20,
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
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const selectedProject = projects[selectedProjectIndex] ?? projects[0];
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [displayState, setDisplayState] = useState<VideoButtonDisplayState>(
    showProjectState ? "projects" : "pitch"
  );
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const isVideoTransitioning = useRef(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateTransitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousProjectState = useRef(showProjectState);

  useEffect(() => {
    if (previousProjectState.current === showProjectState) {
      return;
    }
    previousProjectState.current = showProjectState;

    const transitionFrame = window.requestAnimationFrame(() => {
      if (shouldReduceMotion) {
        setDisplayState(showProjectState ? "projects" : "pitch");
        return;
      }

      setDisplayState("collapsed");
      stateTransitionTimeout.current = setTimeout(() => {
        setDisplayState(showProjectState ? "projects" : "pitch");
      }, stateTransitionDelayMs);
    });

    return () => {
      window.cancelAnimationFrame(transitionFrame);
      if (stateTransitionTimeout.current) {
        clearTimeout(stateTransitionTimeout.current);
      }
    };
  }, [shouldReduceMotion, showProjectState]);

  useEffect(() => {
    const activeVideo = videoRefs.current[activeVideoIndex];
    void activeVideo?.play().catch(() => undefined);
  }, [activeVideoIndex]);

  useEffect(
    () => () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
      }
      if (stateTransitionTimeout.current) {
        clearTimeout(stateTransitionTimeout.current);
      }
    },
    []
  );

  const advancePreviewVideo = (currentIndex: number) => {
    if (currentIndex !== activeVideoIndex || isVideoTransitioning.current) {
      return;
    }

    const nextIndex = (currentIndex + 1) % previewVideos.length;
    const currentVideo = videoRefs.current[currentIndex];
    const nextVideo = videoRefs.current[nextIndex];

    if (!nextVideo) {
      return;
    }

    isVideoTransitioning.current = true;
    nextVideo.currentTime = 0;

    void nextVideo.play().then(() => {
      setActiveVideoIndex(nextIndex);
      transitionTimeout.current = setTimeout(() => {
        currentVideo?.pause();
        if (currentVideo) {
          currentVideo.currentTime = 0;
        }
        isVideoTransitioning.current = false;
      }, shouldReduceMotion ? 0 : previewCrossfadeSeconds * 1000);
    }).catch(() => {
      isVideoTransitioning.current = false;
    });
  };

  return (
    <motion.div
      layout
      initial={cardMotion.initial}
      animate={{
        ...cardMotion.animate,
        height:
          displayState === "collapsed"
            ? 40
            : displayState === "projects"
              ? 370
              : 215,
      }}
      whileTap={cardMotion.whileTap}
      transition={cardMotion.transition}
      style={{
        ...styles.card,
        gap: displayState === "projects" ? 12 : 16,
        paddingBottom:
          displayState === "projects" ? 8 : tokens.tokens.space.button.padding.y,
        cursor: displayState === "pitch" ? "pointer" : "default",
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {displayState === "projects" ? (
          <motion.div
            key="projects"
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.48, ease }}
            style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={styles.header}>
              <div style={styles.dotWrapper}>
                <div style={styles.dot} />
              </div>

              <div style={styles.title}>Works</div>
            </div>

            <div style={styles.projectPreviewFrame}>
              <AnimatePresence initial={false}>
                <motion.button
                  key={selectedProject.name}
                  type="button"
                  onClick={() => router.push(`/work/${selectedProject.slug}`)}
                  aria-label={`View the ${selectedProject.name} case study`}
                  title={`View ${selectedProject.name} case study`}
                  initial={{ opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.015 }}
                  transition={{ duration: 0.46, ease }}
                  style={{
                    ...styles.projectPreview,
                    backgroundImage: selectedProject.image,
                    backgroundPosition: selectedProject.position,
                  }}
                />
              </AnimatePresence>
            </div>

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
        ) : displayState === "collapsed" ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease }}
            style={{ width: "100%" }}
          >
            <div style={styles.header}>
              <div style={styles.dotWrapper}>
                <div style={styles.dot} />
              </div>

              <div style={styles.title}>Works</div>
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
                {previewVideos.map((src, index) => (
                  <video
                    key={src}
                    ref={(node) => {
                      videoRefs.current[index] = node;
                    }}
                    src={src}
                    poster={index === 0 ? "/images/backgrounds/hero-bg.png" : undefined}
                    autoPlay={index === 0}
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    onTimeUpdate={(event) => {
                      const video = event.currentTarget;
                      if (
                        index === activeVideoIndex &&
                        Number.isFinite(video.duration) &&
                        video.duration - video.currentTime <=
                          (shouldReduceMotion ? 0.08 : previewCrossfadeSeconds)
                      ) {
                        advancePreviewVideo(index);
                      }
                    }}
                    onEnded={() => advancePreviewVideo(index)}
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: "center",
                      opacity: index === activeVideoIndex ? 1 : 0,
                      transition: shouldReduceMotion
                        ? "none"
                        : `opacity ${previewCrossfadeSeconds}s cubic-bezier(0.22, 1, 0.36, 1)`,
                      transform: "translateY(6px) scale(1.15)",
                      transformOrigin: "center",
                      zIndex: index === activeVideoIndex ? 1 : 0,
                    }}
                  />
                ))}
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
