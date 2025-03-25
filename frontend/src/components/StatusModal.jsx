import Modal from "react-modal";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


export const StatusModal = ({competition, isOpen, onClose}) => {
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

    return(
        <Modal competition={competition} isOpen={isOpen} onRequestClose={onClose} className="font-poppins md:w-[80%] w-[90%] py-6 pb-8 bg-white mx-auto shadow-xl relative rounded-[10px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden">
            <div className="h-[80vh] md:h-[70vh] overflow-y-auto" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
              <div className="top-0 sticky pt-1 bg-white">
                  <p className="font-kanit font-medium text-2xl xl:text-3xl ml-11 w-[65%] md:w-auto">Competition Status</p>
                  <span className="text-[2.3rem] xl:text-[2.7rem] text-gray-500 absolute top-0 right-0 mr-[1em] md:mr-[1.5em] hover:text-gray-600 cursor-pointer" onClick={onClose}> <FontAwesomeIcon icon={faTimes}/> </span>
                  <div className="w-[80%] h-[0.05em] bg-gray-400 ml-[3.1em] mt-[0.5em]"></div>
              </div>


              <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-[30px] ml-5 sm:gap-y-[1.5em] pl-[2em] pt-[2em] pb-[0.5em]">
                  <p className="font-semibold text-md xl:text-lg mb-1 sm:pb-0">Proof of Payment:</p>
                  <img src='https://indonesia.travel/content/dam/indtravelrevamp/home-revamp/bali-jack.jpg' className="w-[40%] aspect-[6/3] bg-gray-500 mb-3 rounded-[10px] min-w-[200px]"/>

                  <p className="text-md font-semibold xl:text-lg mb-1 sm:pb-0">Twibbon Proof:</p>
                  <img src='https://m.media-amazon.com/images/I/61DwXnVN9QL._AC_UF894,1000_QL80_.jpg' className="w-[40%] bg-gray-500 rounded-[10px] min-w-[200px]"/>

                  <p className="text-md font-semibold xl:text-lg sm:pt-0">Confirmation Status:</p>
                  <p className="text-md xl:text-lg font-semibold text-red-500">Rejected</p>

                  <p className="text-md font-semibold xl:text-lg sm:pt-0">Admin Comment:</p>
                  <p className="text-md text-justify leading-7 xl:text-md w-[80%] break-words">No Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw dd No Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw ddNo Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw ddNo Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw ddNo Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw ddNo Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw ddNo Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw ddNo Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw ddNo Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw dd</p>
              </div>
            </div>
        </Modal>
    );
}