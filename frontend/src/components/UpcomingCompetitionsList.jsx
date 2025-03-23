import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { useRef } from "react";

export const UpcomingCompetitionsList = ({competitions}) => {
    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const prev = () => {
        if (swiperRef.current){
            swiperRef.current.slidePrev();
        }
    }   

    const next = () => {
        if (swiperRef.current){
            swiperRef.current.slideNext();
        }
    }   

    const updateChange = () => {
        setIsBeginning(swiperRef.current.isBeginning);
        setIsEnd(swiperRef.current.isEnd);
    }

    return(
        <>
        <div className="relative flex items-center justify-self-center w-[100%] my-[3em] xl:max-w-[1200px] 2xl:max-w-[1800px]">
            <div className="w-[20%] sm:w-[30%] lg:w-[10%] flex justify-center">
                <ChevronLeft size={30} onClick={() => prev()} className= {`${isBeginning ? "invisible" : "block"} cursor-pointer`} />
            </div>
            <Swiper 
                breakpoints={{
                    320: {slidesPerView: 1, spaceBetween: 200},
                    768: {slidesPerView: 2, spaceBetween: 100},
                    1024: {slidesPerView: 3, spaceBetween: 100},
                }}
                allowTouchMove={false}
                onSwiper={(Swiper) => {swiperRef.current = Swiper}}
                onSlideChange={() => updateChange()}>
                {competitions.map((competition) => (    
                    <SwiperSlide className='flex flex-col items-center'>
                        <div className="overflow-hidden h-[20vh] max-h-[180px] w-[100%] lg:aspect-[7.5/3.5] lg:h-auto border bg-white">
                            <img src="image_placeholder.jpeg" className="h-[100%] w-[100%] object-center object-cover" />
                        </div>
                        <div className="flex flex-col text-[0.7rem] text-white text-center bg-[#DD3833] items-center p-3 w-full">
                            <p>Name: {competition.title}</p>
                            <p>Category: {competition.category}</p>
                            <p>Date: {competition.date}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="w-[20%] sm:w-[30%] lg:w-[10%] flex justify-center">
                <ChevronRight size={30} onClick={() => next()} className={`${isEnd ? "invisible": "block"} cursor-pointer`} />
            </div>
        </div>
        </>
    );
}
