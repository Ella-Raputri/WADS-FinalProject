import Modal from "react-modal";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import React from 'react'
import { toast } from "react-toastify";
import axios from "axios";
import { AppContent } from "@/context/AppContext";

function RatingPopup({ ticket, isOpen, onClose, isDone, ratingResult }) {
  const ratingOptions = [
    { label: "Terrible", emoji: "😡", value: 1 },
    { label: "Bad", emoji: "😕", value: 2 },
    { label: "Neutral", emoji: "😐", value: 3 },
    { label: "Good", emoji: "🙂", value: 4 },
    { label: "Excellent", emoji: "😊", value: 5 },
  ];

  const [selectedRating, setSelectedRating] = useState("");
  const [comment, setComment] = useState("");
  const {backendUrl} =useContext(AppContent);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const navbar = document.querySelector(".navbar");
      if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
      
      if(isDone) setSelectedRating(ratingResult.Rating);

    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      const navbar = document.querySelector(".navbar");
      if (navbar) navbar.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
      const navbar = document.querySelector(".navbar");
      if (navbar) navbar.style.paddingRight = "0px";
    };
  }, [isOpen]);

  const handleSubmit = async() => {
    if (!selectedRating) {
      alert("Please select a rating!");
      return;
    }

    try {
      axios.defaults.withCredentials =true
      const { data } = await axios.post(backendUrl + 'api/ticket/rateTicket', {ticketId:ticket._id, adminId: ticket.HandledBy, rating:selectedRating, comment:comment});
      
      if(data.success) {
        toast.success(data.message);
        onClose();
      } else {
          toast.error(data.message);
      }

    } catch (error) {
        console.error("error:", error);
    }


  };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="font-poppins md:w-[80%] w-[90%] py-6 pb-8 bg-white mx-auto shadow-xl relative rounded-[10px]"
        overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="h-[80vh] md:h-[70vh] overflow-y-auto px-8" style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}>
        <div className="top-0 sticky pt-1 bg-white pb-4 z-10">
          <p className="font-kanit font-medium text-2xl xl:text-3xl">Ticket Rating</p>
          <FontAwesomeIcon icon={faTimes} className="text-2xl text-gray-500 absolute top-2 right-2 cursor-pointer hover:text-gray-700" onClick={onClose} />
          <div className="w-full h-[0.05em] bg-gray-300 mt-4"></div>
        </div>
  
        <p className="text-md xl:text-xl font-semibold md:mt-2 mb-4 xl:mb-8">How was the service you received?</p>
        
        {!isDone && !ratingResult && 
        <div>
        <div className="flex flex-col md:flex-row justify-around items-center gap-6 mb-6 xl:mb-10">
            {ratingOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => setSelectedRating(option.value)}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  selectedRating === option.value ? "scale-110" : "opacity-70"
                }`}
              >
                <div
                  className={`text-5xl rounded-full border-4 p-2 ${
                    selectedRating === option.value
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                >
                  {option.emoji}
                </div>
                <span
                  className={`mt-1 font-poppins text-sm ${
                    selectedRating === option.value ? "font-bold text-black" : "text-gray-500"
                  }`}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>

          <textarea
              className="resize-none w-full min-h-32 bg-white placeholder:text-slate-400 text-slate-700 text-sm md:text-md border border-slate-300 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
              placeholder="Type your comments (max 500 words)"
              value={comment}
              maxLength={500}
              rows={4}
              onChange={(e) => setComment(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <button 
                className="w-25 h-9 bg-red-600 cursor-pointer hover:bg-red-700 shadow-md font-poppins font-semibold rounded-md text-white text-center block"
                onClick={handleSubmit}>
                Submit
            </button>
          </div>

          </div>
          }



        {isDone && ratingResult && 
        <div>
        <div className="flex flex-col md:flex-row justify-around items-center gap-6 mb-6 xl:mb-10">
            {ratingOptions.map((option) => (
              <div
                key={option.value}
                className={`flex flex-col items-center transition-all ${
                  selectedRating === option.value ? "scale-110" : "opacity-70"
                }`}
              >
                <div
                  className={`text-5xl rounded-full border-4 p-2 ${
                    selectedRating === option.value
                      ? "border-green-500"
                      : "border-transparent"
                  }`}
                >
                  {option.emoji}
                </div>
                <span
                  className={`mt-1 font-poppins text-sm ${
                    selectedRating === option.value ? "font-bold text-black" : "text-gray-500"
                  }`}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>

          <textarea
              className="resize-none w-full min-h-32 lg:min-h-48 bg-white placeholder:text-slate-400 text-slate-700 text-sm md:text-md border border-slate-300 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
              placeholder={ratingResult.Comment}
              maxLength={500}
              rows={4}
              disabled
          />

          

          </div>
          }

          

        </div>
      </Modal>
    );
}

export default RatingPopup

