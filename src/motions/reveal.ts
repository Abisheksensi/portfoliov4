import { duration } from "./duration";

export const hoverScale = {
  whileHover: {
    scale: 1.05,
  },

  transition: {
    duration: duration.fast,
  },
};

export const hoverLift = {
  whileHover: {
    y: -6,
  },

  transition: {
    duration: duration.fast,
  },
};

export const hoverRotate = {
  whileHover: {
    rotate: 3,
  },

  transition: {
    duration: duration.fast,
  },
};

export const hoverPress = {
  whileTap: {
    scale: 0.96,
  },
};