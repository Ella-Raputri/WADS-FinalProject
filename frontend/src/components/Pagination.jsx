import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  // get page numbers based on the current maximum number
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; 

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center space-x-2">

      {/* previous button */}
      <button
        className={`px-3 py-1 sm:ml-40 text-gray-500 hover:text-black disabled:text-gray-300
            ${currentPage === 1 ? "hover:cursor-default" : "hover:cursor-pointer"}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      {/* the numbers */}
      <div className="hidden lg:flex space-x-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-md 
              ${page === currentPage ? "bg-gray-300 cursor-default" : "text-gray-500 hover:bg-gray-100"}
              ${page === "..." ? "cursor-default hover:bg-transparent" : "hover:cursor-pointer"}
            `}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      {/* next button */}
      <button
        className={`px-3 py-1 text-gray-500 hover:text-black disabled:text-gray-300
            ${currentPage === totalPages ? "hover:cursor-default" : "hover:cursor-pointer"}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
