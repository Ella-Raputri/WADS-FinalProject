import React from 'react'

const ticketData = [
    { status: "Open", count: 280, color: "bg-red-400", width: "w-[50%]" },
    { status: "Pending", count: 280, color: "bg-amber-500", width: "w-[40%]" },
    { status: "Resolved", count: 280, color: "bg-sky-400", width: "w-[70%]" },
    { status: "Closed", count: 280, color: "bg-lime-500", width: "w-[60%]" },
  ];
  
  export function StatusChart() {
    return (
      <div className="w-[90%] mx-auto"> {/* 90% width container */}
        {ticketData.map((ticket) => (
          <div key={ticket.status} className="mb-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{ticket.status}</span>
              <span className="text-lg font-medium">{ticket.count}</span>
            </div>
            <div className="h-5 bg-gray-300 rounded-full mt-1 overflow-hidden mb-5 w-full">
              <div className={`${ticket.color} h-full ${ticket.width} rounded-full`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  