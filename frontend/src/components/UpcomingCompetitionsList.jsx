import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export const UpcomingCompetitionsList = ({competitions}) => {
    const [startIndex, setStartIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);

    const prev = () => {
        if (startIndex !== 0){
            setStartIndex((prevIndex) => prevIndex - 1);
        }
    }   

    const next = () => {
        if (startIndex + itemsPerPage < competitions.length){
            setStartIndex((prevIndex) => prevIndex + 1);
        }
    }   

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 640){
                setItemsPerPage(1);
            } else if (window.innerWidth < 1024){
                setItemsPerPage(2);
                if ((startIndex + 2) > competitions.length){
                    setStartIndex(competitions.length - 2)
                }
            } else {
                setItemsPerPage(3);
                if ((startIndex + 3) > competitions.length){
                    setStartIndex(competitions.length - 3)
                }
            }
        }

        window.addEventListener("resize", () => {updateItemsPerPage()})
        updateItemsPerPage();
    }, [])

    return(
        <>
        <div className="relative flex items-center justify-center">
        <ChevronLeft size={30} onClick={() => prev()} className={`${startIndex === 0 ? "invisible" : "block"} cursor-pointer`} />
            <div className='py-[3em] w-[80%] mt-[2em] flex justify-evenly'>
                {competitions.slice(startIndex, startIndex + itemsPerPage).map((competition) => (    
                <div className='w-[80%] sm:w-[30%] flex flex-col items-center max-w-[400px]'>
                    <div className="overflow-hidden h-[20vh] max-h-[180px] w-[100%] lg:aspect-[7.5/3.5] lg:h-auto rounded-t-[10px] border">
                        <img src="image_placeholder.jpeg" className="h-[100%] w-[100%] object-center object-cover" />
                    </div>
                    <div className="flex flex-col text-[0.7rem] text-white text-center bg-[#DD3833] items-center p-3 flex-1 w-full">
                        <p>Name: {competition.title}</p>
                        <p>Category: {competition.category}</p>
                        <p>Date: {competition.date}</p>
                    </div>
                </div>
                ))}
            </div>
            <ChevronRight size={30} onClick={() => next()} className={`${startIndex + itemsPerPage >= competitions.length ? "invisible" : "block"} cursor-pointer`} />
        </div>
        </>
    );
}
