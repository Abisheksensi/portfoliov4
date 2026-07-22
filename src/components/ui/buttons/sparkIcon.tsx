"use client";

import { motion } from "framer-motion";

interface SparkIconProps {
  readonly size?: number;
  readonly color?: string;
}

const outerDots = [
  [14, 1],
  [7, 3],
  [21, 3],
  [1, 9],
  [27, 9],
  [1, 17],
  [27, 17],
  [7, 25],
  [21, 25],
  [14, 27],
];

const innerDots = [
  [14, 8],
  [8, 14],
  [20, 14],
  [14, 20],
];

export default function SparkIcon({
  size = 28,
  color = "#D4D4D4",
}: SparkIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
    >
      {/* Outer Ring */}
      <motion.g
        style={{ transformOrigin: "14px 14px" }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {outerDots.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={1.7}
            fill={color}
            animate={{
              opacity: [1, 0.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.g>

      {/* Inner Diamond */}
      <motion.g
        style={{ transformOrigin: "14px 14px" }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {innerDots.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={1.7}
            fill={color}
            animate={{
              opacity: [1, 0.35, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.g>
    </svg>
  );
}