"use client";

import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { motion, useInView } from "framer-motion";


export function BarChartMulti({chartData}) {
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
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} />
            <Tooltip
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="bg-white shadow-md p-2 rounded-md">
                    <p className="font-semibold font-poppins">{payload[0].payload.month}</p>
                    {payload.map((entry, index) => (
                      <p key={index} className="font-poppins font-medium" style={{ color: `${entry.color}` }}>
                        {entry.name}: {entry.value}
                      </p>
                    ))}
                  </div>
                ) : null
              }
            />
            <Legend iconType="square" wrapperStyle={{ fontWeight: '500' }} />
            <Bar
              dataKey="received"
              fill="oklch(0.637 0.237 25.331)"
              radius={4}
              name="Received"
              animationDuration={1200}
            />
            <Bar
              dataKey="resolved"
              fill="oklch(0.768 0.233 130.85)" 
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
