import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Modal.setAppElement("#root");

const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    createdStart: "",
    createdEnd: "",
    updatedStart: "",
    updatedEnd: "",
    priority: "",
    status: "",
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
        alert("Please select both start and end dates for the creation time.");
        return;
      }
      if ((startDateUpdate && !endDateUpdate) || (endDateUpdate && !startDateUpdate)) {
        alert("Please select both start and end dates for the updated time.");
        return;
      }
    
      const startCreate = new Date(startDateCreate);
      const endCreate = new Date(endDateCreate);
      if (startCreate > endCreate) {
        alert("Start date cannot be later than the end date (creation time).");
        return;
      }
      if (startCreate > today || endCreate > today) {
        alert("Dates cannot be in the future (creation time).");
        return;
      }

      const startUpdate = new Date(startDateUpdate);
      const endUpdate = new Date(endDateUpdate);
      if (startUpdate > endUpdate) {
        alert("Start date cannot be later than the end date (update time).");
        return;
      }
      if (startUpdate > today || endUpdate > today) {
        alert("Dates cannot be in the future (update time).");
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
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[80%] md:w-[600px] h-auto bg-white mx-auto shadow-xl rounded-lg p-6 overflow-y-auto"
      overlayClassName="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)]"
    >
      {/* Header */}
      <div className="flex justify-between items-center font-kanit">
        <h2 className="text-2xl">Filter</h2>
        <button onClick={onClose} className="text-xl cursor-pointer">✖</button>
      </div>

      {/* Created At */}
      <div className="mt-4">
        <label className="block text-sm mb-1 font-poppins font-medium">CREATED AT:</label>
        <div className="md:flex gap-2">
          <div className="relative w-full">
            <input
              type="date"
              name="createdStart"
              className="border p-2 rounded w-full pr-10"
              value={filters.createdStart}
              onChange={handleFilterChange}
              ref={createdStartRef}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 w-5 h-5"
              onClick={() => createdStartRef.current?.showPicker()}
            >
              <FontAwesomeIcon icon={faCalendar} />
            </button>
          </div>
          <p className="md:p-2 text-center">-</p>
          <div className="relative w-full">
            <input
              type="date"
              name="createdEnd"
              className="border p-2 rounded w-full pr-10"
              value={filters.createdEnd}
              onChange={handleFilterChange}
              ref={createdEndRef}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 w-5 h-5"
              onClick={() => createdEndRef.current?.showPicker()}
            >
              <FontAwesomeIcon icon={faCalendar} />
            </button>
          </div>
        </div>
      </div>

      {/* Updated At */}
      <div className="mt-4">
        <label className="block text-sm mb-1 font-poppins font-medium">UPDATED AT:</label>
        <div className="md:flex gap-2">
          <div className="relative w-full">
            <input
              type="date"
              name="updatedStart"
              className="border p-2 rounded w-full pr-10"
              value={filters.updatedStart}
              onChange={handleFilterChange}
              ref={updatedStartRef}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 w-5 h-5"
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
              className="border p-2 rounded w-full pr-10"
              value={filters.updatedEnd}
              onChange={handleFilterChange}
              ref={updatedEndRef}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500 w-5 h-5"
              onClick={() => updatedEndRef.current?.showPicker()}
            >
              <FontAwesomeIcon icon={faCalendar} />
            </button>
          </div>
        </div>
      </div>

      {/* Priority Dropdown */}
      <div className="mt-4">
        <label className="block text-sm font-poppins mb-1 font-medium">PRIORITY:</label>
        <select
          name="priority"
          className="border p-2 rounded w-full"
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
      <div className="mt-4">
        <label className="block text-sm font-poppins mb-1 font-medium">STATUS:</label>
        <select
          name="status"
          className="border p-2 rounded w-full"
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

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          className="bg-gray-400 hover:bg-gray-500 cursor-pointer text-white px-4 py-2 rounded"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
