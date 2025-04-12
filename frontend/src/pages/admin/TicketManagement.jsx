import React, { useState, useEffect, useContext } from 'react';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFilter } from "@fortawesome/free-solid-svg-icons"; 
import SearchBar from '../../components/SearchBar';
import FilterModal from '../../components/FilterModal';
import SaveButton from '../../components/SaveButton';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';

const TicketManagement = () => {
  const cols = ["SUBJECT", "CREATED AT", "UPDATED AT", "PRIORITY", "STATUS"];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [tracker, setTracker] = useState(1);
  const [openFilter, setOpenFilter] =useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [baseFilteredData, setBaseFilteredData] = useState(data);
  const {backendUrl, userData, socket, initializeSocket} = useContext(AppContent);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;
  const totalResult = filteredData.length; 
  const totalPage = Math.ceil(totalResult / itemsPerPage);

  useEffect(() => {
      setTracker(Math.random);
  }, [currentData]); 

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalResult);
    setCurrentData(filteredData.slice(startIndex, endIndex));
  }, [currentPage, filteredData]); 

  const handleFilter = (newFilters) => {
    setOpenFilter(false);
  
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
    setBaseFilteredData(filtered);
    setCurrentPage(1); 
  };

  const handleSearch = (keywords) =>{
    if (!keywords.trim()) {
      setFilteredData(baseFilteredData); 
      return;
    }

    const searched = filteredData.filter(ticket => {
      const inSubject = ticket.Subject.toLowerCase().includes(keywords.toLowerCase());
      return inSubject;
    });

    setFilteredData(searched);
    setCurrentPage(1);
  };

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
        const response = await axios.get(`${backendUrl}api/ticket/getTicketByCompId?compId=${userData.admin.CompTypeId}`);
        const tickets = response.data.tickets;

        if (response.data.success && tickets.length > 0) {
          const updatedAtList = await Promise.all(
            tickets.map(ticket => fetchUpdatedAt(ticket._id))
          );
    
          const mergedTickets = tickets.map((ticket, idx) => ({
            ...ticket,
            UpdatedAt: updatedAtList[idx],
          }));
    
          setData(mergedTickets);
          setFilteredData(mergedTickets);
          setBaseFilteredData(mergedTickets); 
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
  },[backendUrl])

  useEffect(() => {
      if (!userData || !userData.id) return; 

      if (!socket) {
          console.log("🔄 Initializing socket...");
          initializeSocket(userData.id);
      }
  }, [userData]);

  return (
    <>
      <h1 className='md:ml-20 mt-20 mb-3 font-medium text-4xl font-kanit p-5 pb-0'>
        Ticket Management
      </h1>


      <div className="pl-5 pr-8 pt-2 pb-0 md:ml-20 flex justify-between items-center font-poppins">
        <SearchBar onApply={handleSearch} placeholderSubject={"Search subject..."}/>
        <div className="sm:mr-20 md:mr-26 2xl:mr-35 flex gap-2">
          <button className="border bg-white border-slate-200 transition ml-2 duration-300 ease hover:border-slate-300 shadow-sm focus:shadow px-3 py-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer"
          onClick={() => setOpenFilter(true)}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <SaveButton data={filteredData} type={"tickets"}/>
        </div>
      </div>

      <div className="md:ml-20 mb-30 p-4 pt-0 pl-0">
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
          <p className='flex-1 text-gray-500 ml-5 md:ml-0'>
          {`Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, totalResult)} - 
              ${Math.min(currentPage * itemsPerPage, totalResult)} of ${totalResult} results`}
          </p>
  
          <Pagination currentPage={currentPage} totalPages={totalPage} onPageChange={setCurrentPage}/>
        </>)  : (<></>)
      }
      
      </div>
      </div>

      {openFilter && <FilterModal isOpen={openFilter} onClose={()=>setOpenFilter(false)} onApply={handleFilter}/>}
    </>
  );
};

export default TicketManagement;
