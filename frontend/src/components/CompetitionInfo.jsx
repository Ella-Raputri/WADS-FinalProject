import { useState } from "react";
import { CompetitionPopUp } from "./CompetitionPopUp";

export const CompetitionInfo = ({competition, isFirst}) => {
    const [isOpen, setIsOpen] = useState(false);

    return(
    <>
    <div className={`w-[90%] justify-self-center flex flex-col gap-14 items-center md:flex-row lg:w-[80%] ${isFirst ? "mt-[8em]" : "md:mt-[4em] mt-[5em]"}`}>    
        <div className="w-[28%] bg-gray-400 rounded-[10px] min-h-[250px] shrink-0 min-w-[250px] sm:min-w-[300px]"></div>
        <div className="w-[90%] flex flex-col justify-center md:w-[72%]">
            <p className="font-semibold text-[1.2rem] font-kanit">{competition.title}</p>
            <div className="text-[0.9rem] mt-1 text-[#818181] font-poppins">Category: {competition.category}</div>
            <div className="text-[0.9rem] mt-1 text-[#000000] font-poppins">{competition.description}</div>
            <div className="text-[0.9rem] mt-1 text-[#818181] font-poppins">Date: {competition.date}</div>
            <button className="w-25 h-9 mt-3 color-component-red rounded-md hover:!bg-red-700 text-white cursor-pointer" onClick={() => {
                setIsOpen(true);
            }}>Register</button>
        </div>
    </div>
    
    { isOpen && 
    <CompetitionPopUp competition={competition} isRegistered={false} isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        }}></CompetitionPopUp>
    }
    </>
    );
}
