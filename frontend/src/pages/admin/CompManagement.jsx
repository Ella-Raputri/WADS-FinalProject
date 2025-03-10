import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faFilter } from "@fortawesome/free-solid-svg-icons"; 
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import SaveButton from '../../components/SaveButton';
import FilterStatusModal from '../../components/FilterStatusModal';

const CompManagement = () => {
  const cols = ["id", "NAME", "EMAIL","PHONE NUMBER", "STATUS"];
  const data = [
    {
        "id": 1,
        "competition_category": "Mathematics Olympiad",
        "name": "John Doe",
        "mandarin_name": "约翰·多伊",
        "date_of_birth": "2002-05-15",
        "gender": "Male",
        "full_address": "123 Main Street, Jakarta, Indonesia",
        "phone_number": "+62 812-3456-7890",
        "email": "johndoe@example.com",
        "institution": "University of Indonesia",
        "student_card_photo": "images.png",
        "payment_proof": "images.png",
        "upload_twibbon_proof":"images.png",
        "status":"Pending"
    },
    {
        "id": 2,
        "competition_category": "Physics Olympiad",
        "name": "Jane Smith",
        "mandarin_name": "简·史密斯",
        "date_of_birth": "2001-08-22",
        "gender": "Female",
        "full_address": "456 Maple Avenue, Surabaya, Indonesia",
        "phone_number": "+62 813-9876-5432",
        "email": "janesmith@example.com",
        "institution": "Bandung Institute of Technology",
        "student_card_photo": "jane_smith_student_card.jpg",
        "payment_proof": "jane_smith_payment.jpeg",
        "upload_twibbon_proof":"images.png",
        "status":"Accepted"
    },
    {
        "id": 3,
        "competition_category": "Programming Contest",
        "name": "Michael Tan",
        "mandarin_name": "迈克尔·谭",
        "date_of_birth": "2000-11-10",
        "gender": "Male",
        "full_address": "789 Pine Road, Medan, Indonesia",
        "phone_number": "+62 812-1122-3344",
        "email": "michaeltan@example.com",
        "institution": "Gadjah Mada University",
        "student_card_photo": "michael_tan_student_card.jpg",
        "payment_proof": "michael_tan_payment.jpg",
        "upload_twibbon_proof":"images.png",
        "status":"Rejected"
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [tracker, setTracker] = useState(1);
  const [openFilter, setOpenFilter] =useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [baseFilteredData, setBaseFilteredData] = useState(data);

  const location = useLocation();
  const updatedData = location.state?.updatedData;
  useEffect(() => {
    if (updatedData) {
      console.log("Updated participant status:", updatedData);
      
      setFilteredData(prevData => {
        return prevData.map(ticket => 
          ticket.id === updatedData.id ? { ...ticket, ...updatedData } : ticket
        );
      });
  
      setBaseFilteredData(prevData => {
        return prevData.map(ticket => 
          ticket.id === updatedData.id ? { ...ticket, ...updatedData } : ticket
        );
      });
  
      setCurrentPage(1); // Reset pagination
    }
  }, [updatedData]);


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

  const navigate = useNavigate();

  const handleFilter = (newFilters) => {
    setOpenFilter(false);
    const { status } = newFilters;
  
    const filtered = data.filter(ticket => {
      const isStatusMatch = status ? ticket.status.toLowerCase() === status : true;
      
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
      const inName = ticket.name.toLowerCase().includes(keywords.toLowerCase());
      const inEmail = ticket.email.toLowerCase().includes(keywords.toLowerCase());
      return inName || inEmail;
    });

    setFilteredData(searched);
    setCurrentPage(1);
  };
  

  return (
    <div>
      <h1 className='md:ml-20 mt-20 mb-3 font-medium text-4xl font-kanit p-5 pb-0'>
        Speech Competition
      </h1>


      <div className="pl-5 pr-8 pt-2 pb-0 md:ml-20 flex justify-between items-center font-poppins">
        <SearchBar onApply={handleSearch} placeholderSubject={"Search name or email..."}/>
        <div className="sm:mr-20 md:mr-26 2xl:mr-35 flex gap-5">
          <button className="border bg-white border-slate-200 transition duration-300 ease hover:border-slate-300 shadow-sm focus:shadow px-3 py-2 rounded-xl hover:bg-gray-100 hover:cursor-pointer"
          onClick={() => setOpenFilter(true)}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <SaveButton data={filteredData} type={"participants"}/>
        </div>
      </div>

      <div className="md:ml-20 mb-30 p-4 pt-0 pl-0">
        {currentData.length > 0 ? (
          <Table key={tracker} columns={cols} data={currentData} />
        ) : (
          <div className="text-center font-semibold text-gray-500 p-5">No data available</div>
        )}

      <div className="flex justify-between mt-2 text-xs md:text-sm md:mr-32 md:ml-5 font-poppins">
        {currentData.length>0 ? 
        (<>
          <p className='flex-1 text-gray-500'>
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
  );
};

export default CompManagement;
