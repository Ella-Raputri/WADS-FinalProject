import React from 'react';
import { MdOutlineFileDownload } from "react-icons/md";

function SaveButton({data, type}) {
    
    // function to save data
    const handleSaveList = () => {
        if (data.length === 0) {
          toast.error("No data available to save!");
          return;
        }
        const headers = Object.keys(data[0]);   //making the column headers
        
        // making the content
        const csvContent = [
          headers.join(","), 
          ...data.map(row => headers.map(field => `"${row[field]}"`).join(",")) 
        ].join("\n");
      
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
      
        const link = document.createElement("a");
        link.href = url;
        link.download = type + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);     //download the csv
      };
      

  return (
    <>
        <button className="font-semibold px-3 shadow-md transition duration-300 ease py-2 rounded-2xl bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer"
          onClick={handleSaveList}>
            <MdOutlineFileDownload className='text-2xl'/>
          </button>
    </>
  )
}

export default SaveButton