import { useState } from "react";
import { CompetitionPopUp } from "./CompetitionPopUp";

export const SecheduleList = ({competition}) => {
    let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let day, date, month, year, status = null;
    let now = new Date();
    let startDate = competition.startDate;
    let endDate = competition.endDate;

    if (now < startDate){
        day = days[startDate.getDay()];
        date = startDate.getDate();
        month = months[startDate.getMonth()];
        year = startDate.getFullYear();
        status = "Incoming";
    }
    if (now > startDate && now < endDate){
        day = days[startDate.getDay()];
        date = startDate.getDate();
        month = months[startDate.getMonth()];
        year = startDate.getFullYear();
        status = "Ongoing";
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div className="flex w-[95%] lg:w-[90%] mx-auto mt-[2em] md:mt-[2em] sm:mt-[0.7em] mb-[1em] justify-center items-center lg:mt-[1em]">
            <div className="w-[20%] sm:flex-col sm:items-center sm:justify-center hidden sm:flex">
                <p className="text-[0.7rem]">{day}</p>
                <p className="font-medium text-[1.4rem]">{date}</p>
                <p className="text-[0.7rem]">{month} {year}</p>
            </div>
            <div className="w-[80%] bg-[#F4F4F4] rounded-[10px] text-[0.8rem] font-medium flex flex-col justify-center relative pt-4 pb-4 sm:pt-1 sm:pb-1 shadow">
                <p className="ml-[2em] lg:w-[60%]">Competition Name: {competition.title}</p>
                <p className="ml-[2em]">Category: {competition.category}</p>
                <p className="ml-[2em]">Time: {competition.time}</p>
                <p className={`ml-[2em]`}>Status: <p className={`inline-flex ${status === "Incoming" ? "text-[#DEC41B]" : "text-[#FF9000]"}`}>{status}</p></p>
                <button className="lg:absolute lg:right-0 w-23 h-7 mt-2 mb-2 lg:mb-0 lg:mr-10 ml-6 color-component-red rounded-md hover:!bg-red-700 text-white cursor-pointer" onClick={() => {
                    setIsOpen(true);
                }}>Details</button>
            </div>
        </div>
        { isOpen && 
            <CompetitionPopUp competition={competition} isRegistered={true} isOpen={isOpen} onClose={() => {
                setIsOpen(false);
            }} />
        }
        </>
    );
}