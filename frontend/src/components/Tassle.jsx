import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

export default function Tassle() {
  const [isSwinging, setIsSwinging] = useState(false);
  const [hasSwungOnce, setHasSwungOnce] = useState(false);
  const tassleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasSwungOnce) {
          setIsSwinging(true);
          setHasSwungOnce(true); 
          setTimeout(() => setIsSwinging(false), 2000); 
        }
      },
      { threshold: 0.5 } 
    );

    if (tassleRef.current) {
      observer.observe(tassleRef.current);
    }

    return () => {
      if (tassleRef.current) {
        observer.unobserve(tassleRef.current);
      }
    };
  }, [hasSwungOnce]); 

  const handleClick = () => {
    setIsSwinging(true);
    setTimeout(() => setIsSwinging(false), 2000); 
  };

  return (
    <div className="flex justify-center" ref={tassleRef}>
      <motion.div
        className="w-15 lg:w-20 origin-top -translate-y-1 cursor-pointer"
        onClick={handleClick} 
        animate={{
          rotate: isSwinging ? [0, 15, -15, 10, -10, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "top center" }}
      >
        <img src="src/assets/welcome_page/tassle2.png" alt="decoration" />
      </motion.div>
    </div>
  );
}
