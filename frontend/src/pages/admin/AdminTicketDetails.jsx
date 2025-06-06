import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faChevronLeft, faMessage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/ChatBox";
import UploadImage from "@/components/UploadImage";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "@/context/AppContext";
import { convertToTimeZone } from "@/lib/utils";

const AdminTicketDetails = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [imageUploaded, setImageUploaded] =useState(null);
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [user, setUser] =useState(null);
  const [fetchNum, setFetchNum] = useState(0);
  const {backendUrl, socket,initializeSocket, uploadImage} = useContext(AppContent);
  const [isLoading, setIsLoading] =useState(true);
  const [msgLoading, setMsgLoading] = useState(false);

  // ensure the latest message into view
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
        if (!user || !user.id) return; // Ensure user data is available
  
        if (!socket) {
            initializeSocket(user.id);
        }
    }, [user, socket]); // Run when userData or socket changes
  

    // joining the admin room
    useEffect(() => {
        if (!data || !data._id || !socket) return;
  
        socket.emit("joinAdminRoom", "admin"+data._id);
  
        return () => {
            socket.off("joinAdminRoom");
        };
    }, [socket, data]); // Run when socket or data changes
  
  
    // listening for new admin room message
    useEffect(()=>{
      if(!socket) return;
  
      socket.on("newAdminRoomMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Update chat
      });
  
      return () => {
        socket.off("newAdminRoomMessage"); // Cleanup on unmount
      };
    }, [socket])


  // sending message
  const handleSend = async (e) => {
    setMsgLoading(true);
    e.preventDefault();
    axios.defaults.withCredentials = true;

    let newMessage = {
        ticketId: data._id,
        message: message
    };

    try {
        if (imageUploaded) {
            const linkResult = await uploadImage(imageUploaded);
            if(linkResult){
                newMessage = {
                    ...newMessage,
                    imageUrl: linkResult
                };
            }
        }

        const { data } = await axios.post(backendUrl + 'api/message/sendAdminCollabMessage', { request: newMessage });

        if (data.success) {
            await fetchMessagesWithAdminNames(); // Ensure admin names are fetched
            setMessage("");
            setImageUploaded(null);
            setImageName("");
        } 
    } catch (error) {
        console.error("Message send error:", error);
        toast.error(error.response?.data?.message || error.message || "Send message failed");
    }
    setMsgLoading(false);
};

