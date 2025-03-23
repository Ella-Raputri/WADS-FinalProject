"use client"

import { useEffect, useState } from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts"

const chartData = [
  { priority: "Urgent", count: 30, color: "#DC2626" },
  { priority: "High", count: 50, color: "#D97706" },
  { priority: "Medium", count: 70, color: "#FACC15" },
  { priority: "Low", count: 100, color: "#22C55E" },
];

export function DonutChart() {
  const [chartSize, setChartSize] = useState(250);

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

  return (
    <div className="flex flex-col items-center w-full">
      <PieChart width={chartSize} height={chartSize}>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="priority"
          innerRadius={chartSize * 0.3}
          outerRadius={chartSize * 0.45}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
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
        <text x="50%" y="50%" dy={8} textAnchor="middle"
          className="fill-black text-lg md:text-xl font-semibold font-poppins"
        > Tickets
        </text>
      </PieChart>
    </div>
  );
}
