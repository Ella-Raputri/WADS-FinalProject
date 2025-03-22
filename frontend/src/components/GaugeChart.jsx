'use client';

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

const percentage = 90; // Change this value dynamically if needed

const chartData = [{ value: percentage }];

export default function GaugeChart() {
  const radius = 100; // Radius of the gauge
  const angle = ((percentage / 100) * 180) - 90; // Convert percentage to degrees

  return (
    <div className="flex flex-col items-center">
      <RadialBarChart
        width={400}
        height={240} // Half-circle height
        // cx="50%"
        // cy="100%"
        innerRadius="75%"
        outerRadius="100%"
        startAngle={180}
        endAngle={0}
        data={chartData}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          minAngle={15}
          background={{ fill: '#e0e0e0' }} // Background color
          clockWise
          dataKey="value"
          fill="#6BAF4E" // Green color
          cornerRadius={10}
        />
      </RadialBarChart>

      {/* Percentage Label */}
      <div className="text-4xl font-semibold font-poppins -mt-35">{percentage}%</div>
    </div>
  );
}
