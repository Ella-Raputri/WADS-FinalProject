import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";


function Table({columns, data}) { 
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const handleSort = (column) => {
        const columnKey = column.replace(/\s+/g, '_').toLowerCase(); 

        let direction = "asc";
        if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
        direction = "desc";
        }

        const sortedArray = [...sortedData].sort((a, b) => {
        if (a[columnKey] < b[columnKey]) return direction === "asc" ? -1 : 1;
        if (a[columnKey] > b[columnKey]) return direction === "asc" ? 1 : -1;
        return 0;
        });

        setSortedData(sortedArray);
        setSortConfig({ key: columnKey, direction });
    };

  return (
    <div className="overflow-x-auto w-full p-4">
      <table className="min-w-full table-fixed bg-white shadow-md rounded-lg overflow-hidden" >
        <thead className="bg-gray-100">
          <tr>
          {columns.map((col, index) => (
              <th
                key={index}
                className="text-sm px-4 py-3 text-left text-gray-600 font-poppins cursor-pointer"
                onClick={() => handleSort(col)}
              >
                {col}

                <div className="inline-flex flex-col ml-2 mt-2">
                    <FontAwesomeIcon
                        icon={faSortUp}
                        className={`${sortConfig.key === col.replace(/\s+/g, '_').toLowerCase() && sortConfig.direction === "asc" ? "text-gray-700" : "text-gray-400"}`}
                    />
                    <FontAwesomeIcon
                        icon={faSortDown}
                        className={`${sortConfig.key === col.replace(/\s+/g, '_').toLowerCase() && sortConfig.direction === "desc" ? "text-gray-700" : "text-gray-400"}`}
                        style={{marginTop:'-12px'}}
                    />
                </div>
                
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
        {sortedData.map((item, index) => (
            <tr key={index} className="border-b border-gray-500 hover:bg-gray-50 hover:cursor-pointer">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={`px-4 py-3 text-sm font-poppins text-gray-700 ${col === 'Subject' ? 'w-2/5' : ''}`}>
                  {col === 'PRIORITY' && item[col.toLowerCase()]=='Urgent' && (
                    <div className="inline-flex mr-2 w-2.5 h-2.5 bg-red-600"></div>
                  )}
                  {col === 'PRIORITY' && item[col.toLowerCase()]=='High' &&(
                    <div className="inline-flex mr-2 w-2.5 h-2.5 bg-amber-600"></div>
                  )}
                  {col === 'PRIORITY' && item[col.toLowerCase()]=='Medium'&& (
                    <div className="inline-flex mr-2 w-2.5 h-2.5 bg-yellow-400"></div>
                  )}
                  {col === 'PRIORITY' && item[col.toLowerCase()]=='Low' && (
                    <div className="inline-flex mr-2 w-2.5 h-2.5 bg-green-500"></div>
                  )}

                  {col === 'STATUS' && item[col.toLowerCase()]=='Open' && (
                    <div className="font-semibold inline-flex bg-red-400 w-auto rounded-2xl text-white p-1 pl-5 pr-5">
                        {item[col.toLowerCase()]}
                    </div>
                  )}
                  {col === 'STATUS' && item[col.toLowerCase()]=='Closed' && (
                    <div className="font-semibold inline-flex bg-lime-500 w-auto rounded-2xl text-white p-1 pl-5 pr-5">
                        {item[col.toLowerCase()]}
                    </div>
                  )}
                  {col === 'STATUS' && item[col.toLowerCase()]=='In Progress' && (
                    <div className="font-semibold inline-flex bg-amber-500 w-auto rounded-2xl text-white p-1 pl-5 pr-5">
                        {item[col.toLowerCase()]}
                    </div>
                  )}
                  {col === 'STATUS' && item[col.toLowerCase()]=='Resolved' && (
                    <div className="font-semibold inline-flex bg-sky-400 w-auto rounded-2xl text-white p-1 pl-5 pr-5">
                        {item[col.toLowerCase()]}
                    </div>
                  )}

                  {col!=='STATUS' && item[col.replace(/\s+/g, '_').toLowerCase()]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table