import type { Target, Transition } from "framer-motion";
import { duration } from "../duration";
import { easing } from "../easing";

type EntranceMotion = {
  initial: Target;
  animate: Target;
  transition: Transition;
};

type EntranceDefaultOptions = {
  x?: number;
  y?: number;
  scale?: number;
  durationValue?: number;
};

function createEntrance(options: EntranceDefaultOptions): EntranceMotion;
function createEntrance(options: EntranceMotion): EntranceMotion;
function createEntrance(options: EntranceDefaultOptions | EntranceMotion): EntranceMotion {
  if (
    "initial" in options &&
    "animate" in options &&
    "transition" in options
  ) {
    return options;
  }

  const {
    x = 0,
    y = 0,
    scale,
    durationValue = duration.normal,
  } = options as EntranceDefaultOptions;

  return {
    initial: {
      opacity: 0,
      ...(x !== 0 ? { x } : {}),
      ...(y !== 0 ? { y } : {}),
      ...(scale !== undefined ? { scale } : {}),
    },

    animate: {
      opacity: 1,
      ...(x !== 0 ? { x: 0 } : {}),
      ...(y !== 0 ? { y: 0 } : {}),
      ...(scale !== undefined ? { scale: 1 } : {}),
    },

    transition: {
      duration: durationValue,
      ease: easing.entrance,
    },
  };
}

export const headingEntrance = {
  h1: {
    fadeIn: createEntrance({
      durationValue: duration.medium,
    }),

    fadeUp: createEntrance({
      y: 40,
      durationValue: duration.medium,
    }),

    fadeDown: createEntrance({
      y: -40,
      durationValue: duration.medium,
    }),

    scaleIn: createEntrance({
      y: 20,
      scale: 0.96,
      durationValue: duration.medium,
    }),

    reveal: createEntrance({
    initial: {
      opacity: 0,
      y: 40,
      filter: "blur(10px)",
    },

    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },

    transition: {
      duration: duration.medium,
      ease: easing.entrance,
    },
    }),
  },

  h2: {
    fadeIn: createEntrance({
      durationValue: duration.normal,
    }),

    fadeUp: createEntrance({
      y: 28,
      durationValue: duration.normal,
    }),

    fadeDown: createEntrance({
      y: -28,
      durationValue: duration.normal,
    }),

    scaleIn: createEntrance({
      scale: 0.97,
      durationValue: duration.normal,
    }),
  },

  h3: {
    fadeIn: createEntrance({
      durationValue: duration.normal,
    }),

    fadeUp: createEntrance({
      y: 20,
      durationValue: duration.normal,
    }),

    fadeLeft: createEntrance({
      x: 20,
      durationValue: duration.normal,
    }),

    fadeRight: createEntrance({
      x: -20,
      durationValue: duration.normal,
    }),
  },
};

export const bodyEntrance = {
  large: {
    fadeIn: createEntrance({
      durationValue: duration.normal,
    }),

    fadeUp: createEntrance({
      y: 18,
      durationValue: duration.normal,
    }),

    fadeLeft: createEntrance({
      x: 18,
      durationValue: duration.normal,
    }),
  },

  base: {
    fadeIn: createEntrance({
      durationValue: duration.normal,
    }),

    fadeUp: createEntrance({
      y: 14,
      durationValue: duration.normal,
    }),

    fadeLeft: createEntrance({
      x: 14,
      durationValue: duration.normal,
    }),
  },

  small: {
    fadeIn: createEntrance({
      durationValue: duration.normal,
    }),

    fadeUp: createEntrance({
      y: 10,
      durationValue: duration.normal,
    }),
  },
};

export const typographyEntrance = {
  heading: headingEntrance,
  body: bodyEntrance,
};

// Optional legacy exports for older imports
export const fadeIn = bodyEntrance.base.fadeIn;
export const fadeUp = bodyEntrance.base.fadeUp;
export const fadeDown = createEntrance({
  y: -32,
  durationValue: duration.medium,
});
export const fadeLeft = createEntrance({
  x: 32,
  durationValue: duration.medium,
});
export const fadeRight = createEntrance({
  x: -32,
  durationValue: duration.medium,
});
export const scaleIn = createEntrance({
  scale: 0.9,
  durationValue: duration.medium,
});

export const headlineCursor = {
  animate: {
    opacity: [1, 0, 1],
  },
  transition: {
    duration: 0.7,
    repeat: Infinity,
    ease: "linear",
  },
};
