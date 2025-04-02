import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faCheck, faChevronLeft, faClipboardCheck, faImage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/Chatbox";
import UploadImage from "@/components/UploadImage";

const TicketDetails = () => {
  const [messages, setMessages] = useState([
    {
      subject: "Response to Website Down",
      message:
        "Hello A. Thank you for the information. We will investigate and inform you soon for the latest info.",
      timestamp: "2025-02-21 11:00",
      status: "in-progress",
      sender: "ellis",
      image:"",
    },
    {
      subject: "Resolve for Website Down",
      message:
        "Hello A. We have fixed our issue. You can try the competition page again. Do not hesitate if you have any problem. Thank you. pneumonoultramicroscopicsilicovolcanoconiosis aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa asdh uwq 8i2ydshuwuhfde ",
      timestamp: "2025-02-21 11:31",
      status: "resolved",
      sender: "ellis",
      image:"",
    },
    {
      subject: "Thank you",
      message: "Thank you.",
      timestamp: "2025-02-21 11:35",
      status: "closed",
      sender: "John Doe",
      image:"",
    },
  ]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageUploaded, setImageUploaded] =useState(null);
  const [imageName, setImageName] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const shortenFileName = (name) => {
    const maxLength = 50; // Adjust the length as needed
    const ext = name.split(".").pop(); // Get file extension
    const baseName = name.substring(0, name.lastIndexOf(".")); // Remove extension

    if (baseName.length > maxLength) {
        return `${baseName.substring(0, 20)}...${baseName.slice(-4)}.${ext}`;
    }
    return name;
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUploaded(reader.result);
        setImageName(shortenFileName(file.name)); // Shorten filename
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim() && !imageUploaded) return; // Prevent sending empty messages

    const newMessage = {
      subject: subject || "No Subject",
      message: message,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "), // Format: YYYY-MM-DD HH:mm
      status: "sent",
      sender: user.name,
      image: imageUploaded
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Clear input fields
    setSubject("");
    setMessage("");
    setImageUploaded(null);
    setImageName("");
  };

  const handlePreviousLink=(e)=>{
    e.preventDefault();
    if(user.role==='participant')navigate('/userhelp');
    else navigate('/adminticketdetails', { state: { data: data, user: user } });
  }

  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [user, setUser] =useState(null);

  const handleClickResolveClose=(e)=>{
    e.preventDefault();

    if(data.status==='Resolved' || data.status==='Closed') return;

    const up = user.role === 'admin' ? 'Resolved' : 'Closed';
        setData(prevData => ({
            ...prevData,
            status: up
    }));

    const systemMessage = {
      subject: "Ticket Status Updated",
      message: `The ticket status has been changed to ${up.toLowerCase()}.`,
      timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "system",
      sender: "System",
    };
  
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  }

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
          onClick={handlePreviousLink} >
            <FontAwesomeIcon icon={faChevronLeft} />
        </button>
  
        {/* Message Button (Right) */}
        <button className={`text-white shadow-md font-poppins font-semibold px-3 py-2 flex items-center justify-center rounded-md hover:cursor-pointer 
         ${user.role==='admin'? 'bg-sky-400 hover:bg-sky-500': 'bg-green-500 hover:bg-green-600'}`}
          onClick={handleClickResolveClose}>
            <FontAwesomeIcon className="text-lg font-black" icon={faCheck} /> &ensp;  
            {user.role==='admin'? 'Resolve' : 'Close' }
        </button>
      </div>


      <div className="max-w-6xl mt-2 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-4 flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-xl text-gray-500 font-kanit font-semibold">SUBJECT</h2>
          <p className="font-poppins text-md  break-all"> {data.subject} </p>
          <h2 className="text-xl mt-5 text-gray-500 font-kanit font-semibold">DESCRIPTION</h2>
          <p className="font-poppins text-md max-w-10/12  break-all">
            test description
          </p>
          <div className="mt-5 text-sm font-poppins leading-7 text-gray-500">
            <p><strong>Competition type:</strong> {data.comp_type}</p>
            <p><strong>Created at:</strong> {data.created_at}</p>
            <p><strong>Updated at:</strong> {data.updated_at}</p>
            <p><strong>Sender:</strong> albertsantoso@gmail.com</p>
            <p><strong>Handled by:</strong> Ella, Ellis, Rafael</p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end mt-8 md:mt-0">
          <div className={`font-poppins border-2  py-0.5 px-3 text-md  font-medium  
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
    

    {/* chat dengan user */}
    <div className='m-auto max-w-10/12 p-4 mt-10'>
      <div className="pr-8 min-h-[60vh] max-h-[60vh] md:max-h-[70vh] md:min-h-[70vh] overflow-y-scroll chat-container">
            {messages.map((msg, index) => (
                <ChatBox msg={msg} index={index} role={user.name} key={index} />
            ))}
            {/* This empty div will be used as the scroll target */}
            <div ref={messagesEndRef}></div>
        </div>


      <Card className="max-w-6xl mt-6 py-8 mb-8 mx-auto font-poppins">
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

export default TicketDetails;
