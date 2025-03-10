import { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Modal.setAppElement("#root");

const FilterStatusModal = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    status: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
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
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="w-[80%] md:w-[400px] h-auto bg-white mx-auto shadow-xl rounded-lg p-6 overflow-y-auto"
      overlayClassName="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)]"
    >
      {/* Header */}
      <div className="flex justify-between items-center font-kanit">
        <h2 className="text-2xl">Filter</h2>
        <button onClick={onClose} className="text-xl cursor-pointer">✖</button>
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
          <option value="rejected">Rejected</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
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

export default FilterStatusModal;
