import React, { useContext, useEffect, useRef, useState } from "react";
import { useHref, useLocation, useNavigate } from "react-router-dom";
import { faCheck, faChevronLeft, faClipboardCheck, faFileCircleCheck, faFilePen, faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/Chatbox";
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
  const {backendUrl, socket, initializeSocket} = useContext(AppContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [ratingResult, setRatingResult] = useState(null);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
      if (!user || !user.id) return; // Ensure user data is available

      if (!socket) {
          console.log("🔄 Initializing socket...");
          initializeSocket(user.id);
      }
  }, [user, socket]); // Run when userData or socket changes

  useEffect(() => {
      if (!data || !data._id || !socket) return;

      console.log("🔄 Joining Room:", data._id);
      socket.emit("joinRoom", data._id);

      return () => {
          console.log("⚠️ Leaving Room:", data._id);
          socket.off("joinRoom");
      };
  }, [socket, data]); // Run when socket or data changes


  useEffect(()=>{
    if(!socket) return;

    socket.on("newRoomMessage", (newMessage) => {
      console.log("ada new room message")
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
  


  const handleSend = async(e) => {
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
            const imageFormData = new FormData();
            imageFormData.append('file', imageUploaded); 

            // 2. Upload image first
            const { data: uploadData } = await axios.post(
                backendUrl + 'api/image/upload', 
                imageFormData, 
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            ).catch(error => {
                // Handle image upload failure
                console.error("Image upload error:", error);
                toast.error("Image upload failed. Please try again.");
                throw error; // Stop execution if image upload fails
            });

            newMessage = {
                ...newMessage,
                imageUrl: uploadData.imageUrl
            };
        }

        const { data } = await axios.post(backendUrl + 'api/message/sendParticipantAdminMessage', {request: newMessage});
        
        if(data.success) {
            fetchMessages()
            setSubject("");
            setMessage("");
            setImageUploaded(null);
            setImageName("");
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        console.error(error)
    }    
  };

  const handlePreviousLink=(e)=>{
    e.preventDefault();
    if(user.role==='participant')navigate('/userhelp');
    else navigate('/adminticketdetails', { state: { data: data, user: user } });
  }

  const handleClickResolveClose=async(e)=>{
    if((data.Status==='Resolved' && user.role==='admin') || data.Status==='Closed') return;

    const up = user.role === 'admin' ? 'Resolved' : 'Closed';

    const systemMessage = {
      ticketId: data._id,
      compTypeId: data.CompTypeId,
      subject: "Ticket Status Updated",
      message: `The ticket status has been changed to ${up.toLowerCase()}.`,
    };

    const response = await axios.post(backendUrl + 'api/message/sendParticipantSystemMessage', {request: systemMessage});    
    if(response.data.success) {
        fetchMessages()   
    } else {
        toast.error(response.data.message);
    }

    const response2 = await axios.put(backendUrl + 'api/ticket/updateTicketStatus', {request: {ticketId: data._id, status: up}});    
    if(response2.data.success) {
        toast.success(response2.data.message);
        const updatedData = { ...data, Status: up };
        setData(updatedData);
        if(up==='Closed'){
          setIsOpen(true);
        }
        navigate(location.pathname, { state: { data: updatedData, user } });

    } else {
        toast.error(response2.data.message);
    }
  }

  const fetchMessages = async()=>{
    try {
      const response = await axios.get(`${backendUrl}api/message/getParticipantAdminMessage?ticketId=${data._id}`);
      const latestMessages = response.data.adminUserChat; 
      // setMessages(latestMessages);

      if (latestMessages.length > 0) {
          const lastMessage = latestMessages[latestMessages.length - 1]; 
          socket.emit("sendRoomMessage", { roomId: data._id, message: lastMessage });
      }   

    } catch (error) {
      console.error(error)
    }
  }

  const fetchData = async () => {
    if (!data || !data.CompTypeId || !data.SenderId) return; // Ensure valid data
  
    const needsFetching = !data.compData || !data.senderData || messages.length === 0;
    if (!needsFetching) return; // Skip if all data is available
    if(fetchNum>=5) return;
  
    try {
      console.log("Fetching data...");
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

      console.log("fecthed data:")
      console.log(data)

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
      console.log(data)
      fetchData();
      setIsLoading(false);
      console.log(messages)
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
  
        
        <div className="flex gap-4 md:gap-6">
          {user.role==='participant' &&
          <button className={`${data.Status==='Closed'? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-red-300 cursor-not-allowed'} text-white shadow-md  w-10 h-10 flex items-center justify-center rounded-full `}
              onClick={handleOpenSurvey}>
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
        <div>
          <h2 className="text-xl text-gray-500 font-kanit font-semibold">SUBJECT</h2>
          <p className="font-poppins text-md  break-all"> {data.Subject} </p>
          <h2 className="text-xl mt-5 text-gray-500 font-kanit font-semibold">DESCRIPTION</h2>
          <p className="font-poppins text-md break-all">
            {data.Description}
          </p>
          <div className="mt-5 text-sm font-poppins leading-7 text-gray-500">
            <p><strong>Competition type:</strong> {data.compData?.Name || "Loading..."}</p>
            <p><strong>Created at:</strong> {convertToTimeZone(data.CreatedAt)}</p>
            <p><strong>Updated at:</strong> test</p>
            <p><strong>Sender:</strong> {data.senderData?.name || "Loading..."} </p>
            <p><strong>Handled by:</strong> {adminNames.join(", ")} </p>
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
    

    {/* chat dengan user */}
    <div className='m-auto max-w-10/12 p-4 mt-10'>
      <div className="pr-8 max-h-[60vh] md:max-h-[70vh] overflow-y-scroll chat-container">
            {messages.map((msg, index) => (
                <ChatBox msg={msg} index={index} user={user} key={index} adminPage={false}/>
            ))}
            {/* This empty div will be used as the scroll target */}
            <div ref={messagesEndRef}></div>
        </div>


      <Card className="max-w-6xl mt-6 py-8 mb-8 mx-auto font-poppins">
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
                className="px-6 py-5 text-md bg-white text-slate-500 border shadow-md border-slate-300 hover:bg-gray-100 cursor-pointer sm:ml-4"
              >
                Send <FontAwesomeIcon icon={faPaperPlane} />
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
