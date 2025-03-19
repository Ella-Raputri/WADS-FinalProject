import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { faChevronLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/Chatbox";

const TicketDetails = () => {
  const [messages, setMessages] = useState([
    {
      subject: "Response to Website Down",
      message:
        "Hello A. Thank you for the information. We will investigate and inform you soon for the latest info.",
      timestamp: "2025-02-21 11:00",
      status: "in-progress",
      sender: "admin",
    },
    {
      subject: "Resolve for Website Down",
      message:
        "Hello A. We have fixed our issue. You can try the competition page again. Do not hesitate if you have any problem. Thank you. pneumonoultramicroscopicsilicovolcanoconiosis aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa asdh uwq 8i2ydshuwuhfde ",
      timestamp: "2025-02-21 11:31",
      status: "resolved",
      sender: "admin",
    },
    {
      subject: "Thank you",
      message: "Thank you.",
      timestamp: "2025-02-21 11:35",
      status: "closed",
      sender: "user",
    },
  ]);

  const navigate = useNavigate();


  return (
    <div className="mt-25 ml-4 mr-8 md:ml-20 ">
      <div className='flex'>
          <button className="bg-white text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
          onClick={() => navigate('/userhelp')}>
              <FontAwesomeIcon icon={faChevronLeft} />
          </button>
      </div>


      <div className="max-w-6xl mt-2 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-4 flex flex-col md:flex-row justify-between">
        <div>
          <h2 className="text-xl text-gray-500 font-kanit font-semibold">SUBJECT</h2>
          <p className="font-poppins text-md">Website is down</p>
          <h2 className="text-xl mt-5 text-gray-500 font-kanit font-semibold">DESCRIPTION</h2>
          <p className="font-poppins text-md">
            Hello my name is A. Today when I access the website, the website is
            automatically down on my laptop...
          </p>
          <div className="mt-5 text-sm font-poppins leading-6 text-gray-500">
            <p><strong>Created at:</strong> 2025-02-20 23:59</p>
            <p><strong>Updated at:</strong> 2025-02-20 23:59</p>
            <p><strong>Sender:</strong> albertsantoso@gmail.com</p>
            <p><strong>Handled by:</strong> Ella, Ellis, Rafael</p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end mt-8 md:mt-0">
          <div className="bg-red-400 font-poppins w-min p-0.5 px-8 text-sm text-white font-semibold rounded-2xl">Open</div>
          <div className="flex items-center mt-2 mr-5">
            <div className="font-poppins inline-flex mr-2 w-2.5 h-2.5 bg-red-600"></div>Urgent 
          </div>
        </div>
      </div>

    </div>

    {messages.map((msg, index) => (
        <ChatBox msg={msg} index={index} role={"user"}></ChatBox>
      ))}


    <Card className="max-w-6xl mt-6 py-8 mb-8 mx-auto font-poppins">
      <CardContent>
          <input
            type="text"
            placeholder="Add a Subject"
            className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow mb-6"
          />
          <textarea
            placeholder="Type your message here..."
            className="w-full mb-5 min-h-56 max-h-56 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
          ></textarea>

        <div className="flex justify-end">
          <Button className="px-6 py-5 text-md bg-white text-slate-500 border shadow-md border-slate-300 hover:bg-gray-100 cursor-pointer">Send <FontAwesomeIcon icon={faPaperPlane} /> </Button>
        </div>
      </CardContent>
    </Card>  
      




    </div>
    
  );
};

export default TicketDetails;
