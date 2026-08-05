export const MotionEasings = {
  smooth: [0.16, 1, 0.3, 1], // Linear-like fluid slide
  snappy: [0.25, 1, 0.5, 1],
  bouncy: [0.34, 1.56, 0.64, 1], // Arc-like pop
};

export const MotionSprings = {
  gentle: { stiffness: 100, damping: 15, mass: 1 },
  bouncy: { stiffness: 400, damping: 20, mass: 1 },
  stiff:  { stiffness: 500, damping: 30, mass: 1 }
};

export const PageTransitions = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: MotionEasings.smooth } },
  exit:    { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.3, ease: MotionEasings.smooth } }
};
