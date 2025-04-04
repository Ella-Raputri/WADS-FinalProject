import React, { useState, useEffect, useContext } from 'react';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons"; 
import AccordionFAQ from '../../components/AccordionFAQ';
import { useNavigate } from 'react-router-dom';
import FilterModal from '../../components/FilterModal';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';

const HelpPage = () => {
  const cols = ["SUBJECT", "CREATED AT", "UPDATED AT", "PRIORITY", "STATUS"];
  const [data, setData] = useState([]);
  const {backendUrl} = useContext(AppContent);

  const fetchTickets = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/ticket/getAllTickets`);
        console.log("📡 Fetched Tickets:", response.data);

        if (response.data.success) {
            setData(response.data.tickets);
            setFilteredData(response.data.tickets)
        } else {
            console.warn("No tickets found:", response.data.message);
        }
    } catch (error) {
        console.error("Error fetching tickets:", error);
    } 
};

  useEffect(()=>{
    fetchTickets()
  },[backendUrl])

  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [tracker, setTracker] = useState(1);
  const [openFilter, setOpenFilter] =useState(false);
  const [filteredData, setFilteredData] = useState(data);

  const {isLoggedIn} = useContext(AppContent);

  const itemsPerPage = 5;
  const totalResult = filteredData.length; 
  const totalPage = Math.ceil(totalResult / itemsPerPage);

  useEffect(() => {
      console.log("Updated currentData:", currentData);
      setTracker(Math.random);
  }, [currentData]); 

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalResult);
    setCurrentData(filteredData.slice(startIndex, endIndex));
    console.log(currentPage)
  }, [currentPage, filteredData]); 

  const navigate = useNavigate();

  const handleFilter = (newFilters) => {
    setOpenFilter(false);
  
    const { createdStart, createdEnd, updatedStart, updatedEnd, priority, status } = newFilters;
  
    const dateCreateStart = createdStart ? new Date(createdStart) : null;
    const dateCreateEnd = createdEnd ? new Date(createdEnd) : null;
    const dateUpdateStart = updatedStart ? new Date(updatedStart) : null;
    const dateUpdateEnd = updatedEnd ? new Date(updatedEnd) : null;
  
    const filtered = data.filter(ticket => {
      const createdAt = new Date(ticket.created_at);
      const updatedAt = new Date(ticket.updated_at);
  
      const isWithinCreateRange =
        (!dateCreateStart || createdAt >= dateCreateStart) &&
        (!dateCreateEnd || createdAt <= dateCreateEnd);
  
      const isWithinUpdateRange =
        (!dateUpdateStart || updatedAt >= dateUpdateStart) &&
        (!dateUpdateEnd || updatedAt <= dateUpdateEnd);
  
      const isPriorityMatch = priority ? ticket.priority.toLowerCase() === priority : true;
      const isStatusMatch = status ? ticket.status.toLowerCase() === status : true;
      
      console.log("iterating ticket:");
      console.log(ticket);
      console.log(priority);
      console.log(isWithinCreateRange)
      console.log(isWithinUpdateRange)
      console.log(isPriorityMatch)
      console.log(isStatusMatch)
  
      return isWithinCreateRange && isWithinUpdateRange && isPriorityMatch && isStatusMatch;
    });
  
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };
  

  return (
    <>
      <h1 className='mt-20 font-medium text-center text-3xl font-kanit p-5 pb-3'>
        Frequently Asked Questions (FAQ)
      </h1>
      <div className="flex flex-col items-center justify-center p-5 pt-3 max-w-2xl font-poppins font-medium mx-auto">
        <AccordionFAQ />
      </div>

      {isLoggedIn && 
      <div>
      <div className="flex justify-between items-center md:ml-20 mt-15 p-6 pb-0">
        <h1 className="mt-2 font-medium text-3xl font-kanit">
          Help Tickets
        </h1>

        <div className="sm:mr-20 md:mr-28 2xl:mr-35 flex gap-5">
          <button 
            className="border border-slate-200 transition duration-300 ease hover:border-slate-300 shadow-sm focus:shadow px-3 py-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer"
            onClick={() => setOpenFilter(true)}
          >
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <button 
            className="font-poppins font-semibold px-4 py-2 transition duration-200 ease rounded-lg shadow-md bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer"
            onClick={() => navigate('/usernewticket')}
          >
            <FontAwesomeIcon icon={faPlus}/> &nbsp; New Ticket
          </button>
        </div>
      </div>


      <div className="md:ml-20 mb-30 p-4 pt-0 pl-0">
        {currentData.length > 0 ? (
          <Table key={tracker} columns={cols} data={currentData} role={"participant"} isTicketTable={true}/>
        ) : (
          <div className="text-center font-semibold text-gray-500 p-5">No data available</div>
        )}

      <div className="flex justify-between mt-2 text-xs md:text-sm md:mr-32 md:ml-5 font-poppins">
        {currentData.length>0 ? 
        (<>
          <p className='flex-1 te`xt-gray-500 ml-5 md:ml-0'>
          {`Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, totalResult)} - 
              ${Math.min(currentPage * itemsPerPage, totalResult)} of ${totalResult} results`}
          </p>
  
          <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={setCurrentPage}/>
        </>)  : (<></>)
      }
      
      </div>
      </div>

      {openFilter && <FilterModal isOpen={openFilter} onClose={()=>setOpenFilter(false)} onApply={handleFilter}/>}
      </div>
      }
      
      </>
  );
};

export default HelpPage;
