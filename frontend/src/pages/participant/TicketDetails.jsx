import React, { useState } from "react";

const TicketDetails = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-2xl mt-25 mx-auto bg-white rounded-md shadow-md p-4">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <button className="btn btn-sm btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="btn btn-sm btn-error text-white">Close the ticket</button>
      </div>

      {/* Initial Ticket */}
      <div className="border rounded-md p-4 mb-4">
        <div className="flex justify-between mb-2">
          <div className="font-semibold text-gray-500">SUBJECT</div>
          <div className="flex items-center gap-2">
            <span className="bg-red-300 text-white text-xs px-2 py-1 rounded-full">Open</span>
            <span className="text-red-500 flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
              Urgent
            </span>
          </div>
        </div>
        <div className="font-medium">Website down</div>
        
        <div className="font-semibold text-gray-500 mt-4">DESCRIPTION</div>
        <p className="text-sm mt-1">
          Hello my name is A. Today when I access the website, the website is automatically down 
          in my laptop. When I access it again on afternoon, it's fine, so I register a competition 
          halfway. But, when on night, I want to continue register, the website is down for 
          competition page and I cant access it until now. Help!!!
        </p>
        
        <div className="text-xs text-gray-500 mt-4 grid grid-cols-2 gap-y-1">
          <div>Created at</div>
          <div>2025-02-20 23:59</div>
          <div>Updated at</div>
          <div>2025-02-20 23:59</div>
          <div>Sender</div>
          <div>albertsantoso@gmail.com</div>
          <div>Handled by</div>
          <div>Ella, Ellis, Rafael</div>
        </div>
      </div>

      {/* Response message */}
      <div className="border rounded-md p-4 mb-4">
        <div className="flex justify-between mb-2">
          <div className="font-semibold text-gray-500">SUBJECT</div>
          <div className="text-xs text-gray-500">2025-02-21 11:00</div>
        </div>
        <div className="font-medium">Response to Website Down</div>
        
        <div className="font-semibold text-gray-500 mt-4">MESSAGE</div>
        <p className="text-sm mt-1">
          Hello A. Thank you for the information. We will investigate and inform you soon for the 
          latest info.
        </p>
        
        <div className="flex justify-center mt-4">
          <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
            Ticket marked as in progress.
          </span>
        </div>
      </div>

      {/* Resolution message */}
      <div className="border rounded-md p-4 mb-4">
        <div className="flex justify-between mb-2">
          <div className="font-semibold text-gray-500">SUBJECT</div>
          <div className="text-xs text-gray-500">2025-02-21 11:31</div>
        </div>
        <div className="font-medium">Resolve for Website Down</div>
        
        <div className="font-semibold text-gray-500 mt-4">MESSAGE</div>
        <p className="text-sm mt-1">
          Hello A. We have fixed our issue. You can try the competition page again. Do not hesitate if 
          you have any problem. Thank you
        </p>
        
        <div className="flex justify-center mt-4">
          <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
            Ticket mark as resolved.
          </span>
        </div>
      </div>

      {/* Thank you message */}
      <div className="border rounded-md p-4 mb-4">
        <div className="font-semibold text-gray-500">SUBJECT</div>
        <div className="font-medium">Thank you</div>
        
        <div className="font-semibold text-gray-500 mt-4">MESSAGE</div>
        <p className="text-sm mt-1">
          Thank you.
        </p>
        
        <div className="flex justify-center mt-4">
          <span className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
            Ticket mark as closed.
          </span>
        </div>
      </div>

      {/* Reply form */}
      <div className="border rounded-md p-4">
        <input 
          type="text" 
          placeholder="Add a Subject" 
          className="input input-bordered w-full mb-4"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea 
          className="textarea textarea-bordered w-full h-32 mb-4" 
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div className="flex justify-end">
          <button className="btn btn-sm">
            Send
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;