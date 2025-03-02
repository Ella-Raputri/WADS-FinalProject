import React from 'react'
import {  useNavigate } from 'react-router-dom'

const WelcomePage = () => {
  const navigate = useNavigate();

  const goToCompete = () => {
    navigate('/usercomp');
  }

  return (
    <>
    <section className="relative w-full flex flex-col items-center text-center py-10 h-screen overflow-hidden">
      {/* Background Images */}
      <div className="relative w-full flex justify-center">
        <img src="src/assets/welcome_page/flower.png" alt="Flower Left" className="absolute top-3 left-0 w-35 sm:w-50"/>
        <img src="src/assets/welcome_page/flower2.png" alt="Flower Right" className="absolute top-3 right-0 w-35 sm:w-50" />
        <img src="src/assets/welcome_page/tower.png" alt="Tower" className="absolute top-70 left-30 w-14 sm:w-12" />
        <img src="src/assets/welcome_page/temple.png" alt="Temple" className="absolute top-82 -left-15 w-65 sm:w-56" />
        <img src="src/assets/welcome_page/ferris.png" alt="Ferris Wheel" className="absolute top-60 left-3/4 w-70 sm:w-48" />
        <img src="src/assets/welcome_page/buildings.png" alt="Buildings" className="absolute top-83 left-3/5 w-130 sm:w-56 object-cover" />
        <img src="src/assets/welcome_page/palace.png" alt="Palace" className="absolute top-97 left-30 w-82 sm:w-80" />
        {/* <img src="src/assets/welcome_page/light1.png" alt="Light1" className="absolute top-10 left-1/3 w-24 sm:w-32 " />
        <img src="src/assets/welcome_page/light2.png" alt="Light2" className="absolute top-10 right-1/3 w-24 sm:w-32 " />
        <img src="src/assets/welcome_page/light3.png" alt="Light3" className="absolute top-16 w-36 sm:w-48" /> */}
      </div>

      {/* Text & Button */}
      <div className="relative z-10 mt-24 sm:mt-16">
        <h1 className="drop-shadow-[0px_-8px_1px_#dd910a85] color-text-red font-extrabold text-6xl sm:text-7xl md:text-8xl font-raleway p-5 pb-3">
          NMC
        </h1>
        <p className="text-lg sm:text-xl color-text-red">
          RELEASE YOUR POTENTIAL AND CLAIM YOUR GLORY!
        </p>
        <button
          className="mx-auto mt-6 bg-red-800 text-white font-bold py-3 px-6 rounded-lg text-sm sm:text-base hover:bg-red-700 transition"
          onClick={goToCompete}
        >
          Join and Compete
        </button>
      </div>
    </section>

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
}

export default WelcomePage