// Fetch messages and attach admin names
const fetchMessagesWithAdminNames = async () => {
    try {
        const response = await axios.get(`${backendUrl}api/message/getAdminCollabMessage?ticketId=${data._id}`);
        const messages = response.data.adminCollabChat || [];

        // Fetch admin names for all messages
        const messagesWithAdminNames = await Promise.all(
            messages.map(async (msg) => {
                try {
                    const adminResponse = await axios.get(`${backendUrl}api/user/fetchUserDetails?userId=${msg.AdminId}`);
                    return { ...msg, AdminName: adminResponse.data.userData?.name || "Unknown" };
                } catch (error) {
                    console.error(`Error fetching admin name for AdminId ${msg.AdminId}:`, error);
                    return { ...msg, AdminName: "Unknown" };
                }
            })
        );

        if (messagesWithAdminNames.length > 0) {
            const lastMessage = messagesWithAdminNames[messagesWithAdminNames.length - 1]; 
            socket.emit("sendAdminRoomMessage", { roomId: "admin"+data._id, message: lastMessage });
        }   

    } catch (error) {
        console.error("Error fetching messages:", error);
    }
};


  // fetching data for competitions, users, and tickets
  const fetchData = async () => {
    if (!data || !data.CompTypeId || !data.SenderId) return; // Ensure valid data
  
    const needsFetching = !data.compData || !data.senderData || messages.length === 0;
    if (!needsFetching) return; // Skip if all data is available
    if(fetchNum>=5) return;
  
    try {
      setFetchNum(fetchNum+1);
      
      const [compResponse, senderResponse, messageResponse] = await Promise.all([
        axios.get(`${backendUrl}api/competition/getCompetitionDetails?compId=${data.CompTypeId}`),
        axios.get(`${backendUrl}api/user/fetchUserDetails?userId=${data.SenderId}`),
        axios.get(`${backendUrl}api/message/getAdminCollabMessage?ticketId=${data._id}`)
      ]);
  
      setData(prev => ({
        ...prev,
        compData: compResponse.data.success ? compResponse.data.comp : null,
        senderData: senderResponse.data.success ? senderResponse.data.userData : null
      }));
      
      const messagesWithAdminNames = await Promise.all(
        (messageResponse.data.adminCollabChat || []).map(async (msg) => {
          try {
            const response = await axios.get(`${backendUrl}api/user/fetchUserDetails?userId=${msg.AdminId}`);
            return { ...msg, AdminName: response.data.userData?.name || "Unknown" }; // Handle missing names
          } catch (error) {
            console.error(`Error fetching admin name for AdminId ${msg.AdminId}:`, error);
            return { ...msg, AdminName: "Unknown" };
          }
        })
      );
      
      setMessages(messagesWithAdminNames);
      setIsLoading(false);
  
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
        if (location.state?.data && location.state?.user) {
            setUser(location.state.user);
            setData(location.state.data);
        }
    }, [location.state?.data, location.state?.user]);
  
  useEffect(()=>{
    if(data){
      fetchData();
      setIsLoading(false);
    }
  }, [data])

  
  return (
    <div>
      {isLoading && <p className="mt-96 text-center text-lg text-gray-600">Loading...</p>}

    {!isLoading &&
    <div className="mt-25 ml-4 mr-8 md:ml-20 ">
    
    <div className="flex place-self-center items-center justify-between w-11/12">
      {/* Back Button (Left) */}
      <button className="bg-white text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
        onClick={() => navigate('/adminticket')} >
          <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* Message Button (Right) */}
      <button className="color-component-red text-white shadow-md  w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer "
        onClick={() => navigate(`/userticketdetails`, { state: { data: data, user: user } })}>
           <FontAwesomeIcon icon={faMessage} />
      </button>
    </div>

      {/* white header */}
      <div className="max-w-6xl mt-2 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-4 flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-xl text-gray-500 font-kanit font-semibold">SUBJECT</h2>
          <p className="font-poppins text-md"> {data.Subject} </p>
          <h2 className="text-xl mt-5 text-gray-500 font-kanit font-semibold">DESCRIPTION</h2>
          <p className="font-poppins text-md">
            test description
          </p>
          <div className="mt-5 text-sm font-poppins leading-6 text-gray-500">
            <p><strong>Competition type:</strong> {data.compData?.Name || "Loading..."}</p>
            <p><strong>Created at:</strong> {convertToTimeZone(data.CreatedAt)}</p>
            <p><strong>Updated at:</strong> {convertToTimeZone(data.UpdatedAt)}</p>
            <p><strong>Sender:</strong> {data.senderData?.name || "Loading..."}</p>
            {/* <p><strong>Handled by:</strong> Ella, Ellis, Rafael</p> */}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end mt-8 md:mt-0">
          <div className={`font-poppins border-2  w-min py-0.5 px-3 text-md  font-medium  
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
    
    {/* admin chat */}
    <div className='m-auto mb-8 border border-black max-w-9/12 p-4 mt-10'>

        <div className="pr-8 min-h-[60vh] max-h-[60vh] md:max-h-[70vh] md:min-h-[70vh] overflow-y-scroll chat-container">
            {messages.map((msg, index) => (
                <ChatBox msg={msg} index={index} user={user} key={index} page={"adminticketdetails"}/>
            ))}
            {/* This empty div will be used as the scroll target */}
            <div ref={messagesEndRef}></div>
        </div>
  
        {/* message input and buttons */}
        <Card className="max-w-6xl mt-6 py-8 mb-8 mx-auto font-poppins">
          <form onSubmit={handleSend}>
        <CardContent>
            <input
                type="text"
                placeholder="Type your message"
                data-testid='message-input'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow mb-6"
            />

            <div className="flex flex-col sm:flex-row items-start justify-between w-full space-y-5 sm:space-y-0">
              <UploadImage 
                className="max-w-[80%]" 
                image={imageUploaded} 
                setImage={setImageUploaded} 
                imageName={imageName} 
                setImageName={setImageName} 
                inputId={'image-upload'}
              />
              
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
    </div>

    </div>
    }
    </div>
  );
};

export default AdminTicketDetails;
