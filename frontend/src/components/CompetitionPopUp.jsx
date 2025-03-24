import Modal from "react-modal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CompetitionPopUp = ({competition, isRegistered, isOpen, onClose}) => {
    let requirement_arr = competition.rules.split("\n");

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
          const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          
          document.body.style.overflow = "hidden";
          document.body.style.paddingRight = `${scrollbarWidth}px`;
      
          const navbar = document.querySelector(".navbar"); // Ensure this class is in your Navbar
          if (navbar) {
            navbar.style.paddingRight = `${scrollbarWidth}px`;
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

    return (
        <Modal competition={competition} isOpen={isOpen} onRequestClose={onClose} className="font-poppins md:w-[80%] w-[90%] py-6 pb-8 bg-white mx-auto shadow-xl relative rounded-[10px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden">
            <div className="h-[80vh] md:h-[70vh] overflow-y-auto" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
              <div className="top-0 sticky pt-1 bg-white">
                  <p className="font-kanit font-medium text-2xl xl:text-3xl ml-11 w-[65%] md:w-auto">{competition.title}</p>
                  <p className="ml-11 text-md xl:text-lg mt-3">Price: {competition.price} / Person</p>
                  <span className="text-[2.3rem] xl:text-[2.7rem] text-gray-500 absolute top-0 right-0 mr-[1em] md:mr-[1.5em] mt-[0.4em] hover:text-gray-600 cursor-pointer" onClick={onClose}> <FontAwesomeIcon icon={faTimes}/> </span>
                  <div className="w-[80%] h-[0.05em] bg-gray-400 ml-[3.1em] mt-[0.5em]"></div>
              </div>
              <p className="ml-11 text-md xl:text-lg mt-[1.2em]"><span className="font-semibold">Venue:</span> {competition.venue}</p>
              <p className="ml-11 text-md xl:text-lg mt-[0.7em]"><span className="font-semibold">Date:</span> {competition.date}</p>
              <p className="ml-11 text-md xl:text-lg mt-[0.7em]"><span className="font-semibold">Time:</span> {competition.time}</p>
              <p className="ml-11 text-md xl:text-lg mt-[0.7em]"><span className="font-semibold">Prizepool:</span> {competition.prizepool}</p>
              <p className="ml-11 text-md xl:text-lg font-semibold mt-[1.4em]">Requirements:</p>
              <ul className="list-disc ml-11">
                  {requirement_arr.map((line) => (
                      <li className={`leading-7 ml-5 w-[80%] text-md xl:text-lg mt-[0.6em]`}>{line}</li>
                  ))}
              </ul>
              <button className={`w-30 h-9 mt-8 ${isRegistered ? "bg-[#319340]" : "bg-red-600 cursor-pointer hover:bg-red-700"} font-poppins shadow-md font-semibold rounded-md text-white text-center block mx-auto mb-2`}>{isRegistered ? "Registered" : "Register"}</button>
            </div>
        </Modal>
    );
}