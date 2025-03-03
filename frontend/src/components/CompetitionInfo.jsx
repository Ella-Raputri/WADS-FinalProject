import { useState } from "react";
import { CompetitionPopUp } from "./CompetitionPopUp";

export const CompetitionInfo = ({competition, isFirst}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentlyDisplayingCompetition, setcurrentlyDisplayingCompetition] = useState(null);

    return(
    <>
    <div className={`w-[90%] justify-self-center min-h-[50vh] h-auto flex flex-col gap-14 ${isFirst ? "mt-[7em]" : "mt-[4em]"} items-center md:flex-row lg:w-[80%] ${isFirst ? "md:mt-[6em]" : "md:mt-[1em]"}`}>    
            <div className="w-[28%] min-w-70 bg-gray-400 rounded-[10px] h-[40vh] shrink-0 sm:min-w-60"></div>
            <div className="w-[90%] flex flex-col justify-center h-auto md:w-[72%]">
            <p className="font-semibold text-[1.2rem] font-kanit">{competition.title}</p>
                <div className="text-[0.9rem] mt-1 text-[#818181] font-poppins">Category: {competition.category}</div>
                <div className="text-[0.9rem] mt-1 text-[#000000] font-poppins">{competition.description}</div>
                <div className="text-[0.9rem] mt-1 text-[#818181] font-poppins">Date: {competition.date}</div>
                <button className="w-25 h-9 mt-3 color-component-red rounded-md hover:!bg-red-700 text-white" onClick={() => {
                    setIsOpen(true);
                    setcurrentlyDisplayingCompetition(competition);
                }}>Register</button>
            </div>
    </div>
    <CompetitionPopUp competition={currentlyDisplayingCompetition} isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setcurrentlyDisplayingCompetition(null);
        }}></CompetitionPopUp>
    </>
    );
}
