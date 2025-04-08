import { useCustomCursor } from '@/hooks/useCustomCursor';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const { position, isHovering, isVisible } = useCustomCursor();

  return (
    <>
      {/* Large cursor circle */}
      <motion.div
        className="fixed w-5 h-5 rounded-full bg-primary/50 mix-blend-difference pointer-events-none z-50"
        animate={{
          x: position.x,
          y: position.y,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{
          type: 'spring', 
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
        style={{
          left: -10,
          top: -10,
          opacity: isVisible ? 1 : 0
        }}
      />
      
      {/* Small cursor dot */}
      <motion.div
        className="fixed w-1.5 h-1.5 rounded-full bg-primary z-50 pointer-events-none"
        animate={{
          x: position.x,
          y: position.y
        }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 28
        }}
        style={{
          left: -3,
          top: -3,
          opacity: isVisible ? 1 : 0
        }}
      />
    </>
  );
};

export default CustomCursor;
