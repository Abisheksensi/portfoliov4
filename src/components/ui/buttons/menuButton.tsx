'use client';

import { motion } from "framer-motion";
import { tokens } from "../../../tokens/tokens";

interface MenuButtonProps {
  readonly text?: string;
  readonly onClick?: () => void;
  readonly circleColor?: string;
  readonly textColor?: string;
  readonly bgColor?: string;
}

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
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      style={{
        width: "fit-content",
        minHeight: 50,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: `${tokens.tokens.space.button.padding.y}px ${tokens.tokens.space.button.padding.x}px`,
        borderRadius: tokens.tokens.radiu["3xl"],
        background: bgColor,
        cursor: "pointer",
        color: textColor,
        userSelect: "none",
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: 16,
        lineHeight: 1.5,
      }}
    >
      <motion.span
        initial={{ opacity: 0, scale: 1.2, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.12 }}
        transition={{ duration: 0.7, ease: [0.45, 1.45, 0.8, 1] }}
        style={{
          width: 50,
          height: 50,
          borderRadius: "999px",
          backgroundColor: circleColor,
          flexShrink: 0,
          display: "block",
        }}
      />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </motion.span>
    </motion.button>
  );
}
