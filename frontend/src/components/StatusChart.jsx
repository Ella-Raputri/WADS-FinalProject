"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const ticketData = [
  { status: "Open", count: 280, color: "bg-red-400", width: "w-[50%]" },
  { status: "Pending", count: 280, color: "bg-amber-500", width: "w-[40%]" },
  { status: "Resolved", count: 280, color: "bg-sky-400", width: "w-[70%]" },
  { status: "Closed", count: 280, color: "bg-lime-500", width: "w-[60%]" },
];

export function StatusChart() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { threshold: 0.2, triggerOnce: true });

  return (
    <div ref={containerRef} className="w-[95%] mx-auto">
      {ticketData.map((ticket, index) => (
        <div key={ticket.status} className="mb-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">{ticket.status}</span>
            <span className="text-lg font-medium">{ticket.count}</span>
          </div>
          <div className="h-5 bg-gray-300 rounded-full mt-1 overflow-hidden mb-5 w-full">

            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: ticket.width.replace("w-[", "").replace("%]", "%") } : {}}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`${ticket.color} h-full rounded-full`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
