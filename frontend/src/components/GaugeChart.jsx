"use client";

import React, { useEffect, useState, useRef } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";


export default function GaugeChart({targetPercentage}) {
  const [chartSize, setChartSize] = useState(400);
  const [percentage, setPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 400) setChartSize(250);
      else if (window.innerWidth < 600) setChartSize(320);
      else setChartSize(400);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 } 
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
      setPercentage(0);
      return;
    }

    let start = 0;
    const duration = 1500; 
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const currentValue = Math.round(progress * targetPercentage);
      setPercentage(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible]);

  const chartData = [{ value: percentage }];

  return (
    <div ref={chartRef} className="flex flex-col items-center w-full">
      <RadialBarChart
        width={chartSize}
        height={chartSize * 0.65}
        innerRadius="75%"
        outerRadius="100%"
        startAngle={180}
        endAngle={0}
        data={chartData}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          minAngle={15}
          background={{ fill: "#e0e0e0" }}
          clockWise
          dataKey="value"
          fill="#22C55E"
          cornerRadius={10}
        />
      </RadialBarChart>

      <div className="text-2xl md:text-4xl font-semibold font-poppins -mt-26 sm:-mt-40">
        {percentage}%
      </div>
    </div>
  );
}