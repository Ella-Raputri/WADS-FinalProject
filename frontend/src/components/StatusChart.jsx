"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";


export function StatusChart({ticketData}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { threshold: 0.2, triggerOnce: true });
  const [finalData, setFinalData] = useState(ticketData);

  useEffect(() => {
    setFinalData(ticketData);
  }, [ticketData]);  

  return (
    <div ref={containerRef} className="w-[95%] mx-auto">
      {finalData.map((ticket, index) => (
        <div key={ticket.status} className="mb-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">{ticket.status}</span>
            <span className="text-lg font-medium">{ticket.count}</span>
          </div>
          <div className="h-5 bg-gray-300 rounded-full mt-1 overflow-hidden mb-5 w-full">

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isInView ? ticket.width : 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`${ticket.color} h-full rounded-full`}
          />

          </div>
        </div>
      ))}
    </div>
  );
}
