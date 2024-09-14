import React, { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

const HiddenNavbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const springConfig = { stiffness: 300, damping: 30 };
  const navbarY = useSpring(-100, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const shouldShow = e.clientY < 50;
      setIsVisible(shouldShow);
      navbarY.set(shouldShow ? 0 : -100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [navbarY]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-16 bg-black bg-opacity-50 backdrop-blur-md z-50"
      style={{ y: navbarY }}
    >
      <div className="absolute top-4 right-4"></div>
    </motion.div>
  );
};

export default HiddenNavbar;
