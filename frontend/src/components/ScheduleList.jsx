import { useState } from "react";
import { CompetitionPopUp } from "./CompetitionPopUp";
import { StatusModal } from "./StatusModal";
import React from "react";

export const SecheduleList = ({competition}) => {
    let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    let startDate = new Date(competition.CompetitionDate.StartDate);
    let endDate = new Date(competition.CompetitionDate.EndDate);

    let day, date, month, year = null;
    let monthEnd, dateEnd = null;

    day = days[startDate.getDay()];
    date = startDate.getDate();
    month = months[startDate.getMonth()];
    year = startDate.getFullYear();
    
    monthEnd = months[endDate.getMonth()];
    dateEnd = endDate.getDate();

    const [competitionIsOpen, setCompetitionIsOpen] = useState(false);
    const [statusIsOpen, setStatusIsOpen] = useState(false);

    return (
        <>
        <div className="flex w-[95%] lg:w-[90%] mx-auto mt-[2em] md:mt-[2em] sm:mt-[0.7em] mb-[1em] justify-center items-center lg:mt-[1em]">
            <div className="w-[20%] sm:flex-col sm:items-center sm:justify-center hidden sm:flex">
                <p className="text-lg">{day}</p>
                <p className="font-medium text-3xl">{date}</p>
                <p className="text-lg">{month} {year}</p>
            </div>
            <div className="w-[80%] sm:mr-2 md:mr-0 bg-[#F4F4F4] rounded-[10px] font-poppins  flex flex-col justify-center sm:items-center sm:flex-row pt-4 pb-4 sm:pt-3 sm:pb-3 shadow">
                <div className="pl-[2em] w-[90%] sm:w-[70%] flex flex-col">
                    <p className="w-[100%] md:w-[80%] text-xl pb-2 font-semibold">{competition.Name}</p>
                    <p className="font-medium text-lg">Submission Due: {monthEnd} {dateEnd}</p>
                    <button className="w-23 my-[0.7em] py-2 bg-red-600 shadow-md font-semibold text-sm rounded-md hover:!bg-red-700 duration-200 ease transition text-white cursor-pointer sm:hidden" onClick={() => {
                        setCompetitionIsOpen(true);
                    }}>Details</button>
                    <button className="w-23 py-2 bg-blue-500 shadow-md font-semibold text-sm rounded-md hover:!bg-blue-700 duration-200 ease transition text-white cursor-pointer sm:hidden" onClick={() => {
                        setStatusIsOpen(true);
                    }}>Status</button>
                </div>
                <div className="w-[50%] md:mr-5 lg:mr-0 sm:w-[30%] hidden sm:flex sm:flex-col sm:justify-center sm:items-center gap-[12px] my-[0.7em]">
                    <button className="w-23 py-2 bg-red-600 shadow-md font-semibold text-sm rounded-md hover:!bg-red-700 duration-200 ease transition text-white cursor-pointer" onClick={() => {
                        setCompetitionIsOpen(true); 
                    }}>Details</button>
                    <button className="w-23 py-2 bg-blue-500 shadow-md font-semibold text-sm rounded-md hover:!bg-blue-700 duration-200 ease transition text-white cursor-pointer" onClick={() => {
                        setStatusIsOpen(true);
                    }}>Status</button>
                </div>
            </div>
        </div>
        { competitionIsOpen && 
            <CompetitionPopUp competition={competition} isRegistered={true} isOpen={competitionIsOpen} onClose={() => {
                setCompetitionIsOpen(false);
            }} />
        }
        { statusIsOpen && 
            <StatusModal competition={competition} isOpen={statusIsOpen} onClose={() => {
                setStatusIsOpen(false);
            }} />
        }
        </>
    );
}