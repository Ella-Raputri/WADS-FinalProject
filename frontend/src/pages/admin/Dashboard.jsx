import { AgentsTable } from "@/components/AgentsTable";
import { BarChartMulti } from "@/components/BarChartMulti";
import { DonutChart } from "@/components/DonutChart";
import GaugeChart from "@/components/GaugeChart";
import { StatusChart } from "@/components/StatusChart";
import React, { useRef, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdOutlineFileDownload } from "react-icons/md";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AppContent } from "@/context/AppContext";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { convertToCSV, convertToTimeZone } from "@/lib/utils";
import Loading from "@/components/Loading";

const Dashboard = () => {
  const {userData, backendUrl, socket, initializeSocket, onlineUsersRef} = useContext(AppContent);
  const [date, setDate] = useState(new Date());

  const [totalTickets, setTotalTickets] = useState(0);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [firstRespTime, setFirstRespTime] = useState([0,0]);
  const [fullResolveTime, setFullResolveTime] = useState([0,0]);
  const [custSatisfRate, setCustSatisfRate] = useState(0);

  const [vertBarChartData, setVertBarChartData] = useState([]);
  const [donutChartData, setDonutChartData] = useState([]);
  const [horizBarChartData, setHorizBarChartData] = useState([]);
  const [agentTableData, setAgentTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const priorityColors = {
    Urgent: { color: "#DC2626", darkColor: "#B91C1C" },
    High: { color: "#D97706", darkColor: "#B45309" },
    Medium: { color: "#FACC15", darkColor: "#EAB308" },
    Low: { color: "#22C55E", darkColor: "#15803D" },
  };

  const transformPriorityData = (apiData) => {
    return ["Urgent", "High", "Medium", "Low"].map(priority => ({
      priority,
      count: apiData[priority] ?? 0,
      ...priorityColors[priority]
    }));
  };

    useEffect(() => {
        if (!agentTableData) return; // Guard against null/undefined
        
        const newTable = updateAgentStatus(agentTableData);
        setAgentTableData(newTable);
    }, [onlineUsersRef.current.length]);

    const updateAgentStatus = (newData)=>{
        return newData.map(agent => ({
            id: agent.id,
            name: agent.name,
            tickets: agent.tickets,
            status: onlineUsersRef.current.includes(agent.id) ? "Online" : "Offline"
        }));
    }

    const transformAgentData = (apiData) => {
        return apiData.map(agent => ({
            id: agent.agentId,
            name: agent.agentName,
            tickets: agent.ticketCount,
            status: onlineUsersRef.current.includes(agent.agentId) ? "Online" : "Offline"
        }));
    };

  const statusColors = {
    "Open": { color: "bg-red-400"},
    "In Progress": { color: "bg-amber-500" },
    "Resolved": { color: "bg-sky-400" },
    "Closed": { color: "bg-lime-500"},
  };

  const transformStatusData = (apiData) => {
    const total = Object.values(apiData).reduce((sum, count) => sum + count, 0);

    return ["Open", "In Progress", "Resolved", "Closed"].map(status => {
      const count = apiData[status] ?? 0;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

      return {
        status,
        count,
        width: `${percentage}%`, 
        ...statusColors[status],
      };
    });
  };

  useEffect(() => {
    handleDateChange(date);
  }, [])

  useEffect(() => {
      if (!userData || !userData.id) return; 

      if (!socket) {
          console.log("🔄 Initializing socket...");
          initializeSocket(userData.id);
      }
  }, [userData]);
  
  const handleDateChange = async (newDate) => {
    setLoading(true);
    setDate(newDate);
    const formattedFull = convertToTimeZone(newDate.toISOString()); // example: "11-04-2025 11:10:03"

    // console.log("full: ", formattedFull)
    const [day, month, yearWithTime] = formattedFull.split("-");
    const [year] = yearWithTime.split(",");
    const formattedDate = `${year}-${month}-${day}`; 

    // console.log("f:", formattedDate);
    const compTypeId = userData.admin.CompTypeId;

    try {
      const { data: dataTotalTicket } = await axios.get(`${backendUrl}api/admindashboard/totaltickets`, {
        params: { date: formattedDate, compTypeId }
      });
      setTotalTickets(dataTotalTicket.totalTickets);
      
      const { data: dataTotalParticipant } = await axios.get(`${backendUrl}api/admindashboard/totalparticipants`, {
        params: { date: formattedDate, compTypeId }
      });
      setTotalParticipants(dataTotalParticipant.totalParticipants);

      const { data: dataFirstResp } = await axios.get(`${backendUrl}api/admindashboard/firstresponsetime`, {
        params: { date: formattedDate, compTypeId }
      });
      const totalMinsFirstResp = dataFirstResp.avgFirstRespTime;
      const hoursFirstResp = Math.floor(totalMinsFirstResp / 60); 
      const minutesFirstResp = Math.round(totalMinsFirstResp % 60);
      setFirstRespTime([hoursFirstResp, minutesFirstResp]);

      const { data: dataFullResolve } = await axios.get(`${backendUrl}api/admindashboard/fullresolvetime`, {
        params: { date: formattedDate, compTypeId }
      });
      const totalMins = dataFullResolve.avgFullResolveTime;
      const hours = Math.floor(totalMins / 60); 
      const minutes = Math.round(totalMins % 60);
      setFullResolveTime([hours, minutes]);

      const { data: dataCustSat } = await axios.get(`${backendUrl}api/admindashboard/ratingmetrics`, {
        params: { date: formattedDate, compTypeId }
      });
      setCustSatisfRate(dataCustSat.avgRating);

      const { data: dailyChartData } = await axios.get(`${backendUrl}api/admindashboard/receiveresolvebar`, {
        params: { date: formattedDate, compTypeId }
      });
      setVertBarChartData(dailyChartData);

      const { data: emergencyChartData } = await axios.get(`${backendUrl}api/admindashboard/ticketbyemergency`, {
        params: { date: formattedDate, compTypeId }
      });
      setDonutChartData(transformPriorityData(emergencyChartData));

      const { data: agentData } = await axios.get(`${backendUrl}api/admindashboard/agenttickets`, {
        params: { date: formattedDate, compTypeId }
      });
      setAgentTableData(transformAgentData(agentData));

      const { data: statusChartData } = await axios.get(`${backendUrl}api/admindashboard/ticketbystatus`, {
        params: { date: formattedDate, compTypeId }
      });
      setHorizBarChartData(transformStatusData(statusChartData));

    } 
    catch (error) {
      toast.error("Error fetching data:", error);
      console.log(error);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    const zip = new JSZip();
  
    const csv1 = convertToCSV(vertBarChartData, ["dayName", "received", "resolved"]);
    zip.file("resolved_vs_received.csv", csv1);
  
    const csv2 = convertToCSV(donutChartData, ["priority", "count"]);
    zip.file("tickets_by_emergency.csv", csv2);
  
    const csv3 = convertToCSV(horizBarChartData, ["status", "count"]);
    zip.file("tickets_by_status.csv", csv3);
  
    const csv4 = convertToCSV(agentTableData, ["name", "tickets", "status"]);
    zip.file("agent_ticket_data.csv", csv4);
  
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "dashboard_data.zip");
  };
  

  return (
    <>
    
    {loading? <Loading></Loading> :
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 lg:ml-15 ml-12 mt-25 mb-10 mr-15 space-y-4 sm:space-y-0">
        <h1 className="text-3xl lg:text-5xl font-kanit font-medium flex-grow text-center sm:text-left">
          Hello, {userData.name}!
        </h1>
        <button className="md:px-4 flex justify-center py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl 
          shadow-md cursor-pointer w-full sm:w-auto" onClick={handleDownload}>
           <span className="sm:hidden font-poppins text-md font-semibold">Download &nbsp;</span> 
           <MdOutlineFileDownload className="text-2xl lg:text-3xl"/>
        </button>
      </div>

      <div className="lg:hidden ml-12 mr-12 mb-10 p-6 bg-white shadow rounded-lg flex justify-center items-center overflow-x-auto">
        <div className="min-w-[300px]">
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            className="mb-2"
          />
        </div>
      </div>

      <div className="font-poppins lg:ml-18 ml-15 mr-15 grid grid-cols-1 lg:grid-cols-[0.8fr_1.0fr_1.2fr] gap-6">
        <div className="p-6   bg-white shadow rounded-lg ">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-500">Total Participants</h2>
          <h2 className="text-5xl font-medium mb-0">{totalParticipants}</h2>
        </div>
        <div className="p-6   bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-500">First Response Time</h2>
          <h2 className="text-5xl font-medium mb-0">{firstRespTime[0]}<span className="text-2xl ml-1">h</span> {firstRespTime[1]}<span className="text-2xl ml-1">m</span></h2>
        </div>
        <div className="hidden lg:flex p-6 bg-white shadow rounded-lg lg:row-span-2 justify-center items-center">
          <Calendar 
            onChange={handleDateChange} 
            value={date} 
            className="mt-2 mb-2"
          />
        </div>
        <div className="p-6   bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-500">Total Tickets</h2>
          <h2 className="text-5xl font-medium mb-0">{totalTickets}</h2>
        </div>
        <div className="p-6   bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-500">Full Resolve Time</h2>
          <h2 className="text-5xl font-medium mb-0">{fullResolveTime[0]}<span className="text-2xl ml-1">h</span> {fullResolveTime[1]}<span className="text-2xl ml-1">m</span></h2>
        </div>
      </div>

      <div className="font-poppins lg:ml-18 ml-15 grid grid-cols-1 lg:grid-cols-[2.0fr_1.0fr] gap-6 mr-15 mt-8">
        <div className="p-6 bg-white shadow rounded-lg lg:row-span-2 overflow-x-auto">
          <div className="min-w-[300px]">
            <h2 className="font-kanit font-medium text-2xl mb-5 text-gray-500">Resolved Ticket vs Received Ticket</h2>
            <BarChartMulti chartData={vertBarChartData}/>
          </div>          
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-500">Customer Satisfaction Rate</h2>
          <GaugeChart targetPercentage={custSatisfRate}/>
        </div>
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="font-kanit font-medium text-2xl mb-4 text-gray-500">Tickets by Emergency</h2>
          <DonutChart finalChartData={donutChartData}/>
        </div>
      </div>


      <div className="font-poppins lg:ml-18 ml-15 grid grid-cols-1 lg:grid-cols-2 gap-6 mr-15 mt-8 mb-20">
        <AgentsTable data={agentTableData}/>
        
        <div className="p-6 bg-white shadow rounded-lg flex justify-center"> {/* Center the chart */}
          <div className="w-full flex justify-center">
            <div className="w-[96%] ">
              <h2 className="font-kanit font-medium text-2xl mb-6 text-gray-500">Tickets by Status</h2>
              <StatusChart ticketData={horizBarChartData}/>
            </div>
          </div>
        </div>
      </div>

    </>
    }

    </>
  );
};

export default Dashboard;
