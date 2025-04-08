import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export const useSkillsAnimation = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const resetAnimation = () => {
    setHasAnimated(false);
  };

  return { ref, hasAnimated, resetAnimation };
};

export default useSkillsAnimation;
