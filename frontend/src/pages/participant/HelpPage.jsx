import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFilter } from "@fortawesome/free-solid-svg-icons"; 
import AccordionFAQ from '../../components/AccordionFAQ';

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

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };


  return (
    <>
      <h1 className='mt-20 font-medium text-3xl font-kanit p-5 pb-3'>
        Frequently Asked Questions (FAQ)
      </h1>
      <div className='p-5 pt-3 max-w-2xl font-poppins font-medium'>
        <AccordionFAQ />
      </div>

      <h1 className='mt-10 font-medium text-3xl font-kanit p-5 pb-0'>
        Help Tickets
      </h1>


      <div className="pl-5 pr-8 pt-2 pb-0 flex justify-between items-center font-poppins">
        <h3>Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalResult)} of {totalResult} results</h3>
        <div className="flex gap-5">
          <button className="border border-gray-400 px-3 py-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer">
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <button className="font-semibold px-8 py-2 rounded-2xl bg-red-700 text-white hover:bg-red-800 hover:cursor-pointer">
            NEW TICKET
          </button>
        </div>
      </div>

      <div className="w-full min-h-screen p-4 pt-0 pl-0">
        {currentData.length > 0 ? (
          <Table key={tracker} columns={cols} data={currentData} />
        ) : (
          <div className="text-center font-semibold text-gray-500 p-5">No data available</div>
        )}

      <div className="flex justify-end mt-2 mr-3 font-poppins">
        <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={setCurrentPage}/>
      </div>
      

        {/* <div className="flex justify-end mr-5 gap-4 mt-5">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            Previous
          </button>
          <span className="text-lg font-medium">Page {currentPage} of {totalPage}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPage}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPage ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          >
            Next
          </button>
        </div> */}
      </div>
    </>
  );
};

export default HelpPage;
