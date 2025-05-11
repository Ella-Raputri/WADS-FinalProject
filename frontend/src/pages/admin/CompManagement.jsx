import React, { useState, useEffect, useContext } from 'react';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFilter } from "@fortawesome/free-solid-svg-icons"; 
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import SaveButton from '../../components/SaveButton';
import FilterStatusModal from '../../components/FilterStatusModal';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';

const CompManagement = () => {
  const cols = ["id", "NAME", "EMAIL","PHONE NUMBER", "STATUS"];
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [tracker, setTracker] = useState(1);
  const [openFilter, setOpenFilter] =useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [baseFilteredData, setBaseFilteredData] = useState(data);
  const {userData, socket, initializeSocket, backendUrl} = useContext(AppContent);
  const [competitionType, setCompetitionType] = useState('');
  const [isLoading, setIsLoading] = useState(true);

//   const location = useLocation();
//   const updatedData = location.state?.updatedData;
//   useEffect(() => {
//     if (updatedData) {
//       console.log("Updated participant status:", updatedData);
      
//       setFilteredData(prevData => {
//         return prevData.map(ticket => 
//           ticket.id === updatedData.id ? { ...ticket, ...updatedData } : ticket
//         );
//       }); 
  
//       setBaseFilteredData(prevData => {
//         return prevData.map(ticket => 
//           ticket.id === updatedData.id ? { ...ticket, ...updatedData } : ticket
//         );
//       });
  
//       setCurrentPage(1); // Reset pagination
//     }
//   }, [updatedData]);


  const itemsPerPage = 10;
  const totalResult = filteredData.length; 
  const totalPage = Math.ceil(totalResult / itemsPerPage);

  useEffect(() => {
      // console.log("Updated currentData:", currentData);
      setTracker(Math.random);
  }, [currentData]); 

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalResult);
    setCurrentData(filteredData.slice(startIndex, endIndex));
    console.log(currentPage)
  }, [currentPage, filteredData]); 

  useEffect(() => {
      if (!userData || !userData.id) return; 

      if (!socket) {
          console.log("🔄 Initializing socket...");
          initializeSocket(userData.id);
      }
      fetchComps();
      fetchCompType();
  }, [userData]);

  const fetchComps = async()=>{
    try {
        const response = await axios.get(backendUrl+'api/competitionRegistration/'+userData.admin.CompTypeId);
        if (response.data.success) {
            let resultData = response.data.competitions;

            // 🔽 Sort competitions in reverse by CreatedAt (most recent first)
            resultData.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));

            setBaseFilteredData(resultData);
            setData(resultData);
            setFilteredData(resultData);
            console.log(resultData);
        }
    } catch (error) {
        console.error(error)
    }
  }

  const fetchCompType = async()=>{
    try {
        const response = await axios.get(backendUrl+'api/competition/getCompetitionDetails?compId='+userData.admin.CompTypeId);
        if(response.data.success){
            setCompetitionType(response.data.comp.Name);
            setIsLoading(false);
        }
    } catch (error) {
        console.error(error)
    }
  }

  const navigate = useNavigate();

  const handleFilter = (newFilters) => {
    setOpenFilter(false);
    const { status } = newFilters;
  
    const filtered = data.filter(ticket => {
      const isStatusMatch = status ? ticket.Status.toLowerCase() === status : true;
      
      console.log("iterating ticket:");
      console.log(ticket);
      console.log(isStatusMatch)
  
      return isStatusMatch;
    });
  
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
      const inName = ticket.userDetails.FullName.toLowerCase().includes(keywords.toLowerCase());
      const inEmail = ticket.userDetails.Email.toLowerCase().includes(keywords.toLowerCase());
      const inPhone = ticket.userDetails.PhoneNumber.toLowerCase().includes(keywords.toLowerCase());
      return inName || inEmail || inPhone;
    });

    setFilteredData(searched);
    setCurrentPage(1);
  };
  

  return (
    <>
    {isLoading? <div className='bg-center'>Loading...</div> :
    <div>
      <h1 className='md:ml-20 mt-20 mb-3 font-medium text-4xl font-kanit p-5 pb-0'>
        {competitionType} Competition
      </h1>


      <div className="pl-5 pr-8 pt-2 pb-0 md:ml-20 flex justify-between items-center font-poppins">
        <SearchBar onApply={handleSearch} placeholderSubject={"Search name or email..."}/>
        <div className="sm:mr-20 md:mr-26 2xl:mr-35 flex gap-2">
          <button className="border bg-white border-slate-200 ml-2 transition duration-300 ease hover:border-slate-300 shadow-sm focus:shadow px-3 py-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer"
          onClick={() => setOpenFilter(true)}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <SaveButton data={filteredData} type={"participants"}/>
        </div>
      </div>

      <div className="md:ml-20 mb-30 p-4 pt-0 pl-0">
        {currentData.length > 0 ? (
          <Table key={tracker} columns={cols} data={currentData} isTicketTable={false}/>
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

      {openFilter && <FilterStatusModal isOpen={openFilter} onClose={()=>setOpenFilter(false)} onApply={handleFilter}/>}
    </div>
    }
    </>
  );
};

export default CompManagement;
