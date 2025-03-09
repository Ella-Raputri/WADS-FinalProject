import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import '../carousel.css';
import { Navigation} from 'swiper/modules';

export default function Carousel() {
  const slides = [
    { title: "Slide 1", image: "src/assets/logo_nmc.png" },
    { title: "Slide 2", image: "src/assets/logo_nmc.png" },
    { title: "Slide 3", image: "src/assets/logo_nmc.png" },
    { title: "Slide 4", image: "src/assets/logo_nmc.png" },
  ];

  return (
    <div className="relative w-3/4 h-full mx-auto">
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
            <img src={slide.image} alt={slide.title} className="w-3/4 mt-4 object-cover rounded-lg" />
            
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
