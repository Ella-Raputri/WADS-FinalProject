import { motion } from "framer-motion";
import { useState } from "react";

export default function Tassle() {
  const [isSwinging, setIsSwinging] = useState(false);

  return (
    <div className="flex justify-center"> 

      {/* Swaying Body */}
      <motion.div
        className="w-20 lg:w-25 origin-top"
        onClick={() => setIsSwinging(!isSwinging)}
        animate={{
          rotate: isSwinging ? [0, 15, -15, 10, -10, 5, -5, 0] : 0, 
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: isSwinging ? 1 : 0, 
        }}
        style={{ transformOrigin: "top center" }}
      >
        <img src="src/assets/welcome_page/tassle.png" alt="decoration" />
      </motion.div>
    </div>
  );
}
