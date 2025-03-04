import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFilter } from "@fortawesome/free-solid-svg-icons"; 
import AccordionFAQ from '../../components/AccordionFAQ';
import { useNavigate } from 'react-router-dom';

const HelpPage = () => {
  const cols = ["SUBJECT", "CREATED AT", "UPDATED AT", "PRIORITY", "STATUS"];
  const data = [
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
    { subject: "Fix login issue", created_at: "2024-02-28", updated_at: "2024-02-28", priority: "High", status: "Open" },
    { subject: "Update dashboard UI", created_at: "2024-02-27", updated_at: "2024-02-28", priority: "Medium", status: "In Progress" },
    { subject: "Optimize database queries", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Low", status: "Closed" },
    { subject: "Cannot connect", created_at: "2024-02-26", updated_at: "2024-02-27", priority: "Urgent", status: "Resolved" },
    { subject: "Email not sending", created_at: "2024-02-25", updated_at: "2024-02-26", priority: "High", status: "Open" },
    { subject: "Bug in profile update", created_at: "2024-02-24", updated_at: "2024-02-25", priority: "Low", status: "Closed" },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [tracker, setTracker] = useState(1);

  const itemsPerPage = 5;
  const totalResult = data.length;
  const totalPage = Math.ceil(totalResult / itemsPerPage);

  useEffect(() => {
      console.log("Updated currentData:", currentData);
      setTracker(currentPage);
  }, [currentData]); 

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalResult);
    setCurrentData(data.slice(startIndex, endIndex));
    console.log(currentPage)
  }, [currentPage]); 

  const navigate = useNavigate();


  return (
    <>
      <h1 className='mt-20 font-medium text-center text-3xl font-kanit p-5 pb-3'>
        Frequently Asked Questions (FAQ)
      </h1>
      <div className="flex flex-col items-center justify-center p-5 pt-3 max-w-2xl font-poppins font-medium mx-auto">
        <AccordionFAQ />
      </div>


      <h1 className='md:ml-20 mt-12 font-medium text-3xl font-kanit p-5 pb-0'>
        Help Tickets
      </h1>


      <div className="pl-5 pr-8 pt-2 pb-0 md:ml-20 flex justify-between items-center font-poppins">
        <h3>Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalResult)} of {totalResult} results</h3>
        <div className="mr-10 flex gap-5">
          <button className="border border-gray-400 px-3 py-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer">
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <button className="font-semibold px-8 py-2 rounded-2xl bg-red-700 text-white hover:bg-red-800 hover:cursor-pointer"
          onClick={() => navigate('/usernewticket')}>
            NEW TICKET
          </button>
        </div>
      </div>

      <div className="md:ml-20 w-full mb-30 p-4 pt-0 pl-0">
        {currentData.length > 0 ? (
          <Table key={tracker} columns={cols} data={currentData} />
        ) : (
          <div className="text-center font-semibold text-gray-500 p-5">No data available</div>
        )}

      <div className="flex justify-end mt-2 text-xs md:text-sm md:mr-35 font-poppins">
        <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={setCurrentPage}/>
      </div>
      </div>
    </>
  );
};

export default HelpPage;
