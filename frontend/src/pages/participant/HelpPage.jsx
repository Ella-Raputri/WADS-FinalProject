import React, { useState, useEffect, useContext } from 'react';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFilter, faMessage, faPlus } from "@fortawesome/free-solid-svg-icons"; 
import AccordionFAQ from '../../components/AccordionFAQ';
import { useNavigate } from 'react-router-dom';
import FilterModal from '../../components/FilterModal';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import ChatModal from '@/components/ChatModal';

const HelpPage = () => {
  const cols = ["SUBJECT", "CREATED AT", "UPDATED AT", "PRIORITY", "STATUS"];
  const [data, setData] = useState([]);
  const {backendUrl} = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [tracker, setTracker] = useState(1);
  const [openFilter, setOpenFilter] =useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [currentFilter, setCurrentFilter] = useState({
    createdStart: "",
    createdEnd: "",
    updatedStart: "",
    updatedEnd: "",
    priority: "",
    status: "",
    sortMethod: "",
    sortBy: "",
  });
  const [isOpenChatAI, setIsOpenChatAI] =useState(false);

  const {isLoggedIn, userData, socket, initializeSocket} = useContext(AppContent);

  const itemsPerPage = 5;
  const totalResult = filteredData.length; 
  const totalPage = Math.ceil(totalResult / itemsPerPage);

  const fetchUpdatedAt = async (ticketId) => {
      try {
          const {data} = await axios.get(`${backendUrl}api/ticket/getUpdatedAtByTicketId?ticketId=${ticketId}`);
          return data.latestUpdatedAt;
      } catch (err) {
          console.error("Failed to fetch updatedAt for ticket", ticketId, err);
          return null;
      }
  }; 

  const fetchTickets = async () => {
    try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}api/ticket/getAllTickets`);
        const tickets = response.data.tickets;

        if (response.data.success && tickets.length > 0) {
          const updatedAtList = await Promise.all(
            tickets.map(ticket => fetchUpdatedAt(ticket._id))
          );
    
          const mergedTickets = tickets.map((ticket, idx) => ({
            ...ticket,
            UpdatedAt: updatedAtList[idx],
          }));
           mergedTickets.sort((a, b) => new Date(b.UpdatedAt) - new Date(a.UpdatedAt));
    
          setData(mergedTickets);
          setFilteredData(mergedTickets);
        } 
        else {
            console.warn("No tickets found:", response.data.message);
        }
    } catch (error) {
        console.error("Error fetching tickets:", error);
    } 
    finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchTickets()
  },[backendUrl]);

  useEffect(() => {
      console.log("Updated currentData:", currentData);
      setTracker(Math.random);
  }, [currentData]); 

  useEffect(() => {
        if (!userData || !userData.id) return; 
  
        if (!socket) {
            console.log("🔄 Initializing socket...");
            initializeSocket(userData.id);
        }
    }, [userData]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalResult);
    setCurrentData(filteredData.slice(startIndex, endIndex));
    console.log(currentPage)
  }, [currentPage, filteredData]); 

  const navigate = useNavigate();

  const handleFilter = (newFilters) => {
    setOpenFilter(false);
    setCurrentFilter(newFilters);
    const { createdStart, createdEnd, updatedStart, updatedEnd, priority, status, sortMethod, sortBy } = newFilters;
  
    const dateCreateStart = createdStart ? new Date(createdStart) : null;
    const dateCreateEnd = createdEnd ? new Date(createdEnd) : null;
    const dateUpdateStart = updatedStart ? new Date(updatedStart) : null;
    const dateUpdateEnd = updatedEnd ? new Date(updatedEnd) : null;
  
    const filtered = data.filter(ticket => {
      const createdAt = new Date(ticket.CreatedAt);
      const updatedAt = new Date(ticket.UpdatedAt); 
  
      const isWithinCreateRange =
        (!dateCreateStart || createdAt >= dateCreateStart) &&
        (!dateCreateEnd || createdAt <= dateCreateEnd);
  
      const isWithinUpdateRange =
        (!dateUpdateStart || updatedAt >= dateUpdateStart) &&
        (!dateUpdateEnd || updatedAt <= dateUpdateEnd);
  
      const isPriorityMatch = priority ? ticket.PriorityType.toLowerCase() === priority : true;
      const isStatusMatch = status ? ticket.Status.toLowerCase() === status : true;
  
      return isWithinCreateRange && isWithinUpdateRange && isPriorityMatch && isStatusMatch;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
  
        if (aVal == null || bVal == null) return 0; 
  
        if (typeof aVal === "string" && typeof bVal === "string") { //sort string
          return sortMethod === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
  
        if (aVal instanceof Date || bVal instanceof Date) { //sort date
          const aDate = new Date(aVal);
          const bDate = new Date(bVal);
          return sortMethod === "asc" ? aDate - bDate : bDate - aDate;
        }

        return sortMethod === "asc" ? aVal - bVal : bVal - aVal; //sort num
      });
    }
  
    setFilteredData(filtered);
    setCurrentPage(1); 
  };
  

  return (
    <>
      <h1 className='mt-20 font-medium text-center text-3xl font-kanit p-5 pb-3'>
        Frequently Asked Questions (FAQ)
      </h1>
      <div className="flex flex-col items-center justify-center p-5 pt-3 max-w-2xl font-poppins font-medium mx-auto">
        <AccordionFAQ />
      </div>

      <button data-testid='btnai' 
      onClick={() => setIsOpenChatAI(true)}
      class="fixed bottom-4 right-4 bg-red-600 text-white py-3 px-4 rounded-full hover:bg-red-700 transition shadow-md cursor-pointer">
        <FontAwesomeIcon icon={faMessage}/>
      </button>


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


      <div className="md:ml-20 mb-30 p-4 pt-0 pl-0" data-testid='table'>
        {loading ? (
          <div className="text-center font-semibold text-gray-500 p-5">Loading...</div>
        ) : currentData.length > 0 ? (
          <Table key={tracker} columns={cols} data={currentData} isTicketTable={true}/>
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

      {openFilter && <FilterModal isOpen={openFilter} onClose={()=>setOpenFilter(false)} onApply={handleFilter} currFilters={currentFilter}/>}

      </div>
      }

      {isOpenChatAI && <ChatModal isOpen={isOpenChatAI} onClose={()=>setIsOpenChatAI(false)} user={userData}/>}
      
      </>
  );
};

export default HelpPage;
