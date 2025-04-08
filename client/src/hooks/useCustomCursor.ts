import { useEffect, useState } from "react";

export const useCustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Add global event listeners
    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Setup hover tracking
    const handleElementMouseEnter = () => setIsHovering(true);
    const handleElementMouseLeave = () => setIsHovering(false);

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, .hover-target"
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener("mouseenter", handleElementMouseEnter);
      element.addEventListener("mouseleave", handleElementMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      
      interactiveElements.forEach(element => {
        element.removeEventListener("mouseenter", handleElementMouseEnter);
        element.removeEventListener("mouseleave", handleElementMouseLeave);
      });
    };
  }, []);

  return { position, isHovering, isVisible };
};

export default useCustomCursor;
