import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faCheck, faChevronLeft, faFilePen, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ChatBox";
import UploadImage from "@/components/UploadImage";
import { convertToTimeZone } from "@/lib/utils";
import axios from "axios";
import { AppContent } from "@/context/AppContext";
import { toast } from "react-toastify";
import RatingPopup from "@/components/RatingPopup";

const TicketDetails = () => {
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageUploaded, setImageUploaded] =useState(null);
  const [imageName, setImageName] = useState("");
  const [adminNames, setAdminNames] =useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [user, setUser] =useState(null);
  const [fetchNum, setFetchNum] =useState(0);

  const messagesEndRef = useRef(null);
  const {backendUrl, socket, initializeSocket, uploadImage} = useContext(AppContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [ratingResult, setRatingResult] = useState(null);
  const [msgLoading, setMsgLoading] = useState(false);

  // scroll the latest message into view
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
      if (!user || !user.id) return; 

      if (!socket) {
          initializeSocket(user.id);
      }
  }, [user, socket]); 

  useEffect(() => {
      if (!data || !data._id || !socket) return;

      socket.emit("joinRoom", data._id);

      socket.on("updatedStatus", (newStatus) =>{
        const updatedData = { ...data, Status: newStatus };
        setData(updatedData);
      }); 

      return () => {
          socket.off("joinRoom");
      };
  }, [socket, data]); 

  // listen on new room message
  useEffect(()=>{
    if(!socket) return;

    socket.on("newRoomMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update chat
      if(newMessage.SenderId.Role==='admin'){
        const newAdminNames = [...adminNames, newMessage.SenderId.FullName];
        setAdminNames([...new Set(newAdminNames)]);
      }
    });

    return () => {
      socket.off("newRoomMessage"); // Cleanup on unmount
    };
  }, [socket])

  // sending message
  const handleSend = async(e) => {
    setMsgLoading(true);
    e.preventDefault();
    axios.defaults.withCredentials =true

    let newMessage = {
        ticketId: data._id,
        compTypeId: data.CompTypeId,
        subject: subject || "No Subject",
        message: message
    }

    try {
        if(imageUploaded){
            const linkRes = await uploadImage(imageUploaded);
            newMessage = {
                ...newMessage,
                imageUrl: linkRes
            };
        }

        const response = await axios.post(backendUrl + 'api/message/sendParticipantAdminMessage', {request: newMessage});
        if(response.data.success) {
            fetchMessages()
            setSubject("");
            setMessage("");
            setImageUploaded(null);
            setImageName("");

            if(data.Status === 'Resolved' && user.role === 'participant'){
              await openStatusInProgress();
            }
        } 

    } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Send message failed");
        console.error(error)
    }    
    setMsgLoading(false);
  };


  // go to previous page based on their role
  const handlePreviousLink=(e)=>{
    e.preventDefault();
    if(user.role==='participant')navigate('/userhelp');
    else navigate('/adminticketdetails', { state: { data: data, user: user } });
  }

  // open the status when the user chats after in resolved ticket
  const openStatusInProgress = async(e) =>{
    const systemMessage = {
      ticketId: data._id,
      compTypeId: data.CompTypeId,
      subject: "Ticket Status Updated",
      message: `The ticket status has been changed to in progress.`,
    };

    // send system message that the ticket status has been updated
    const response = await axios.post(backendUrl + 'api/message/sendParticipantSystemMessage', {request: systemMessage});    
    if(response.data.success) {
        fetchMessages()   
    } else {
        toast.error(response.data.message);
    }

    // update ticket status
    const response2 = await axios.put(backendUrl + 'api/ticket/updateTicketStatus', {request: {ticketId: data._id, status: 'In Progress'}});    
    if(response2.data.success) {
        toast.success(response2.data.message);
        const updatedData = { ...data, Status: 'In Progress' };
        setData(updatedData);

        socket.emit("sendUpdatedStatus", {roomId: data._id, stat:'In Progress'});
        navigate(location.pathname, { state: { data: updatedData, user } });

    } else {
        toast.error(response2.data.message);
    }
  }

  // click resolve or close 
  const handleClickResolveClose=async(e)=>{
    if((data.Status==='Resolved' && user.role==='admin') || data.Status==='Closed') return;

    const up = user.role === 'admin' ? 'Resolved' : 'Closed';

    const systemMessage = {
      ticketId: data._id,
      compTypeId: data.CompTypeId,
      subject: "Ticket Status Updated",
      message: `The ticket status has been changed to ${up.toLowerCase()}.`,
    };

    // send system message that the ticket status has been updated
    const response = await axios.post(backendUrl + 'api/message/sendParticipantSystemMessage', {request: systemMessage});    
    if(response.data.success) {
        fetchMessages()   
    } else {
        toast.error(response.data.message);
    }

    // update ticket status in database
    const response2 = await axios.put(backendUrl + 'api/ticket/updateTicketStatus', {request: {ticketId: data._id, status: up}});    
    if(response2.data.success) {
        toast.success(response2.data.message);
        const updatedData = { ...data, Status: up };
        setData(updatedData);
        if(up==='Closed'){
          setIsOpen(true);
        }
        socket.emit("sendUpdatedStatus", {roomId: data._id, stat:up});
        navigate(location.pathname, { state: { data: updatedData, user } });

    } else {
        toast.error(response2.data.message);
    }
  }

  // fetch messages of admin and participants
  const fetchMessages = async()=>{
    try {
      const response = await axios.get(`${backendUrl}api/message/getParticipantAdminMessage?ticketId=${data._id}`);
      const latestMessages = response.data.adminUserChat; 

      if (latestMessages.length > 0) {
          const lastMessage = latestMessages[latestMessages.length - 1]; 
          socket.emit("sendRoomMessage", { roomId: data._id, message: lastMessage });

          if(data.Status === 'Open' && lastMessage.SenderId.Role ==='admin'){
            await openStatusInProgress();
          }
      }   

    } catch (error) {
      console.error(error)
    }
  }

  // fetch data of competitions, users, messages, and ratings
  const fetchData = async () => {
    if (!data || !data.CompTypeId || !data.SenderId) return; // Ensure valid data
  
    const needsFetching = !data.compData || !data.senderData || messages.length === 0;
    if (!needsFetching) return; // Skip if all data is available
    if(fetchNum>=5) return;
  
    try {
      setFetchNum(fetchNum+1);
      
      const [compResponse, senderResponse, messageResponse, ratingResponse] = await Promise.all([
        axios.get(`${backendUrl}api/competition/getCompetitionDetails?compId=${data.CompTypeId}`),
        axios.get(`${backendUrl}api/user/fetchUserDetails?userId=${data.SenderId}`),
        axios.get(`${backendUrl}api/message/getParticipantAdminMessage?ticketId=${data._id}`),
        axios.get(`${backendUrl}api/ticket/getRatingTicket?ticketId=${data._id}`)
      ]);
  
      setData(prev => ({
        ...prev,
        compData: compResponse.data.success ? compResponse.data.comp : null,
        senderData: senderResponse.data.success ? senderResponse.data.userData : null
      }));

      setMessages(messageResponse.data.adminUserChat || []);
      const admins = messageResponse.data.adminUserChat.filter(msg => msg.SenderId && msg.SenderId.Role === "admin").map(msg => msg.SenderId.FullName); 
      setAdminNames([...new Set(admins)]);

      if(ratingResponse.data.rating){
        setIsDone(true);
        setRatingResult(ratingResponse.data.rating);
      }

      setIsLoading(false);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  // open rating popup 
  const handleOpenSurvey = async()=>{
    if(data.Status !== 'Closed') return;

    try {
      const response = await axios.get(`${backendUrl}api/ticket/getRatingTicket?ticketId=${data._id}`);
      const rating = response.data.rating;

      if(rating){
        setIsDone(true);
        setRatingResult(rating);
      }
      setIsOpen(true);

    } catch (error) {
      console.error(error)
    }
  }
  

  useEffect(() => {
    if (!data && location.state?.data && location.state?.user) {
      setUser(location.state.user);
      setData(location.state.data);
    }
  }, [location.state?.data, location.state?.user]);
  

  useEffect(()=>{
    if(data){
      fetchData();
      setIsLoading(false);
    }
  },[data])

  useEffect(() => {
      if (data) {
          fetchData(); // Fetch latest data whenever data changes
      }
  }, [data?.Status]); // Watch for status changes



  return (
    <div>
      {isLoading && <p className="mt-96 text-center text-lg text-gray-600">Loading...</p>}

    {!isLoading &&
    <div className="mt-25 ml-4 mr-8 md:ml-20 ">
      <div className="flex place-self-center items-center justify-between w-11/12">
        {/* Back Button (Left) */}
        <button className="bg-white text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
          onClick={handlePreviousLink} >
            <FontAwesomeIcon icon={faChevronLeft} />
        </button>
  
        {/* rating button */}
        <div className="flex gap-4 md:gap-6">
          {user.role==='participant' &&
          <button className={`${data.Status==='Closed'? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-red-300 cursor-not-allowed'} text-white shadow-md  w-10 h-10 flex items-center justify-center rounded-full `}
              onClick={handleOpenSurvey} data-testid='icon-file-pen'>
                <FontAwesomeIcon icon={faFilePen} />   
            </button>
          }

          {/* status Button (Right) */}
          <button 
            className={`text-white shadow-md font-poppins font-semibold px-3 py-2 flex items-center justify-center rounded-md 
              ${user.role === 'admin' ? 'bg-sky-400 ' : 'bg-green-500 '}
              ${user.role==='admin' && data.Status!=='Resolved' && data.Status !=='Closed' && 'hover:bg-sky-500'}
              ${user.role==='participant' && data.Status !=='Closed' && 'hover:bg-green-600'}
              ${data.Status === 'Closed' || (user.role === 'admin' && data.Status === 'Resolved') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={handleClickResolveClose}
            disabled={data.Status === 'Closed' || (user.role === 'admin' && data.Status === 'Resolved')}
          >
            <FontAwesomeIcon className="text-lg font-black" icon={faCheck} /> &ensp;  
            {user.role === 'admin' ? 'Resolve' : 'Close'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mt-2 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-4 flex flex-col md:flex-row justify-between">
        {/* white headers */}
        <div>
          <h2 className="text-xl text-gray-500 font-kanit font-semibold">SUBJECT</h2>
          <p className="font-poppins text-md  break-all"> {data.Subject} </p>
          <h2 className="text-xl mt-5 text-gray-500 font-kanit font-semibold">DESCRIPTION</h2>
          <p className="font-poppins text-md break-all">
            {data.Description}
          </p>
          <div className="mt-5 text-sm font-poppins leading-7 text-gray-500">
            <p><strong>Competition type:</strong> {data.compData?.Name || "Loading..."}</p>
            <p><strong>Created at:</strong> {data.CreatedAt? convertToTimeZone(data.CreatedAt) : "Loading..."}</p>
            <p><strong>Updated at:</strong> {data.UpdatedAt? convertToTimeZone(data.UpdatedAt) : "Loading..."} </p>
            <p><strong>Sender:</strong> {data.senderData?.name || "Loading..."} </p>
            <p><strong>Handled by:</strong> {adminNames.join(", ") } </p>

            <p><strong>Image:</strong> {data.Image? <a href={data.Image} className="text-gray-500 hover:text-gray-900 underline font-poppins" target="_blank">Click here</a> : 'None'} </p>
          </div>

        </div>
    
        <div className="flex flex-col items-start md:items-end mt-8 md:mt-0">
          <div className={`font-poppins border-2  py-0.5 px-3 text-md  font-medium  
            ${data.Status === 'Open' ? 'border-red-400 text-red-500' :
              data.Status === 'Closed' ? 'border-lime-500 text-lime-600' :
              data.Status === 'In Progress' ? 'border-amber-500 text-amber-600' :
              'border-sky-400 text-sky-500' // Resolved
              }`}>
            {data.Status}</div>
          <div className="flex items-center mt-2 mr-3 font-poppins">
            <div className={`inline-flex mr-2 w-2.5 h-2.5  
              ${data.PriorityType === 'Urgent' ? 'bg-red-600' :
                data.PriorityType === 'Low' ? 'bg-green-500' :
                data.PriorityType === 'High' ? 'bg-amber-600' :
                'bg-yellow-400' // medium
                }`}></div>{data.PriorityType} 
          </div>
        </div>
      </div>

    </div>
    

    {/* chat with user */}
    <div className='m-auto max-w-10/12 p-4 mt-10'>
      <div className="pr-8 max-h-[60vh] md:max-h-[70vh] overflow-y-scroll chat-container">
            {messages.map((msg, index) => (
                <ChatBox msg={msg} index={index} user={user} key={index} page={"ticketdetails"}/>
            ))}
            {/* This empty div will be used as the scroll target */}
            <div ref={messagesEndRef}></div>
        </div>

      {/* message section */}
      {data.Status === 'Closed' && 
        <div className="mb-8 mt-8 font-poppins">
          <Card className={'bg-gray-400'}>
            <CardContent className={'font-bold text-center text-white'}>Ticket is already closed</CardContent>
          </Card>
        </div>
      }

      <Card className={`${data.Status==='Closed' && 'hidden'} max-w-6xl mt-6 py-8 mb-8 mx-auto font-poppins`}>
      <form onSubmit={handleSend}>
        <CardContent>
            <input
              type="text"
              placeholder="Add a subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow mb-6"
            />
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-5 min-h-56 max-h-56 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
            ></textarea>

            {/* upload image button */}
            <div className="flex flex-col sm:flex-row items-start justify-between w-full space-y-5 sm:space-y-0">
              <UploadImage 
                className="max-w-[80%]" 
                image={imageUploaded} 
                setImage={setImageUploaded} 
                imageName={imageName} 
                setImageName={setImageName} 
                inputId={'image-upload'}
              />
              
              {/* submit button */}
              <Button 
                type='submit'
                className={`${msgLoading? 'cursor-not-allowed': 'cursor-pointer'} px-6 py-5 text-md bg-white text-slate-500 border shadow-md border-slate-300 hover:bg-gray-100 sm:ml-4`}
              >
                {msgLoading? 
                <svg className="animate-spin h-6 w-6 text-slate-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                : <> Send <FontAwesomeIcon icon={faPaperPlane} /> </> }
              </Button>
            </div>
        </CardContent>
        </form>
      </Card>  

      { isOpen && 
            <RatingPopup ticket={data} isOpen={isOpen} onClose={() => {
                setIsOpen(false);
                }} isDone={isDone} ratingResult={ratingResult}></RatingPopup>
            }
      
    </div>




    </div>

            }
    </div>
  );
};

export default TicketDetails;
