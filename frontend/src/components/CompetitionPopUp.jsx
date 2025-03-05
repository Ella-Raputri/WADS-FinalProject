import Modal from "react-modal";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CompetitionPopUp = ({competition, isRegistered, isOpen, onClose}) => {
    let requirement_arr = competition.rules.split("\n");

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen){
            document.body.style.overflow = "hidden";
        } 
        return () => {
            document.body.style.overflow = "auto";
        }
    }, [isOpen])

    return (
        <Modal competition={competition} isOpen={isOpen} onRequestClose={onClose} className="font-poppins md:w-[80%] w-[90%] md:h-[80vh] h-[90vh] bg-white mx-auto shadow-xl relative overflow-y-auto scrollbar-thin rounded-[10px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden">
            <div className="top-0 sticky pt-1 bg-white">
                <p className="font-kanit text-[1.5rem] xl:text-[1.9rem] mt-[1.5em] ml-[2em] w-[65%] md:w-auto">{competition.title}</p>
                <p className="ml-[4em] text-[0.8rem] xl:text-[1.2rem] mt-[1em]">Price: {competition.price} / Person</p>
                <span className="text-[2.3rem] xl:text-[2.7rem] absolute top-0 right-0 mr-[1em] md:mr-[1.5em] mt-[0.4em] cursor-pointer" onClick={onClose}>&times;</span>
                <div className="w-[80%] h-[0.05em] bg-gray-400 ml-[3.1em] mt-[0.5em]"></div>
            </div>
            <p className="ml-[4em] text-[0.8rem] xl:text-[1.2rem] mt-[1em]">Venue: {competition.venue}</p>
            <p className="ml-[4em] text-[0.8rem] xl:text-[1.2rem] mt-[0.6em]">Date: {competition.date}</p>
            <p className="ml-[4em] text-[0.8rem] xl:text-[1.2rem] mt-[0.6em]">Time: {competition.time}</p>
            <p className="ml-[4em] text-[0.8rem] xl:text-[1.2rem] mt-[0.6em]">Prizepool: {competition.prizepool}</p>
            <p className="ml-[3.5em] text-[0.9rem] xl:text-[1.3rem] font-semibold mt-[1em]">Rules / Requirements</p>
            <ul className="list-disc ml-[4em]">
                {requirement_arr.map((line) => (
                    <li className={`w-[80%] text-[0.8rem] xl:text-[1.2rem] mt-[0.6em]`}>{line}</li>
                ))}
            </ul>
            <button className={`w-30 h-9 mt-5 ${isRegistered ? "bg-[#319340] hover:!bg-green-700" : "color-component-red hover:!bg-red-700"} rounded-md text-white text-center block mx-auto mb-[3em] cursor-pointer`}>{isRegistered ? "Registered" : "Register"}</button>
        </Modal>
    );
}