"use client";

import { useEffect, useState, useRef } from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

const finalChartData = [
  { priority: "Urgent", count: 30, color: "#DC2626", darkColor: "#B91C1C" },
  { priority: "High", count: 50, color: "#D97706", darkColor: "#B45309" },
  { priority: "Medium", count: 70, color: "#FACC15", darkColor: "#EAB308" },
  { priority: "Low", count: 100, color: "#22C55E", darkColor: "#15803D" },
];

export function DonutChart() {
  const [chartSize, setChartSize] = useState(250);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 400) setChartSize(180);
      else if (window.innerWidth < 600) setChartSize(220);
      else setChartSize(250);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setShouldAnimate(true);
        }
      },
      { threshold: 0.1 } 
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setShouldAnimate(false);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  return (
    <div ref={chartRef} className="flex flex-col items-center w-full">
      <PieChart width={chartSize} height={chartSize}>
        <Pie
          data={finalChartData}
          dataKey="count"
          nameKey="priority"
          innerRadius={chartSize * 0.3}
          outerRadius={chartSize * 0.45}
          animationBegin={0}
          animationDuration={1500}
          animationEasing="ease-out"
          isAnimationActive={shouldAnimate}
        >
          {finalChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} 
            fill={hoveredIndex === index ? entry.darkColor : entry.color}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}/>
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) =>
            active && payload && payload.length ? (
              <div className="bg-white shadow-md p-2 rounded-md text-black">
                <p className="font-semibold">{payload[0].payload.priority}</p>
                <p>Count: {payload[0].value}</p>
              </div>
            ) : null
          }
        />
        <text 
          x="50%" 
          y="50%" 
          dy={8} 
          textAnchor="middle"
          className="fill-black text-lg md:text-xl font-semibold font-poppins"
        > 
          Tickets
        </text>
      </PieChart>
    </div>
  );
}