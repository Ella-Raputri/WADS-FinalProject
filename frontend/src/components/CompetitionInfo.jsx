import { useState } from "react";
import { CompetitionPopUp } from "./CompetitionPopUp";
import React from 'react';
import junior_singing from '../assets/junior_singing.png';
import senior_singing from '../assets/senior_singing.png';
import storytelling from '../assets/storytelling.png';
import speech from '../assets/speech.png';
import poster_design from '../assets/poster_design.png';
import dubbing from '../assets/dubbing.png';

export const CompetitionInfo = ({competition, isFirst, userData}) => {
    const [isOpen, setIsOpen] = useState(false);

    const slides = [
        { title: "Junior Singing", image: junior_singing },
        { title: "Senior Singing", image: senior_singing },
        { title: "Storytelling", image: storytelling },
        { title: "Speech", image: speech },
        { title: "Poster Design", image: poster_design },
        { title: "Dubbing", image: dubbing },
    ];
    const matchedSlide = slides.find(slide => slide.title === competition.Name);
    const imageSrc = matchedSlide.image;

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let competitionStartDate, competitionFinalDate = null;
    competitionStartDate = new Date(competition.CompetitionDate.StartDate);
    competitionFinalDate = new Date(competition.CompetitionDate.FinalDate);

    return(
    <>
    <div data-aos={`${userData? "none" : "fade-up"}`} className={`w-[90%] break-words justify-self-center flex flex-col gap-8 items-center md:flex-row lg:w-[80%] ${isFirst ? "mt-[8em]" : "md:mt-[4em] mt-[5em]"} xl:max-w-[1200px] 2xl:max-w-[1800px]`}>    
        {/* image */}
        <div className="w-[28%] bg-gray-400 rounded-[10px] shrink-0 min-w-[250px] sm:min-w-[300px] max-w-[350px] aspect-[7/5] flex items-center justify-center">
            <img className="w-[70%]" src={imageSrc} alt={competition.Name} />
        </div>

        {/* content */}
        <div className="w-[90%] flex flex-col justify-center md:min-w-[200px] md:w-[72%]">
            <p className="font-medium text-2xl mb-2 font-kanit">{competition.Name}</p>
            <div className="text-md mt-1 leading-7 text-justify text-[#000000] font-poppins">{competition.Description[0]+ ' '+competition.Description[1]+' '+competition.Description[2]}</div>
            <div className="text-sm mt-2 text-[#818181] font-poppins">Date: {months[competitionStartDate.getMonth()]} {competitionStartDate.getDate()} - {months[competitionFinalDate.getMonth()]} {competitionFinalDate.getDate()}</div>
            <button className="font-semibold text-sm font-poppins w-25 h-9 mt-5 transition duration-200 ease bg-red-600 rounded-md shadow-md hover:bg-red-700 text-white cursor-pointer" onClick={() => {
                setIsOpen(true);
            }}>Register</button>
        </div>
    </div>
    
    {/* pop up window */}
    { isOpen && 
    <CompetitionPopUp competition={competition} isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        }}></CompetitionPopUp>
    }
    </>
    );
}
