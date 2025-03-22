import React from "react";
import { FaFilter } from "react-icons/fa"; // Import filter icon

const agents = [
  { name: "Ella Raputri", tickets: 87, status: "Online" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
  { name: "Ella Raputri", tickets: 87, status: "Offline" },
];

export function AgentsTable() {
  return (
    <div className="p-6 bg-white shadow rounded-lg w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-kanit font-medium text-2xl text-gray-400">Agents Details</h2>
        <FaFilter className="text-brown-800 text-lg cursor-pointer" />
      </div>

      {/* Scrollable Table Container */}
      <div className="h-[300px] overflow-y-auto">
        <table className="w-full border-collapse">
          {/* Table Header (Sticky) */}
          <thead className="sticky top-0 bg-white shadow">
            <tr className="text-left text-gray-500 text-sm">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Tickets Worked</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {agents.map((agent, index) => (
              <tr key={index} className="border-t">
                <td className="py-3 px-4 text-lg">{agent.name}</td>
                <td className="py-3 px-4 text-lg font-semibold">{agent.tickets}</td>
                <td
                  className={`py-3 px-4 text-lg font-semibold ${
                    agent.status === "Online" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {agent.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
