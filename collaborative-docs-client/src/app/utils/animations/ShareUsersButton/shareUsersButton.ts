import { Variants } from "framer-motion";

const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "100%",
    scale: 0.95,
    borderRadius: "40px 40px 0 0",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    borderRadius: "0px",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: "100%",
    scale: 0.95,
    borderRadius: "40px 40px 0 0",
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.4,
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 0.3,
    },
  },
};

const userItemVariants: Variants = {
  initial: { x: 0, scale: 1 },
  hover: {
    x: 8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};
export { backdropVariants, modalVariants, contentVariants, userItemVariants };
