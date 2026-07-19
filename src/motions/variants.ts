export const staggerContainer = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const fadeUpVariant = {
  hidden: {
    opacity: 0,
    y: 24,
  },

  show: {
    opacity: 1,
    y: 0,
  },
};

export const fadeVariant = {
  hidden: {
    opacity: 0,
  },

  show: {
    opacity: 1,
  },
};

export const scaleVariant = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },

  show: {
    opacity: 1,
    scale: 1,
  },
};