import React, { useEffect, useRef, useState } from 'react'
import ChatBox from './ChatBox'
import Modal from "react-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function ChatModal({isOpen, onClose, user, adminPage}) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
    if (messages.length > 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
          const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          
          document.body.style.overflow = "auto";
          document.body.style.paddingRight = `0px`;
      
          const navbar = document.querySelector(".navbar"); // Ensure this class is in your Navbar
          if (navbar) {
            navbar.style.paddingRight = `0px`;
          }
        } else {
          document.body.style.overflow = "auto";
          document.body.style.paddingRight = "0px";
      
          const navbar = document.querySelector(".navbar");
          if (navbar) {
            navbar.style.paddingRight = "0px";
          }
        }
      
        return () => {
          document.body.style.overflow = "auto";
          document.body.style.paddingRight = "0px";
      
          const navbar = document.querySelector(".navbar");
          if (navbar) {
            navbar.style.paddingRight = "0px";
          }
        };
    }, [isOpen]);

    const handleSend = async(e)=>{
        e.preventDefault();

        alert(message+" has been sent");
        // setMessages(prevMessage => [...prevMessage, message]);
        setMessage("");
    }
    

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="md:fixed md:right-15 md:top-18 w-[80%] md:w-[400px] h-[80vh] flex flex-col bg-white mx-auto shadow-xl rounded-lg p-6 overflow-y-auto"
    overlayClassName="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-50"
    >
    {/* Header */}
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-kanit">Chat</h2>
        <button onClick={onClose} className="text-xl cursor-pointer">✖</button>
    </div>
    <hr className="border-t border-gray-300" />


    {/* Messages */}
    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, idx) => (
        <ChatBox key={idx} msg={msg} index={idx} user={user} adminPage={adminPage} />
        ))}
        <div ref={messagesEndRef}></div>
    </div>

    {/* Input */}
    <form
    onSubmit={handleSend}
    className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-300 font-poppins"
    >
    <input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 bg-white placeholder:text-slate-400 text-slate-700 text-xs md:text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 focus:outline-none focus:border-slate-500 shadow-sm"
    />

    <Button
        type="submit"
        className="px-4 py-2 bg-white text-slate-500 border shadow-md border-slate-300 hover:bg-gray-100 text-xs md:text-sm"
    >
        <FontAwesomeIcon icon={faPaperPlane} />
    </Button>
    </form>

    </Modal>

  )
}

export default ChatModal