'use client';

import { motion, cubicBezier } from "framer-motion";
import { tokens } from "../../../tokens/tokens";

const ease = cubicBezier(0.22, 1, 0.36, 1);

/* -------------------------------------------------------------------------- */
/*                                   Motion                                   */
/* -------------------------------------------------------------------------- */

const cardMotion = {
  initial: {
    opacity: 1,
    y: 24,
    scalex: 1,
    scaley: 1,
  },

  animate: {
    opacity: 1,
    y: 0,
    scalex: 1,
    scaley: 1,
  },

  whileHover: {
    scalex: 1.02,
    scaley: 1.02,
  },

  whileTap: {
    scale: 0.98,
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
    background: "rgba(23,23,23,0.95)",
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
    height :"100vh",
    width: "100%",
    borderRadius: 20,
    background: "#D9D9D9",
  },
};

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function VideoButton() {
  return (
    <motion.button
      type="button"
      {...cardMotion}
      style={styles.card}
    >
      <div style={styles.header}>
        <motion.div
          {...dotMotion}
          style={styles.dotWrapper}
        >
          <div style={styles.dot} />
        </motion.div>

        <motion.div
          {...titleMotion}
          style={styles.title}
        >
          Get Works
        </motion.div>
      </div>

      <motion.div
        {...previewMotion}
        style={styles.preview}
      />
    </motion.button>
  );
}