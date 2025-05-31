import React, { useContext } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { convertToTimeZone } from '@/lib/utils';
import { AppContent } from '@/context/AppContext';
   

function Table({ columns, data, isTicketTable}) { 
    const {userData} = useContext(AppContent)
    const navigate = useNavigate();

    const handleRowClick = (row)=>{
        if (columns.includes("SUBJECT")) {
            if(userData.role==="admin") navigate(`/adminticketdetails`, {state: {data:row,  user:userData}}); 
            if(userData.role ==="participant") navigate(`/userticketdetails`,  { state: { data:row, user:userData } }); 
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
                            >
                                {col}
                                
                            </th>
                        )))}
                    </tr>
                </thead>
                <tbody>
                    {isTicketTable && data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-500 hover:bg-gray-50 ">
                            {columns.map((col, colIndex) => (
                                col!=="id" &&(
                                <td key={colIndex} className={`px-4 py-3 text-sm font-poppins text-gray-700 ${col === 'Subject' ? 'w-2/5' : ''}`}>
                                    {col ==='SUBJECT' && item['Subject']}
                                    
                                    {col === 'PRIORITY' && item['PriorityType'] === 'Urgent' && (
                                        <div className="inline-flex mr-2 w-2.5 h-2.5 bg-red-600" data-testid='urgent'></div>
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
                                    {col ==='UPDATED AT' && convertToTimeZone(item['UpdatedAt'])}
                                    
                                </td>
                            )))}
                        </tr>
                    ))}


                    {!isTicketTable && data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-500 hover:bg-gray-50 ">
                            {columns.map((col, colIndex) => (
                                col!=="id" &&(
                                <td key={colIndex} className={`px-4 py-3 text-sm font-poppins text-gray-700 ${col === 'Subject' ? 'w-2/5' : ''}`}>
                                    {col ==='NAME' && item.userDetails.FullName}
                                    
                                    {col === 'EMAIL' && item.userDetails.Email}

                                    {col === 'STATUS' && (
                                        <div className="flex items-center space-x-2">
                                            <div className={`font-semibold inline-flex w-24 md:w-30 rounded-2xl text-white p-1 justify-center
                                                ${item.Status === 'Open' || item.Status === 'Rejected' ? 'bg-red-400' :
                                                item.Status === 'Closed' || item.Status === 'Accepted' ? 'bg-lime-500' :
                                                item.Status === 'In Progress' || item.Status === 'Pending' ? 'bg-amber-500' :
                                                'bg-sky-400' // Resolved
                                                }`}
                                            >
                                                {item.Status}
                                            </div>
                                            <FontAwesomeIcon onClick={() => handleRowClick(item)} className="text-xs md:text-sm cursor-pointer hover:text-red-600" icon={faExternalLink} />
                                        </div>
                                    )}

                                    {col ==='PHONE NUMBER' && (item.userDetails.PhoneNumber)}
                                    
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
