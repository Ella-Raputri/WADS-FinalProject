import React from "react";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import UploadTwibbonPayment from "./UploadTwibbonPayment";
import { AppContent } from "@/context/AppContext";
import { useContext } from "react";
import axios from "axios";


export const StatusModal = ({competition, isOpen, onClose}) => {
    const [uploadOpen, setUploadOpen] = useState(false);
    const {userData, backendUrl} = useContext(AppContent);

    const [isRejected, setIsRejected] = useState(null); 
    const [confirmationStatus, setConfirmationStatus] = useState(null);
    const [adminComment, setAdminComment] = useState(null);
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRegistration = async()=>{
        axios.defaults.withCredentials =true
        try {
            const response = await axios.get(backendUrl+'api/competitionRegistration/getUserRegistrationById/'+userData.id+'/' +competition._id);
            if(response.data.success){
                const newestRegist = response.data.newestRegistration
                console.log(newestRegist)
                setData(newestRegist);
                if (newestRegist.Status === "Rejected"){
                    setIsRejected(true);
                } else {
                    setIsRejected(false);
                }
                setConfirmationStatus(newestRegist.Status);
                setAdminComment(newestRegist.AdminComment);
                setIsLoading(false);
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchRegistration();

        if (isOpen || uploadOpen) {
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
      }, [isOpen, uploadOpen]);

    return(
      <>
      {isLoading? <div></div> : 
        <div>
        <Modal competition={competition} isOpen={isOpen} onRequestClose={onClose} className="font-poppins md:w-[80%] w-[90%] py-6 pb-8 bg-white mx-auto shadow-xl relative rounded-[10px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden">
            <div className="h-[80vh] md:h-[70vh] overflow-y-auto" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
              <div className="top-0 sticky pt-1 bg-white">
                  <p className="font-kanit font-medium text-2xl xl:text-3xl ml-11 w-[65%] md:w-auto">Competition Status</p>
                  <span className="text-[2.3rem] xl:text-[2.7rem] text-gray-500 absolute top-0 right-0 mr-[1em] md:mr-[1.5em] hover:text-gray-600 cursor-pointer" onClick={onClose}> <FontAwesomeIcon icon={faTimes}/> </span>
                  <div className="w-[80%] h-[0.05em] bg-gray-400 ml-[3.1em] mt-[0.5em]"></div>
              </div>


              <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-[30px] ml-5 sm:gap-y-[1.5em] pl-[2em] pt-[2em] pb-[0.5em]">
                  <p className="font-semibold text-md xl:text-lg mb-1 sm:pb-0">Proof of Payment:</p>
                  <img src={data.PaymentProof} className="w-[40%] mb-5 rounded-[10px] min-w-[200px]" alt="Payment Proof Image"/>

                  <p className="text-md font-semibold xl:text-lg mb-1 sm:pb-0">Twibbon Proof:</p>
                  <img src={data.TwibbonProof} className="w-[40%] rounded-[10px] min-w-[200px] mb-5" alt="Twibbon Proof Image"/>

                  <p className="text-md font-semibold xl:text-lg sm:pt-0">Confirmation Status:</p>
                  <p className={`text-md xl:text-lg lg:mb-2 mb-5 font-semibold ${confirmationStatus === "Accepted" ? "text-green-700": confirmationStatus === "Rejected" ? "text-red-500": confirmationStatus === "Pending" ? "text-yellow-700" : "" }`}>{confirmationStatus}</p>

                  <p className="text-md font-semibold xl:text-lg sm:pt-0">Admin Comment:</p>
                  <p className="text-md xl:text-lg text-justify mb-5 leading-7 w-[80%] break-words">{adminComment === "" ? "None" : adminComment}</p>
              
              </div>

              {
                  isRejected? (<button 
                  onClick={() => setUploadOpen(true)} 
                  className={`w-30 h-9 mt-8 bg-red-600 cursor-pointer hover:bg-red-700 shadow-md font-poppins font-semibold rounded-md text-white text-center block mx-auto mb-2`}
                >
                  Resubmit
                </button>) : (<div></div>)
              }
              
            </div>
        </Modal>
        

        {/* Upload Modal */}
        <UploadTwibbonPayment isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onCloseParent={onClose} competition={competition}/>
        </div>
        }


        </>
    );
}