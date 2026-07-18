'use client';

import { motion, cubicBezier } from "framer-motion";
import { tokens } from "../../../tokens/tokens";

interface MenuButtonProps {
  readonly text?: string;
  readonly onClick?: () => void;
  readonly circleColor?: string;
  readonly textColor?: string;
  readonly bgColor?: string;
}

const ease = cubicBezier(0.22, 1, 0.36, 1);

/* -------------------------------------------------------------------------- */
/*                                   Motion                                   */
/* -------------------------------------------------------------------------- */

const buttonMotion = {
  initial: {
    opacity: 0,
    y: 22,
    scale: 0.98,
  },

  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  whileHover: {
    scale: 1.03,
  },

  whileTap: {
    scale: 0.97,
  },

  transition: {
    duration: 0.55,
    ease,
  },
};

const circleMotion = {
  initial: {
    opacity: 0,
    scale: 1.2,
    y: 24,
  },

  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },

  whileHover: {
    scale: 1.12,
  },

  transition: {
    duration: 0.7,
    ease: cubicBezier(0.45, 1.45, 0.8, 1),
  },
};

const textMotion = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
  },

  transition: {
    duration: 0.3,
  },
};

/* -------------------------------------------------------------------------- */
/*                                   Styles                                   */
/* -------------------------------------------------------------------------- */

const styles = {
  button: {
    width: "100%",
    minHeight: 50,
    display: "flex",
    alignItems: "center",
    gap: 16,
    cursor: "pointer",
    userSelect: "none" as const,
  },

  circle: {
    width: 50,
    height: 50,
    borderRadius: "9999px",
    flexShrink: 0,
  },

  text: {
    marginLeft:"auto",
    marginRight:12,
    whiteSpace: "nowrap" as const,
    fontFamily: tokens.typography.font.family.title,
    fontSize: 16,
    lineHeight: 1.5,
  },
};

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function MenuButton({
  text = "Get in Touch",
  onClick,
  circleColor = tokens.primitives.color.grey,
  textColor = tokens.primitives.color.light,
  bgColor = tokens.primitives.color.dark,
}: MenuButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...buttonMotion}
      style={{
        ...styles.button,
        background: bgColor,
        color: textColor,
        borderRadius: tokens.tokens.radiu["3xl"],
        padding: `${tokens.tokens.space.button.padding.y}px ${tokens.tokens.space.button.padding.x}px`,
      }}
    >
      <motion.span
        {...circleMotion}
        style={{
          ...styles.circle,
          backgroundColor: circleColor,
        }}
      />

      <motion.span
        {...textMotion}
        style={styles.text}
      >
        {text}
      </motion.span>
    </motion.button>
  );
}