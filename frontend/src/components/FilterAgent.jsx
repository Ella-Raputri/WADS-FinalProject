import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";

const FilterAgent = ({ isOpen, onClose, onApply, currFilters }) => {
  const [filters, setFilters] = useState({
    status: currFilters['status'],
    sort: currFilters['sort'],
  });

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

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
      onApply(filters);
      onClose();
  };

  const handleReset = () => {
    setFilters({
      status: "",
      sort:"",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[80%] md:w-[400px] h-auto bg-white mx-auto shadow-xl rounded-lg p-6 overflow-y-auto"
      overlayClassName="z-1000 fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)]"
    >
      {/* Header */}
      <div className="flex justify-between items-center font-kanit">
        <h2 className="text-2xl font-medium">Filter</h2>
        <button onClick={onClose} className="text-xl cursor-pointer">✖</button>
      </div>

      {/* Status Dropdown */}
      <div className="mt-6">
        <label className="block text-md font-poppins mb-1 font-medium">STATUS:</label>
        <select
          name="status"
          className="font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Select Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div className="mt-8">
        <label className="block text-md font-poppins mb-1 font-medium">SORT TICKET NUMBER:</label>
        <select
          name="sort"
          className="font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
          value={filters.sort}
          onChange={handleFilterChange}
        >
          <option value="">Select Sorting Method</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button
          className="bg-gray-400 hover:bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-md shadow-md font-semibold font-poppins text-sm"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-md shadow-md font-semibold font-poppins text-sm"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </Modal>
  );
};

export default FilterAgent;
