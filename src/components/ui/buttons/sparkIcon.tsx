"use client";

import { motion } from "framer-motion";

interface SparkIconProps {
  readonly size?: number;
  readonly color?: string;
  readonly  isactive?: boolean;
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
  isactive = false,
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
        animate={
          isactive 
            ? { rotate: 360, scale: 1 } 
            : { rotate: 0, scale: [1, 0.85, 1] } // Gentle pulse when idle
        }
        transition={
          isactive
            ? { duration: 3, repeat: Infinity, ease: "linear" }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        {outerDots.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={1.7}
            fill={color}
            animate={{
              // A long, varied array of opacities simulates a random twinkling effect!
              opacity: isactive ? [1, 0.08, 0.08, 0.02, 0.7, 0.3, 0.09, 0.01, 1] : 1, 
            }}
            transition={{
              duration: 4, // Lengthened slightly to fit all the random keyframes smoothly
              repeat: Infinity,
              delay: i * 0.27, // Staggering the delay makes every dot look uniquely random
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.g>

      {/* Inner Diamond */}
      {/* Inner Diamond */}
      <motion.g
        style={{ transformOrigin: "14px 14px" }}
        animate={
          isactive 
            ? { rotate: -360, scale: 1 } 
            : { rotate: 0, scale: [1, 0.85, 1] } // Gentle pulse when idle
        }
        transition={
          isactive
            ? { duration: 3, repeat: Infinity, ease: "linear" }
            : { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      >

        {innerDots.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={1.7}
            fill={color}
            animate={{
              // A slightly different varied array for the inner diamond
              opacity: isactive ? [0.81, 0.4, 0.09, 0.01, 0.08, 0.02, 1] : 1,
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: i * 0.42,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.g>
    </svg>
  );
}