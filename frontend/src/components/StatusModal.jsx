import Modal from "react-modal";
import { useEffect } from "react";

export const StatusModal = ({competition, isOpen, onClose}) => {
    useEffect(() => {
        if (isOpen){
            document.body.style.overflow = "hidden";
        } 
        return () => {
            document.body.style.overflow = "auto";
        } 
    }, [isOpen])

    return(
        <Modal competition={competition} isOpen={isOpen} onRequestClose={onClose} className="items-center font-poppins flex flex-col w-[90%] md:w-[70%] bg-white mx-auto shadow-xl relative overflow-y-auto scrollbar-thin rounded-[10px] xl:max-w-[1200px] 2xl:max-w-[1800px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden">
            <p className="font-kanit text-center text-[1.3rem] mt-[3em]">Competition Status</p>
            <span className="text-[2.3rem] xl:text-[2.7rem] absolute top-0 right-0 mr-[1em] md:mr-[1.5em] mt-[0.4em] cursor-pointer" onClick={onClose}>&times;</span>
            <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-[30px] sm:gap-y-[1.5em] pl-[2em] pt-[2em] pb-[3em]">
                <p className="pb-[1em] sm:pb-0">Proof of Payment:</p>
                <div className="w-[40%] aspect-[6/3] bg-gray-500 rounded-[10px] min-w-[200px]"></div>

                 <p className="pt-[1em] sm:pt-0">Confirmation Status:</p>
                 <p className="font-semibold text-red-500">Rejected</p>

                <p className="pt-[1em] sm:pt-0">Admin Comment:</p>
                <p className="w-[90%]">No Guawdawdawdawdawdawd aw dwa dwa dawd aw daw daw d awd awd awd awd awd aw dwa daw daw d awd awd aw daw daw d awd awd aw dd</p>
            </div>
        </Modal>
    );
}