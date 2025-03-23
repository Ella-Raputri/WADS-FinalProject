"use client";

import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const percentage = 90;
const chartData = [{ value: percentage }];

export default function GaugeChart() {
  const [chartSize, setChartSize] = useState(400);

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

  return (
    <div className="flex flex-col items-center w-full">
      <RadialBarChart
        width={chartSize}
        height={chartSize * 0.65} // Make height dynamic
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
          fill="#6BAF4E"
          cornerRadius={10}
        />
      </RadialBarChart>

      <div className="text-2xl md:text-4xl font-semibold font-poppins -mt-26 sm:-mt-40">
        {percentage}%
      </div>
    </div>
  );
}
