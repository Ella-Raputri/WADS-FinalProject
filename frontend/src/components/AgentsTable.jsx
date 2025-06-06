import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import FilterAgent from "./FilterAgent";
import { useEffect } from "react";


export function AgentsTable({data}) {
  const [openFilter, setOpenFilter] =useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [currentFilter, setCurrentFilter] = useState({
    status: "",
    sort: ""
  })

  useEffect(() => {
    setFilteredData(data);
  }, [data]);  

  const handleFilter = (newFilters) => {
    setOpenFilter(false);
    setCurrentFilter(newFilters);
    const { sort, status } = newFilters; 
    
    // filter the agents based on the status 
    const filtered = data.filter(ticket => {
      return status ? ticket.status.toLowerCase() === status.toLowerCase() : true;
    });
    
    // filter the agents based on how to sort the ticket amount
    const sortedArray = [...filtered].sort((a, b) => {
      if (a.tickets < b.tickets) return sort === "ascending" ? -1 : 1;
      if (a.tickets > b.tickets) return sort === "ascending" ? 1 : -1;
      return 0;
    });
  
    setFilteredData(sortedArray);
  };
  

  return (
    <div className="p-6 bg-white shadow rounded-lg w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-kanit font-medium text-2xl text-gray-500">Agents Details</h2>
        <button className="border bg-white border-slate-200 ml-2 transition duration-300 ease hover:border-slate-300 shadow-sm focus:shadow px-3 py-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer"
        onClick={() => setOpenFilter(true)}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
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
            {filteredData.map((agent, index) => (
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
          
      {openFilter && <FilterAgent isOpen={openFilter} onClose={()=>setOpenFilter(false)} onApply={handleFilter} currFilters={currentFilter}/>}

    </div>
  );
}
