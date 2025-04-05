import React, { useContext } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown, faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { convertToTimeZone } from '@/lib/utils';
import { AppContent } from '@/context/AppContext';

function Table({ columns, data, isTicketTable}) { 
    const [sortedData, setSortedData] = useState(data);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    useEffect(() => {
        console.log("Table received data:", data);
    }, [data]);

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

    const {userData} = useContext(AppContent)
    console.log("userdata")
    console.log(userData)

    const navigate = useNavigate();
    const handleRowClick = (row)=>{
        console.log("clicked");
        if (columns.includes("SUBJECT")) {
            if(userData.role==="admin") navigate(`/adminticketdetails`, {state: {data:row,  user:userData}}); 
            if(userData.role ==="participant") navigate(`/userticketdetails`,  { state: { data:row, user:userData } }); 
            console.log(row);
            return;
        } else if (columns.includes("NAME")) {
            navigate(`/adminparticipantdetails`, { state: { data:row } });
            return;
        }
        navigate(`/notfound`);
    }

    return (
        <div className="overflow-x-auto max-w-11/12 lg:max-w-full mt-3 p-4">
            <table className="md:min-w-11/12 table-fixed bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100 border border-gray-300">
                    <tr>
                        {columns.map((col, index) => (
                            col!=="id" &&(
                            <th
                                key={index}
                                className="text-sm px-4 py-3 text-left text-gray-600 font-poppins w-[200px]"
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
                                        style={{ marginTop: '-12px' }}
                                    />
                                </div>
                            </th>
                        )))}
                        {console.log(columns)}
                    </tr>
                </thead>
                <tbody>
                    {isTicketTable && sortedData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-500 hover:bg-gray-50 ">
                            {columns.map((col, colIndex) => (
                                col!=="id" &&(
                                <td key={colIndex} className={`px-4 py-3 text-sm font-poppins text-gray-700 ${col === 'Subject' ? 'w-2/5' : ''}`}>
                                    {col ==='SUBJECT' && item['Subject']}
                                    
                                    {col === 'PRIORITY' && item['PriorityType'] === 'Urgent' && (
                                        <div className="inline-flex mr-2 w-2.5 h-2.5 bg-red-600"></div>
                                    )}
                                    {col === 'PRIORITY' && item['PriorityType'] === 'High' && (
                                        <div className="inline-flex mr-2 w-2.5 h-2.5 bg-amber-600"></div>
                                    )}
                                    {col === 'PRIORITY' && item['PriorityType'] === 'Medium' && (
                                        <div className="inline-flex mr-2 w-2.5 h-2.5 bg-yellow-400"></div>
                                    )}
                                    {col === 'PRIORITY' && item['PriorityType'] === 'Low' && (
                                        <div className="inline-flex mr-2 w-2.5 h-2.5 bg-green-500"></div>
                                    )}
                                    {col === 'PRIORITY' && item['PriorityType']}

                                    {col === 'STATUS' && (
                                        <div className="flex items-center space-x-2">
                                            <div className={`font-semibold inline-flex w-24 md:w-30 rounded-2xl text-white p-1 justify-center
                                                ${item['Status'] === 'Open' || item['Status'] === 'Rejected' ? 'bg-red-400' :
                                                item['Status'] === 'Closed' || item['Status'] === 'Accepted' ? 'bg-lime-500' :
                                                item['Status'] === 'In Progress' || item['Status'] === 'Pending' ? 'bg-amber-500' :
                                                'bg-sky-400' // Resolved
                                                }`}
                                            >
                                                {item['Status']}
                                            </div>
                                            <FontAwesomeIcon onClick={() => handleRowClick(item)} className="text-xs md:text-sm cursor-pointer hover:text-red-600" icon={faExternalLink} />
                                        </div>
                                    )}

                                    {col ==='CREATED AT' && convertToTimeZone(item['CreatedAt'])}
                                    {col ==='UPDATED AT' && (item['updatedAt'])}
                                    
                                </td>
                            )))}
                        </tr>
                    ))}


                    {!isTicketTable && sortedData.map((item, index) => (
                        <tr key={index} className="border-b border-gray-500 hover:bg-gray-50 ">
                            {columns.map((col, colIndex) => (
                                col!=="id" &&(
                                <td key={colIndex} className={`px-4 py-3 text-sm font-poppins text-gray-700 ${col === 'Subject' ? 'w-2/5' : ''}`}>
                                    {col ==='NAME' && item['name']}
                                    
                                    {col === 'EMAIL' && item['email']}

                                    {col === 'STATUS' && (
                                        <div className="flex items-center space-x-2">
                                            <div className={`font-semibold inline-flex w-24 md:w-30 rounded-2xl text-white p-1 justify-center
                                                ${item['status'] === 'Open' || item['status'] === 'Rejected' ? 'bg-red-400' :
                                                item['status'] === 'Closed' || item['status'] === 'Accepted' ? 'bg-lime-500' :
                                                item['status'] === 'In Progress' || item['status'] === 'Pending' ? 'bg-amber-500' :
                                                'bg-sky-400' // Resolved
                                                }`}
                                            >
                                                {item['status']}
                                            </div>
                                            <FontAwesomeIcon onClick={() => handleRowClick(item)} className="text-xs md:text-sm cursor-pointer hover:text-red-600" icon={faExternalLink} />
                                        </div>
                                    )}

                                    {col ==='PHONE NUMBER' && (item['phone_number'])}
                                    
                                </td>
                            )))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;
