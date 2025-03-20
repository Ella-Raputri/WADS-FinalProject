import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  // Function to get the start and end of the selected week
  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Start of the week (Sunday)
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // End of the week (Saturday)

    return { start, end };
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const { start, end } = getWeekRange(newDate);
    console.log("Filtering data from:", start.toDateString(), "to", end.toDateString());
    
    // Fetch or filter chart data based on the selected week
  };

  return (
    <>
      <h1 className="md:ml-15 mt-25 mb-10 font-medium text-5xl font-kanit p-5 pb-0">
        Hello, user!
      </h1>

      <div className="font-poppins md:ml-18 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[0.8fr_1.0fr_1.2fr] gap-6">
        <div className="p-6 bg-white shadow rounded-lg ">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Total Participants</h2>
          <h2 className="text-6xl font-medium">23</h2>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">First Response Time</h2>
          <h2 className="text-6xl font-medium">1<span className="text-4xl">h</span> 23<span className="text-4xl">m</span></h2>
        </div>
        <div className="p-6 bg-white shadow rounded-lg lg:row-span-2 mr-15 flex justify-center items-center">
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            className="mt-2 mb-2"
          />
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Total Tickets</h2>
          <h2 className="text-6xl font-medium">23</h2>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Full Resolve Time</h2>
          <h2 className="text-6xl font-medium">1<span className="text-4xl">h</span> 23<span className="text-4xl">m</span></h2>
        </div>
      </div>

      
      <div className="font-poppins md:ml-18 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.0fr_1.0fr] gap-6 mr-15 mt-8">
        <div className="p-6 bg-white shadow rounded-lg lg:row-span-2">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Resolved Ticket vs Received Ticket</h2>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Customer Satisfaction Rate</h2>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Tickets by Emergency</h2>
        </div>
      </div>


      <div className="font-poppins md:ml-18 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mr-15 mt-8 mb-20">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Agent Details</h2>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-400">Tickets by Status</h2>
        </div>
      </div>

    </>
  );
};

export default Dashboard;
