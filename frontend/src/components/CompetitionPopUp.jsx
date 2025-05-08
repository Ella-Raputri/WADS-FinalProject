import Modal from "react-modal";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadTwibbonPayment from "./UploadTwibbonPayment";
import { AppContent } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";


export const CompetitionPopUp = ({ competition, isOpen, onClose }) => {
    const [uploadOpen, setUploadOpen] = useState(false); 
    const [isRegistered, setIsRegistered] = useState(null);
    const navigate = useNavigate();
    const {userData, isLoggedIn, backendUrl} = useContext(AppContent);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const fetchRegistered = async()=>{
      try {
        const response = await axios.get(`${backendUrl}api/CompetitionRegistration/getUserRegistrationById/${userData.id}/${competition._id}`)
        if(response.data.success){
          setIsRegistered(!response.data.canRegister);
        }
      } catch (error) {
        console.error(error)
      }
      
    }

    useEffect(() => {
      if (!userData?.id || !competition?._id) return;
      console.log("userData:", userData.id);
      console.log("competition:", competition._id);

      fetchRegistered();

        if (isOpen || uploadOpen) {
          const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          
          document.body.style.overflow = "hidden";
          document.body.style.paddingRight = `${scrollbarWidth}px`;
      
          const navbar = document.querySelector(".navbar");
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
      }, [isOpen, uploadOpen, competition]);

    const handleRegisterCompetition = ()=>{
      if(isLoggedIn){
        setUploadOpen(true)
      }
      else {
        toast.warning("Please log in or register an account first.")
        navigate('/login')
      }
    }

    let competitionDate = new Date(competition.CompetitionDate.StartDate);
    let competitionDateEnd = new Date(competition.CompetitionDate.EndDate);
    let competitionDateFinal = new Date(competition.CompetitionDate.FinalDate);
    return (
        <>
        {/* Main Competition Modal */}
        <Modal 
            competition={competition} 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            className="font-poppins md:w-[80%] w-[90%] py-6 pb-8 bg-white mx-auto shadow-xl relative rounded-[10px]" 
            overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden"
        >
            <div className="h-[80vh] md:h-[70vh] overflow-y-auto" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
              <div className="top-0 sticky pt-1 bg-white">
                  <p className="font-kanit font-medium text-2xl xl:text-3xl ml-11 w-[65%] md:w-auto">{competition.Name}</p>
                  <p className="ml-11 text-md xl:text-lg mt-3">Price: {competition.Price} / Person</p>
                  <span className="text-[2.3rem] xl:text-[2.7rem] text-gray-500 absolute top-0 right-0 mr-[1em] md:mr-[1.5em]  hover:text-gray-600 cursor-pointer" onClick={onClose}> <FontAwesomeIcon icon={faTimes}/> </span>
                  <div className="w-[80%] h-[0.05em] bg-gray-400 ml-[3.1em] mt-[0.5em]"></div>
              </div>
              <p className="ml-11 text-md xl:text-lg mt-[1.2em]"><span className="font-semibold">Venue:</span> {competition.Venue}</p>
              <p className="ml-11 text-md xl:text-lg mt-[0.7em]"><span className="font-semibold">Date:</span> {months[competitionDate.getMonth()]} {competitionDate.getDate()} - {months[competitionDateFinal.getMonth()]} {competitionDateFinal.getDate()}</p>
              <p className="ml-11 text-md xl:text-lg mt-[0.7em]"><span className="font-semibold">Final Submission for Preliminary Round:</span> {months[competitionDateEnd.getMonth()]} {competitionDateEnd.getDate()}</p>
              <p className="ml-11 text-md xl:text-lg mt-[0.7em] font-semibold">Prizepool:</p>
              <ul className="ml-5 md:ml-11 list-disc text-md xl:text-lg mt-[0.7em] mr-[2em] md:mr-[8em] text-justify">
                {competition.MainPrize.map((line, index) => {
                    return <li className="ml-11 text-md xl:text-lg mt-[0.7em]" key={index}>{line}</li>
                  })}
              </ul>
              <p className="ml-11 text-md xl:text-lg font-semibold mt-[1.4em]">Requirements:</p>
              <ul className="list-disc ml-5 md:ml-11 text-md xl:text-lg mt-[0.7em] break-words mr-[2em] md:mr-[4em] lg:mr-[7em] text-justify">
                {competition.Description.map((line, index) => {
                  return <li className="ml-11 text-md xl:text-lg mt-[0.7em]" key={index}>{line}</li>
                })}
              </ul>
              <button 
                onClick={() => {
                  isRegistered ? toast.success("You are already registered!") : handleRegisterCompetition()
                }}
                className={`w-30 h-9 mt-8 ${isRegistered ? "bg-[#319340] cursor-not-allowed" : "bg-red-600 cursor-pointer hover:bg-red-700 shadow-md"} font-poppins font-semibold rounded-md text-white text-center block mx-auto mb-2`}
              >
                {isRegistered ? "Registered" : "Register"}
              </button>
            </div>
        </Modal>

        {/* Upload Modal */}
        <UploadTwibbonPayment isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onCloseParent={onClose} competition={competition} />
        </>
    );
}