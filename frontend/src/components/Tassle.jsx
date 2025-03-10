import { motion } from "framer-motion";
import { useState } from "react";

export default function Tassle() {
  const [isSwinging, setIsSwinging] = useState(false);

  return (
    <div className="flex justify-center"> 

      {/* Swaying Body */}
      <motion.div
        className="w-15 lg:w-20 origin-top -translate-y-1"
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
        <img src="src/assets/welcome_page/tassle2.png" alt="decoration" />
      </motion.div>
    </div>
  );
}
