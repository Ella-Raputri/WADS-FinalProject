import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import '../carousel.css';
import { Navigation} from 'swiper/modules';
import AOS from 'aos';
import 'aos/dist/aos.css';
import junior_singing from '../assets/junior_singing.png';
import senior_singing from '../assets/senior_singing.png';
import storytelling from '../assets/storytelling.png';
import speech from '../assets/speech.png';
import poster_design from '../assets/poster_design.png';
import dubbing from '../assets/dubbing.png';

export default function Carousel() {
  const slides = [
    { title: "Junior Singing", image: junior_singing },
    { title: "Senior Singing", image: senior_singing },
    { title: "Storytelling", image: storytelling },
    { title: "Speech", image: speech },
    { title: "Poster Design", image: poster_design },
    { title: "Dubbing", image: dubbing },
  ];

  useEffect(()=>{
    AOS.init()
  },[])

  return (
    <div className="relative w-3/4 h-full mx-auto" data-aos="fade-up" data-aos-duration="3000">
      <Swiper
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 }, // Phones
          768: { slidesPerView: 2, spaceBetween: 20 }, // Tablets
          1024: { slidesPerView: 3, spaceBetween: 30 }, // Desktops
        }}
        loop={true}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        modules={[Navigation]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="relative flex flex-col items-center justify-center">
            <img src={slide.image} alt={slide.title} className="mt-4 p-10 object-cover rounded-lg" />
            
            <h3 className="mt-2 text-center text-2xl font-poppins text-white font-semibold mb-4">
              {slide.title}
            </h3>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="swiper-button-prev"></div>
      <div className="swiper-button-next"></div>
    </div>
  );
}
