import React, { useContext, useEffect, useRef, useState } from 'react'
import ChatBox from './ChatBox'
import Modal from "react-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';

function ChatModal({isOpen, onClose, user}) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [fetchNum, setFetchNum] = useState(0);

    const messagesEndRef = useRef(null);
    const {backendUrl} = useContext(AppContent);

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

    useEffect(()=>{
      if(!user) return;

      fetchData();
    }, [isOpen]);


    const fetchData = async () => {
      const needsFetching = messages.length === 0;
      if (!needsFetching) return; // Skip if all data is available
      if(fetchNum>=5) return;
    
      try {
        console.log("Fetching message...");
        setFetchNum(fetchNum+1);
        
        const [messageResponse] = await Promise.all([
          axios.get(`${backendUrl}api/message/fetchChatbotMessage?userId=${user.id}`)
        ]);        
        
        setMessages(messageResponse.data.chat);
    
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    const handleSend = async(e)=>{
        e.preventDefault();
        axios.defaults.withCredentials = true;

        if(!user){
            const newMessage = {
                Message: message,
                Role: "user",
                SenderId: "guest",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            setMessages(prev => [...prev, newMessage]);
            setMessage("");
            generateBotResponse(newMessage);
            return;
        }

        try {
            const { data } = await axios.post(backendUrl + 'api/message/sendChatbotMessage', { userId:user.id, message:message, role:"user" });

            if (data.success) {
                setTimeout(async () => {
                    try {
                        const res = await axios.get(`${backendUrl}api/message/fetchChatbotMessage?userId=${user.id}`);
                        setMessages(res.data.chat); // Overwrite with the latest
                        setMessage("");

                    } catch (err) {
                        console.error("Error fetching updated chat:", err);
                    }
                }, 1); 
                const chats = res.data.chat;
                generateBotResponse(chats[chats.length-1]);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Message send error:", error);
            toast.error("Failed to send message. Please try again.");
        }
    }

    const generateBotResponse = async(latestMessage)=>{
        try {
            console.log(latestMessage.Message);
            const response = await axios.post(`${backendUrl}api/message/generateChatbotResponse`, {lastMsg:latestMessage.Message});
            const botMsg = response.data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

            if(!user){
                const newMessage = {
                    Message: botMsg,
                    Role: "AI",
                    SenderId: "guest",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                setMessages(prev => [...prev, newMessage])
            }
            else{
                const { data } = await axios.post(backendUrl + 'api/message/sendChatbotMessage', { userId:user.id, message:botMsg, role:"AI" })
                if (data.success) {
                    setTimeout(async () => {
                        try {
                            const res = await axios.get(`${backendUrl}api/message/fetchChatbotMessage?userId=${user.id}`);
                            setMessages(res.data.chat); // Overwrite with the latest
    
                        } catch (err) {
                            console.error("Error fetching updated chat:", err);
                        }
                    }, 1);
                }
            }
            

        } catch (error) {
            console.error(error)
        }
    }
    

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="md:fixed md:right-15 md:top-18 w-[80%] md:w-[500px] h-[80vh] flex flex-col bg-white mx-auto shadow-xl rounded-lg p-6"
    overlayClassName="fixed inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-50"
    >

    {/* Header */}
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-kanit">Chat</h2>
        <button onClick={onClose} className="text-xl cursor-pointer">✖</button>
    </div>
    <hr className="border-t border-gray-300" />
    
    <div className="h-[80vh] md:h-[70vh] overflow-y-auto" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>


    {/* Messages */}
    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg, idx) => (
        <ChatBox key={idx} msg={msg} index={idx} user={user} page={"chatbot"} />
        ))}
        <div ref={messagesEndRef}></div>
    </div>

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