"use client";

import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { motion, useInView } from "framer-motion";

const chartData = [
  { month: "Mon", received: 250, resolved: 180 },
  { month: "Tue", received: 260, resolved: 185 },
  { month: "Wed", received: 255, resolved: 190 },
  { month: "Thu", received: 265, resolved: 195 },
  { month: "Fri", received: 270, resolved: 200 },
  { month: "Sat", received: 275, resolved: 205 },
  { month: "Sun", received: 205, resolved: 215 },
];

export function BarChartMulti() {
  const chartRef = useRef(null);
  const isInView = useInView(chartRef, { threshold: 0.2, triggerOnce: true });
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShowChart(true);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="flex flex-col items-center w-full lg:mt-15 lg:row-span-2 h-[300px] lg:h-[570px]"
    >
      <ResponsiveContainer width="90%" height="90%">
        {showChart && (
          <BarChart data={chartData} barCategoryGap={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis />
            <Tooltip />
            <Legend iconType="square" />
            <Bar
              dataKey="received"
              fill="#DD3833"
              radius={4}
              name="Received"
              animationDuration={1200} 
            />
            <Bar
              dataKey="resolved"
              fill="#F9E04B"
              radius={4}
              name="Resolved"
              animationDuration={1200}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}
