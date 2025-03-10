import React from 'react'

function SaveButton({data, type}) {

    const handleSaveList = () => {
        if (data.length === 0) {
          alert("No data available to save!");
          return;
        }
      
        const headers = Object.keys(data[0]);
      
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

        URL.revokeObjectURL(url);
      };
      

  return (
    <>
        <button className="font-semibold px-8 py-2 rounded-2xl bg-red-700 text-white hover:bg-red-800 hover:cursor-pointer"
          onClick={handleSaveList}>
            SAVE LIST
          </button>
    </>
  )
}

export default SaveButton