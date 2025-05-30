import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { faCalendar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import React from "react";

// Modal.setAppElement("#root");

const FilterModal = ({ isOpen, onClose, onApply, currFilters }) => {
  const [filters, setFilters] = useState({
    createdStart: currFilters['createdStart'],
    createdEnd: currFilters['createdEnd'],
    updatedStart: currFilters['updatedStart'],
    updatedEnd: currFilters['updatedEnd'],
    priority: currFilters['priority'],
    status: currFilters['status'],
    sortMethod: currFilters['sortMethod'],
    sortBy: currFilters['sortBy'],
  });

  // Refs for date inputs
  const createdStartRef = useRef(null);
  const createdEndRef = useRef(null);
  const updatedStartRef = useRef(null);
  const updatedEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
  
      const navbar = document.querySelector(".navbar"); // Ensure this class is in your Navbar
      if (navbar) {
        navbar.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
  
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        navbar.style.paddingRight = "0px";
      }
    }
  
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
  
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        navbar.style.paddingRight = "0px";
      }
    };
  }, [isOpen]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
      const today = new Date();
      today.setHours(23,59,59,59); 
    
      const startDateCreate = filters.createdStart;
      const endDateCreate = filters.createdEnd;
      const startDateUpdate = filters.updatedStart;
      const endDateUpdate = filters.updatedEnd;

      if ((startDateCreate && !endDateCreate) || (endDateCreate && !startDateCreate)) {
        toast.error("Please select both start and end dates for the creation time.");
        return;
      }
      if ((startDateUpdate && !endDateUpdate) || (endDateUpdate && !startDateUpdate)) {
        toast.error("Please select both start and end dates for the updated time.");
        return;
      }
    
      const startCreate = new Date(startDateCreate);
      const endCreate = new Date(endDateCreate);
      if (startCreate > endCreate) {
        toast.error("Start date cannot be later than the end date (creation time).");
        return;
      }
      if (startCreate > today || endCreate > today) {
        toast.error("Dates cannot be in the future (creation time).");
        return;
      }

      const startUpdate = new Date(startDateUpdate);
      const endUpdate = new Date(endDateUpdate);
      if (startUpdate > endUpdate) {
        toast.error("Start date cannot be later than the end date (update time).");
        return;
      }
      if (startUpdate > today || endUpdate > today) {
        toast.error("Dates cannot be in the future (update time).");
        return;
      }
    
      onApply(filters);
      onClose();
  };

  const handleReset = () => {
    setFilters({
      createdStart: "",
      createdEnd: "",
      updatedStart: "",
      updatedEnd: "",
      priority: "",
      status: "",
      sortMethod: "",
      sortBy: "",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[80%] md:w-[600px] h-auto bg-white mx-auto shadow-xl rounded-lg p-6 overflow-y-auto"
      overlayClassName="fixed inset-0 flex z-1000 justify-center items-center bg-[rgba(0,0,0,0.5)]"
    >
      <div className="h-[80vh] md:h-[70vh] overflow-y-auto" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
        {/* Header */}
        <div className="top-0 sticky pt-1 bg-white z-10">
          <div className="flex justify-between items-center font-kanit">
            <h2 className="text-2xl font-medium">Filter</h2>
            <button onClick={onClose} className="text-3xl cursor-pointer hover:text-gray-600 text-gray-500"> <FontAwesomeIcon icon={faTimes}/></button>
          </div>
        </div>        

        {/* Created At */}
        <div className="mt-4">
          <label htmlFor="createdStart" className="block text-md mb-2 font-poppins font-medium">
            CREATED AT:
          </label>
          <div className="md:flex gap-2">
            <div className="relative w-full">
              <input
                id='createdStart'
                 data-testid="createdStart"
                type="date"
                name="createdStart"
                className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                value={filters.createdStart}
                onChange={handleFilterChange}
                ref={createdStartRef}
              />
              <button
                type="button"
                className="absolute cursor-pointer right-2 top-1 text-gray-500 w-5 h-5"
                onClick={() => createdStartRef.current?.showPicker()}
              >
                <FontAwesomeIcon icon={faCalendar} />
              </button>
            </div>
            <p className="md:p-2 text-center">-</p>
            <div className="relative w-full">
              <input
                type="date"
                data-testid='createdEnd'
                name="createdEnd"
                className="bg-white font-poppins placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none w-full focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                value={filters.createdEnd}
                onChange={handleFilterChange}
                ref={createdEndRef}
              />
              <button
                type="button"
                className="absolute cursor-pointer right-2 top-1 text-gray-500 w-5 h-5"
                onClick={() => createdEndRef.current?.showPicker()}
              >
                <FontAwesomeIcon icon={faCalendar} />
              </button>
            </div>
          </div>
        </div>

        {/* Updated At */}
        <div className="mt-6">
          <label htmlFor="updatedStart" className="block text-md mb-2 font-poppins font-medium">UPDATED AT:</label>
          <div className="md:flex gap-2">
            <div className="relative w-full">
              <input
                id="updatedStart"
                type="date"
                name="updatedStart"
                className="w-full font-poppins bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                value={filters.updatedStart}
                onChange={handleFilterChange}
                ref={updatedStartRef}
              />
              <button
                type="button"
                className="absolute cursor-pointer right-2 top-1 text-gray-500 w-5 h-5"
                onClick={() => updatedStartRef.current?.showPicker()}
              >
                <FontAwesomeIcon icon={faCalendar} />
              </button>
            </div>
            <p className="md:p-2 text-center">-</p>
            <div className="relative w-full">
              <input
                type="date"
                name="updatedEnd"
                className="w-full font-poppins bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                value={filters.updatedEnd}
                onChange={handleFilterChange}
                ref={updatedEndRef}
              />
              <button
                type="button"
                className="absolute cursor-pointer right-2 top-1 text-gray-500 w-5 h-5"
                onClick={() => updatedEndRef.current?.showPicker()}
              >
                <FontAwesomeIcon icon={faCalendar} />
              </button>
            </div>
          </div>
        </div>

        {/* Priority Dropdown */}
        <div className="mt-6">
          <label htmlFor="priority" className="block text-md font-poppins mb-2 font-medium">PRIORITY:</label>
          <select
            id="priority"
            name="priority"
            className="w-full font-poppins cursor-pointer bg-white  text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="mt-6">
          <label htmlFor="status" className="block text-md font-poppins mb-2 font-medium">STATUS:</label>
          <select
            id="status"
            name="status"
            className="w-full cursor-pointer bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Select Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="closed">Closed</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Sort Method */}
        <div className="mt-6">
          <label htmlFor="sortMethod" className="block text-md font-poppins mb-2 font-medium">SORT METHOD:</label>
          <select
            id="sortMethod"
            name="sortMethod"
            className="w-full cursor-pointer bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
            value={filters.sortMethod}
            onChange={handleFilterChange}
          >
            <option value="">Select Sort Method</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="mt-6">
          <label htmlFor="sortBy" className="block text-md font-poppins mb-2 font-medium">SORT BY:</label>
          <select
            id="sortBy"
            name="sortBy"
            className="w-full cursor-pointer bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="">Select Sort By</option>
            <option value="Subject">Subject</option>
            <option value="CreatedAt">Created At</option>
            <option value="UpdatedAt">Updated At</option>
            <option value="PriorityType">Priority</option>
            <option value="Status">Status</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end text-sm font-poppins font-semibold gap-5">
          <button
            className="bg-gray-400 hover:bg-gray-500 shadow-md cursor-pointer text-white px-4 py-2 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 shadow-md cursor-pointer text-white px-4 py-2 rounded"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
