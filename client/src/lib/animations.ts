import { Variants } from 'framer-motion';

// Fade in animation
export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', delay: number = 0): Variants => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 0.8,
        delay,
      },
    },
  };
};

// Stagger children animation
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Zoom in animation
export const zoomIn = (delay: number = 0): Variants => {
  return {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 0.8,
        delay,
      },
    },
  };
};

// Slide in animation
export const slideIn = (direction: 'up' | 'down' | 'left' | 'right', type: string, delay: number, duration: number): Variants => {
  return {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type,
        delay,
        duration,
        ease: 'easeOut',
      },
    },
  };
};

// Card hover animation
export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    y: -10,
    boxShadow: "0 20px 25px -5px rgba(108, 99, 255, 0.2), 0 10px 10px -5px rgba(108, 99, 255, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

// Navbar animation
export const navVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      delay: 0.2,
    },
  },
};

// Rotational floating animation
export const floatingAnimation: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Skill progress animation
export const progressAnimation = (percentage: number): Variants => {
  return {
    hidden: { width: 0 },
    show: {
      width: `${percentage}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };
};

// Typing cursor animation
export const cursorBlink: Variants = {
  animate: {
    opacity: [0, 1, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};
