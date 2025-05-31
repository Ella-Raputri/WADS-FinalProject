import React, { useContext, useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Tassle from '../components/Tassle';
import { AppContent } from '@/context/AppContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import light1 from '../assets/welcome_page/light1.png';
import light2 from '../assets/welcome_page/light2.png';
import light3 from '../assets/welcome_page/light3.png';
import flower from '../assets/welcome_page/flower.png';
import flower2 from '../assets/welcome_page/flower2.png';
import tower from '../assets/welcome_page/tower.png';
import temple from '../assets/welcome_page/temple.png';
import ferris from '../assets/welcome_page/ferris.png';
import buildings from '../assets/welcome_page/buildings.png';
import palace from '../assets/welcome_page/palace.png';
import ground from '../assets/welcome_page/ground.png';
import architecture from '../assets/welcome_page/architecture.png';
import decor from '../assets/welcome_page/decor.png';
import decor2 from '../assets/welcome_page/decor2.png';

const WelcomePage = () => {
  const navigate = useNavigate();
  const competitionRef = useRef(null);
  const [animateCompetition, setAnimateCompetition] = useState(false);

  const {isLoggedIn, userData} = useContext(AppContent);

  useEffect(()=>{ //initialize animation on scroll
    AOS.init()
  }, [])

  // if the user is logged in
  useEffect(()=>{
    if(isLoggedIn){
      if(userData.role === 'admin') navigate('/admindashboard') //redirect to dashboard if admin
      else if(userData.role === 'participant') navigate('/userhome') //redirect to home if participant
    }
  }, [isLoggedIn, userData])

  useEffect(() => {
    //observer to see whether the user already starting to view the competitions
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAnimateCompetition(entry.isIntersecting); //if yes, animate
      },
      { threshold: 0.4 } 
    );

    if (competitionRef.current) {
      observer.observe(competitionRef.current);
    }

    return () => {
      if (competitionRef.current) {
        observer.unobserve(competitionRef.current);
      }
    };
  }, []);

  const goToCompete = () => {
    navigate('/usercomp');
  };

  //references for the moving elements 
  const light1Ref = useRef(null);
  const light2Ref = useRef(null);
  const light3Ref = useRef(null);
  const leftFlowerRef = useRef(null);
  const rightFlowerRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => { //when user scrolls
      let value = window.scrollY;

      //move/animate the text and images (parallax scrolling)
      if (descRef.current) {
        descRef.current.style.top = value * 2.1 + 'px';
      }
      if (leftFlowerRef.current) {
        leftFlowerRef.current.style.top = value * -1.0 + 'px';
        leftFlowerRef.current.style.left = value * 1.0 + 'px';
      }
      if (rightFlowerRef.current) {
        rightFlowerRef.current.style.top = value * -1.0 + 'px';
        rightFlowerRef.current.style.right = value * 1.0 + 'px';
      }

      //set the light to fade if user scrolls down
      const fadeValue = Math.max(0, 1 - value/200); 
      if(light1Ref.current){
        light1Ref.current.style.opacity = fadeValue; 
      }
      if(light2Ref.current){
        light2Ref.current.style.opacity = fadeValue; 
      }
      if(light3Ref.current){
        light3Ref.current.style.opacity = fadeValue; 
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* First section: the parallax scrolling opening part */}
      <section className="relative w-full flex flex-col items-center text-center py-10 overflow-hidden pb-0 mb-0">
        {/* Background Images */}
        <div className=" relative w-full flex justify-center">
        <img 
            src={light3}
            alt="Light3" 
            ref={light3Ref}
            className="absolute z-2 top-30 left-[50%] h-80 sm:left-[55%] md:h-100 xl:top-45 xl:h-120 xl:left-[58%]" 
          />
          <img 
            src={light2}
            alt="Light2" 
            ref={light2Ref}
            className="absolute z-2 top-30 left-[36%] h-80 sm:left-[40%] md:h-100 lg:left-[44%] xl:top-45 xl:h-120" 
          />
          <img 
            src={light1}
            alt="Light1" 
            ref={light1Ref}
            className="absolute z-2 top-30 -left-[10%] h-80 sm:left-[8%] md:h-100 lg:left-[15%] xl:top-45 xl:h-120 xl:left-[18%] 2xl:left-[20%]" 
          />
          <img
            src={flower}
            alt="Flower Left"
            ref={leftFlowerRef}
            className="absolute z-10 top-3 left-0 w-35 sm:w-50 md:w-60 lg:w-70 xl:w-80 2xl:w-90"
          />
          <img
            src={flower2}
            alt="Flower Right"
            ref={rightFlowerRef}
            className="absolute z-10 top-3 right-0 w-35 sm:w-50 md:w-60 lg:w-70 xl:w-80 2xl:w-90"
          />
          <img
            src={tower}
            alt="Tower"
            className="absolute z-10 top-80 left-30 w-14 sm:w-16 sm:top-80 md:w-18 lg:w-21 lg:left-35 lg:top-55 xl:w-25 xl:top-60 xl:left-45 2xl:w-30 2xl:top-65 2xl:left-55"
          />
          <img
            src={temple}
            alt="Temple"
            className="absolute z-10 top-92 -left-15 w-65 sm:w-70 sm:top-78 sm:-left-20 md:w-78 md:-left-22 md:top-80 lg:w-90 lg:-left-26 xl:w-110 xl:-left-30 xl:top-88 2xl:w-130 2xl:-left-35 2xl:top-95"
          />
          <img
            src={ferris}
            alt="Ferris Wheel"
            className="absolute z-10 top-60 left-3/4 w-70 sm:w-73 sm:top-54 md:w-83 md:left-140 lg:left-3/4 lg:w-92 xl:w-110 2xl:w-130 2xl:top-55"
          />
          <img
            src={buildings}
            alt="Buildings"
            className="absolute z-10 top-83 left-3/5 w-130 sm:w-135 sm:top-80 md:w-160 md:top-81 md:left-105 lg:w-180 lg:left-1/3 xl:w-215 xl:left-5/12 xl:top-94 2xl:w-260 2xl:left-[42%] 2xl:top-100 object-cover"
          />
          <img
            src={palace}
            alt="Palace"
            className="absolute z-10 top-98 left-30 w-82 sm:w-88 sm:top-94 md:w-110 md:top-95 md:left-20 lg:w-122 lg:left-30 lg:top-98 xl:w-145 xl:left-35 xl:top-113 2xl:w-170 2xl:left-50 2xl:top-120"
          />     
        </div>

        {/* Text & Button */}
        <div className="relative z-5 mt-24 sm:mt-16" ref={descRef}>
          <h1 className="text-red-600 font-extrabold text-6xl sm:text-7xl md:text-8xl xl:text-9xl 2xl:text-10xl font-raleway p-5 pb-3">
            NMC
          </h1>
          <p className="font-poppins text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-red-600">
            RELEASE YOUR POTENTIAL AND CLAIM YOUR GLORY!
          </p>
          <button
            className="cursor-pointer  mx-auto mt-6 bg-red-600 duration-300 ease hover:bg-red-700 shadow-md text-white font-semibold py-3 px-6 rounded-lg text-sm sm:text-base xl:text-lg 2xl:text-xl transition font-poppins"
            onClick={goToCompete}
          >
            Join and Compete
          </button>
        </div>

        {/* the ground, also as divider between first and second section  */}
      <img
        src={ground}
        alt="Ground"
        className='w-full z-20 h-10 mt-47 sm:mt-55 lg:mt-65 lg:h-16 xl:h-18 xl:mt-75 2xl:mt-90'
      /> 
      </section>

      {/* Second section: about us */}
      <div className="flex items-center justify-center min-h-screen md:min-h-[80vh] color-component-cream -translate-y-4">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center p-8 xl:p-0" data-aos="fade-up" data-aos-duration="2000">
          <div className="md:w-1/2">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 font-kanit">ABOUT US</h2>
            <p className="text-gray-700 mb-4 font-poppins text-md lg:text-lg xl:text-xl">
              NMC (National Mandarin Competition) is one of the events held by BNMC
              (BINUS Mandarin Club) with the goal of improving one's Chinese skills,
              and to preserve Chinese culture.
            </p>
            <p className="text-gray-700 font-poppins text-md lg:text-lg xl:text-xl">
              NMC's theme “Bridging Generations With Chinese Culture” hopes that
              NMC can be a bridge that connects people from different generations to
              support the preservation and introduction of Chinese culture towards
              society.
            </p>
          </div>
          <div className="md:w-2/5 md:pl-8 mt-6 md:mt-0">
            <img src={architecture} alt="Chinese Architecture" className="w-full rounded-lg shadow-md" />
          </div>
        </div>
      </div>

      {/* Third section: competitions carousel */}
      <div ref={competitionRef} className="relative flex flex-col items-center pt-20 md:pt-30 min-h-[80vh] md:min-h-screen w-full">
        {/* the title that is animated with the decorations */}
        <motion.img 
          src={decor}
          alt="left decor" 
          initial={{ x: "50%", opacity: 1 }}
          animate={animateCompetition ? { x: "-100%", opacity: 0 } : { x: "50%", opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute left-1/2 top-[18%] sm:top-[15%] md:top-[20%] xl:top-[15%] transform -translate-x-full -translate-y-1/2 w-12 md:w-16"
        />
        <motion.h1 
          className="text-3xl lg:text-4xl font-bold font-kanit mb-8 lg:mb-15"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={animateCompetition ? { opacity: 1, scale: 1 } :  { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.2, delay: 0.7, ease: "easeOut" }}
        >
          COMPETITIONS
        </motion.h1>
        <motion.img 
          src={decor2}
          alt="right decor" 
          initial={{ x: "-50%", opacity: 1 }}
          animate={animateCompetition ? { x: "100%", opacity: 0 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute right-1/2 top-[18%] sm:top-[15%] md:top-[20%] xl:top-[15%] transform translate-x-full -translate-y-1/2 w-12 md:w-16"
        />

        {/* the competition carousel */}
        <Carousel/> 
      </div>

      {/* Fourth section: contact us part */}
      <div className="flex flex-col items-center w-full mt-20 md:mt-10 mb-20" data-aos="flip-right">
        <div className="rounded-xl border-5 w-3/4 lg:w-1/2 text-center min-h-80 flex flex-col items-center justify-center p-4" style={{ borderColor: "#DD3833" }}>
          <h1 className="text-2xl md:text-3xl font-poppins text-black font-semibold mb-15">Contact us if you have any questions!</h1>
          <div className="flex gap-6">

          {/* redirect to instagram if contact us is clicked  */}
          <button className="font-poppins arrow-button px-4 md:px-6 py-3 border-2 border-red-600 text-red-600 font-semibold text-md md:text-lg rounded-lg hover:bg-gray-100 transition"
          onClick={()=>{window.open('https://www.instagram.com/nmcbnmc/', '_blank')}}>
            Contact Us <span className="arrow"></span>
          </button>

          {/* redirect to user help page to see FAQ */}
          <button className="font-poppins arrow-button px-4 md:px-6 py-3 bg-red-600 text-white font-semibold text-md md:text-lg rounded-lg hover:bg-red-700 transition"
          onClick={()=>(navigate('/userhelp'))}>
            See FAQ <span className="arrow"></span>
          </button>
          </div>
        </div>

        {/* Animated tassle (decoration) */}
        <Tassle/>
      </div>


    </>
  );
};

export default WelcomePage;