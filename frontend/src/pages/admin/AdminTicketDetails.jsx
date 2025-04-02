import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faChevronLeft, faImage, faMessage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/Chatbox";
import UploadImage from "@/components/UploadImage";

const AdminTicketDetails = () => {
    const nameskrg = "ellis";

  const [messages, setMessages] = useState([
    {
      subject: "ella",
      message:
        "i think we have to check the server",
      timestamp: "2025-02-21 11:00",
      sender: "ella",
      image:'',
    },
    {
    subject: "ellis",
    message:
        "Ok, gotta check it now.",
    timestamp: "2025-02-21 11:00",
    sender: "ellis",
    image:'',
    },
    {
    subject: "rafael",
    message:
        "ok, do i need to help with anything?",
    timestamp: "2025-02-21 11:01",
    sender: "rafael",
    image:'',
    },
  ]);

  const [message, setMessage] = useState("");
  const [imageUploaded, setImageUploaded] =useState(null);
  const [imageName, setImageName] = useState("");

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim() && !imageUploaded) return; // Prevent sending empty messages

    const newMessage = {
      subject: user.name,
      message: message,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), // Format: YYYY-MM-DD HH:mm
      sender: user.name,
      image: imageUploaded,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    setMessage("");
    setImageUploaded(null);
    setImageName("");
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [user, setUser] =useState(null);

  useEffect(() => {
        if (location.state?.data && location.state?.user) {
            setData(location.state.data);
            setUser(location.state.user);
        }
    }, [location.state?.data, location.state?.user]);

  if (!data) {
      return <p className="text-center text-lg text-gray-600">Loading...</p>;
  }


  return (
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



      <div className="max-w-6xl mt-2 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-4 flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-xl text-gray-500 font-kanit font-semibold">SUBJECT</h2>
          <p className="font-poppins text-md"> {data.subject} </p>
          <h2 className="text-xl mt-5 text-gray-500 font-kanit font-semibold">DESCRIPTION</h2>
          <p className="font-poppins text-md">
            test description
          </p>
          <div className="mt-5 text-sm font-poppins leading-6 text-gray-500">
            <p><strong>Competition type:</strong> {data.comp_type}</p>
            <p><strong>Created at:</strong> {data.created_at}</p>
            <p><strong>Updated at:</strong> {data.updated_at}</p>
            <p><strong>Sender:</strong> albertsantoso@gmail.com</p>
            <p><strong>Handled by:</strong> Ella, Ellis, Rafael</p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end mt-8 md:mt-0">
          <div className={`font-poppins border-2  w-min py-0.5 px-3 text-md  font-medium  
            ${data.status === 'Open' ? 'border-red-400 text-red-500' :
              data.status === 'Closed' ? 'border-lime-500 text-lime-600' :
              data.status === 'In Progress' ? 'border-amber-500 text-amber-600' :
              'border-sky-400 text-sky-500' // Resolved
              }`}>
            {data.status}</div>
          <div className="flex items-center mt-2 mr-3 font-poppins">
            <div className={`inline-flex mr-2 w-2.5 h-2.5 
              ${data.priority === 'Urgent' ? 'bg-red-600' :
                data.priority === 'Low' ? 'bg-green-500' :
                data.priority === 'High' ? 'bg-amber-600' :
                'bg-yellow-400' // medium
                }`}></div>{data.priority} 
          </div>
        </div>
      </div>

    </div>
    
    {/* chat sesama admin */}
    <div className='m-auto border border-black max-w-9/12 p-4 mt-10'>

        <div className="pr-8 min-h-[60vh] max-h-[60vh] md:max-h-[70vh] md:min-h-[70vh] overflow-y-scroll chat-container">
            {messages.map((msg, index) => (
                <ChatBox msg={msg} index={index} role={nameskrg} key={index} />
            ))}
            {/* This empty div will be used as the scroll target */}
            <div ref={messagesEndRef}></div>
        </div>
        


        <Card className="max-w-6xl mt-6 py-8 mb-8 mx-auto font-poppins">
        <CardContent>
            <input
                type="text"
                placeholder="Type your message"
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
                onClick={handleSend} 
                className="px-6 py-5 text-md bg-white text-slate-500 border shadow-md border-slate-300 hover:bg-gray-100 cursor-pointer sm:ml-4"
              >
                Send <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
            </div>

    
            
        </CardContent>
        </Card>
    </div>

      
      




    </div>
    
  );
};

export default AdminTicketDetails;
