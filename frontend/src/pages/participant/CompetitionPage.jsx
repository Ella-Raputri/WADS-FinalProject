import React, { useContext, useEffect } from 'react'
import { CompetitionInfo } from '../../components/CompetitionInfo';
import { useState } from 'react';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CompetitionPage = ({}) => {
  const [competitions, setCompetitions] = useState([]);
  const {backendUrl, userData, socket, initializeSocket} = useContext(AppContent);

  const fetchComps = async()=>{
    try {
      const response = await axios.get(backendUrl+'api/competition/getAllCompetitions');
      if(response.data.success){
        setCompetitions(response.data.comps);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);  // This is for 400/401/500 errors
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    }    
  }

  useEffect(() => {
        if (!userData || !userData.id) return; 
  
        if (!socket) {
            console.log("🔄 Initializing socket...");
            initializeSocket(userData.id);
        }
    }, [userData]);

    useEffect(()=>{
        fetchComps();
    }, [backendUrl])

    useEffect(()=>{
      if(!userData) AOS.init()
    },[])


  if (competitions.length !== 0){ 
    return(
      <div className="pb-10">
          {competitions.map((competition, index) => (
            <CompetitionInfo competition={competition} key={index} isFirst={index===0} userData={userData}/>
      ))}
      </div>
    );
  } else {
    return(
      <div className="w-[100%] h-[92vh] flex justify-center items-center">
        <p className='justify-self-center font-poppins self-center text-[#818181]'>-- No Upcoming Competitions --</p>
      </div>
    );
  }
}


export default CompetitionPage;