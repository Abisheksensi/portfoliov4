import { duration } from "./duration";
import { easing } from "./easing";

export const pageTransition = {
  initial: {
    opacity: 0,
    y: 24,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: -24,
  },

  transition: {
    duration: duration.medium,
    ease: easing.smooth,
  },
};