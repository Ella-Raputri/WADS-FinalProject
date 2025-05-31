import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { convertToTimeZone } from "@/lib/utils";

export default function ChatBox({ msg, index, user, page }) {
  //if true, then it is the system message
  const isSystemMessage = (page==='ticketdetails') && (msg.SenderId.FullName === "System");

  //if true, then it is the user message
  const isUserMessage = (page==='adminticketdetails' && user.role==='admin' && msg.AdminId===user.id) || (page==='ticketdetails' && user.role==='admin') || (page==='ticketdetails' && msg.SenderId._id === user.id) || (page==='chatbot' && msg.Role==='user');    

  return (
    <div className="max-w-6xl mt-6 mx-auto font-poppins" lang="en">
      <Card className="shadow-none border-none bg-transparent p-4">
        <div className={`relative flex ${isSystemMessage? 'justify-around' : isUserMessage ? "justify-end" : "justify-start"}`}>
          <div className="relative">

            {/* message content */}
            <CardContent
              key={index}
              className={`p-2 px-4 w-fit max-w-4xl rounded-lg break-words hyphens-auto whitespace-pre-wrap ${
                isSystemMessage
                  ? "bg-gray-400 rounded-full text-xs text-white text-center mx-auto place-items-center"
                  : isUserMessage
                  ? "bg-gray-700 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >

              {/* message image content */}
              {!isSystemMessage && <h3 className="font-semibold">{msg.Subject? msg.Subject : msg.AdminName}</h3>}
              {msg.Image && (
                <img 
                  src={msg.Image} 
                  alt="Attached" 
                  className="mt-2 max-w-full max-h-72 object-contain rounded-lg shadow-md"
                />
              )}
              {msg.Message && (<p className="mt-2">{msg.Message}</p>)}
              
              {/* message time */}
              {msg.createdAt && (
                <p className={`text-xs mt-2 text-right ${isSystemMessage ? "text-white" : isUserMessage? "text-white": "text-gray-700"}`}>
                  {convertToTimeZone(msg.createdAt)}
                </p>
              )}
            </CardContent>

            {/* Message Tail (Only for user messages) */}
            {!isSystemMessage && (
              <div
                className={`absolute w-4 h-4 border-t-[30px] border-t-transparent ${
                  isUserMessage
                    ? "border-l-[10px] border-l-gray-800 right-0 top-9/12 translate-x-full -translate-y-1/2"
                    : "border-r-[20px] border-r-gray-300 left-0 top-9/12 -translate-x-full -translate-y-1/2"
                }`}
              ></div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
