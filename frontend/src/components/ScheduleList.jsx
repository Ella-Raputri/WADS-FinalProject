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
    }
    if (now > startDate && now < endDate){
        day = days[startDate.getDay()];
        date = startDate.getDate();
        month = months[startDate.getMonth()];
        year = startDate.getFullYear();
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <div className="flex w-[95%] lg:w-[90%] mx-auto mt-[2em] md:mt-[2em] sm:mt-[0.7em] mb-[1em] justify-center items-center lg:mt-[1em] ">
            <div className="w-[20%] sm:flex-col sm:items-center sm:justify-center hidden sm:flex">
                <p className="text-[0.7rem] xl:text-[1.1rem]">{day}</p>
                <p className="font-medium text-[1.4rem] xl:text-[1.8rem]">{date}</p>
                <p className="text-[0.7rem] xl:text-[1.1rem]">{month} {year}</p>
            </div>
            <div className="w-[80%] bg-[#F4F4F4] rounded-[10px] text-[0.8rem] xl:text-[1.2rem] font-medium flex flex-col justify-center sm:items-center sm:flex-row pt-4 pb-4 sm:pt-3 sm:pb-3 shadow">
                <div className="pl-[2em] w-[90%] sm:w-[70%]">
                    <p className="w-[100%] md:w-[80%]">Competition Name: {competition.title}</p>
                    <p>Category: {competition.category}</p>
                    <p>Time: {competition.time}</p>
                    <button className="w-23 my-[0.7em] py-2 color-component-red rounded-md hover:!bg-red-700 duration-300 text-white cursor-pointer sm:hidden" onClick={() => {
                        setIsOpen(true);
                    }}>Details</button>
                    <button className="w-23 py-2 ml-[1em] bg-blue-500 rounded-md hover:!bg-blue-700 duration-300 text-white cursor-pointer sm:hidden" onClick={() => {
                        setIsOpen(true);
                    }}>Status</button>
                </div>
                <div className="w-[50%] sm:w-[30%] hidden sm:flex sm:flex-col sm:justify-center sm:items-center gap-[10px] my-[0.7em]">
                    <button className="w-23 py-2 color-component-red rounded-md hover:!bg-red-700 duration-300 text-white cursor-pointer" onClick={() => {
                        setIsOpen(true);
                    }}>Details</button>
                    <button className="w-23 py-2 bg-blue-500 rounded-md hover:!bg-blue-700 duration-300 text-white cursor-pointer" onClick={() => {
                        setIsOpen(true);
                    }}>Status</button>
                </div>
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