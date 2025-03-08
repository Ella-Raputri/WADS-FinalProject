import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();

  const goToCompete = () => {
    navigate('/usercomp');
  };


  return (
    <>
      <section className="relative w-full flex flex-col items-center text-center py-10 overflow-hidden pb-0 mb-0">
        {/* Background Images */}
        <div className="relative w-full flex justify-center">
        <img 
            src="src/assets/welcome_page/light3.png" 
            alt="Light3" 
            id="light3"
            className="absolute top-30 left-[50%] h-80 sm:left-[55%] md:h-100 xl:top-45 xl:h-120 xl:left-[58%]" 
          />
          <img 
            src="src/assets/welcome_page/light2.png" 
            alt="Light2" 
            id='light2'
            className="absolute top-30 left-[36%] h-80 sm:left-[40%] md:h-100 lg:left-[44%] xl:top-45 xl:h-120" 
          />
          <img 
            src="src/assets/welcome_page/light1.png" 
            alt="Light1" 
            id='light1'
            className="absolute top-30 -left-[10%] h-80 sm:left-[8%] md:h-100 lg:left-[15%] xl:top-45 xl:h-120" 
          />
          <img
            src="src/assets/welcome_page/flower.png"
            alt="Flower Left"
            id='flower_left'
            className="absolute z-10 top-3 left-0 w-35 sm:w-50 md:w-60 lg:w-70 xl:w-80 2xl:w-90"
          />
          <img
            src="src/assets/welcome_page/flower2.png"
            alt="Flower Right"
            id='flower_right'
            className="absolute top-3 right-0 w-35 sm:w-50 md:w-60 lg:w-70 xl:w-80 2xl:w-90"
          />
          <img
            src="src/assets/welcome_page/tower.png"
            alt="Tower"
            id='tower'
            className="absolute top-70 left-30 w-14 sm:w-16 sm:top-60 md:w-18 lg:w-21 lg:left-35 lg:top-55 xl:w-25 xl:top-60 xl:left-42 2xl:w-30 2xl:top-65 2xl:left-45"
          />
          <img
            src="src/assets/welcome_page/temple.png"
            alt="Temple"
            id='temple'
            className="absolute top-82 -left-15 w-65 sm:w-70 sm:top-78 sm:-left-20 md:w-78 md:-left-22 md:top-80 lg:w-90 lg:-left-26 xl:w-110 xl:-left-30 xl:top-88 2xl:w-130 2xl:-left-35 2xl:top-95"
          />
          <img
            src="src/assets/welcome_page/ferris.png"
            alt="Ferris Wheel"
            id='ferris'
            className="absolute top-60 left-3/4 w-70 sm:w-73 sm:top-54 md:w-83 md:left-140 lg:left-3/4 lg:w-92 xl:w-110 2xl:w-130 2xl:top-50"
          />
          <img
            src="src/assets/welcome_page/buildings.png"
            alt="Buildings"
            id='buildings'
            className="absolute top-83 left-3/5 w-130 sm:w-135 sm:top-80 md:w-160 md:top-81 md:left-105 lg:w-180 lg:left-1/3 xl:w-215 xl:left-5/12 xl:top-94 2xl:w-250 2xl:left-1/3 2xl:top-100 object-cover"
          />
          <img
            src="src/assets/welcome_page/palace.png"
            alt="Palace"
            id='palace'
            className="absolute top-98 left-30 w-82 sm:w-88 sm:top-94 md:w-110 md:top-95 md:left-20 lg:w-122 lg:left-30 lg:top-98 xl:w-145 xl:left-35 xl:top-113 2xl:w-170 2xl:left-40 2xl:top-120"
          />     
        </div>

        {/* Text & Button */}
        <div className="relative z-15 mt-24 sm:mt-16">
          <h1 className="color-text-red font-extrabold text-6xl sm:text-7xl md:text-8xl xl:text-9xl 2xl:text-10xl font-raleway p-5 pb-3">
            NMC
          </h1>
          <p className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl color-text-red">
            RELEASE YOUR POTENTIAL AND CLAIM YOUR GLORY!
          </p>
          <button
            className="mx-auto mt-6 bg-red-800 text-white font-bold py-3 px-6 rounded-lg text-sm sm:text-base xl:text-lg 2xl:text-xl hover:bg-red-700 transition"
            onClick={goToCompete}
          >
            Join and Compete
          </button>
        </div>
        
      <img
        src="src/assets/welcome_page/ground.png"
        alt="Ground"
        className='w-full z-20 h-10 mt-47 sm:mt-55 lg:mt-65 lg:h-16 xl:h-18 xl:mt-75 2xl:mt-90'
      /> 
      </section>

      <div className="flex items-center justify-center min-h-screen md:min-h-[60vh] color-component-cream -translate-y-4">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center p-8">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 font-kanit">ABOUT US</h2>
            <p className="text-gray-700 mb-4 font-poppins">
              NMC (National Mandarin Competition) is one of the events held by BNMC
              (BINUS Mandarin Club) with the goal of improving one's Chinese skills,
              and to preserve Chinese culture.
            </p>
            <p className="text-gray-700 font-poppins">
              NMC's theme “Bridging Generations With Chinese Culture” hopes that
              NMC can be a bridge that connects people from different generations to
              support the preservation and introduction of Chinese culture towards
              society.
            </p>
          </div>
          <div className="md:w-2/5 md:pl-8 mt-6 md:mt-0">
            <img src="src/assets/welcome_page/architecture.png" alt="Chinese Architecture" className="w-full rounded-lg shadow-md" />
          </div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen mt-70">
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Dummy Page</h1>
          <p className="text-gray-700 text-lg text-center">
            This page is filled with placeholder content to test the footer positioning.
          </p>

          {/* Dummy Content with Scroll */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="p-6 border rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Section {index + 1}</h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vehicula justo at eros ultricies, nec tincidunt justo consequat.
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default WelcomePage;