import React, { useContext, useEffect } from 'react'
import { CompetitionInfo } from '../../components/CompetitionInfo';
import { useState } from 'react';
import { AppContent } from '@/context/AppContext';

const CompetitionPage = ({}) => {
  const [competitions, setCompetitions] = useState([]);
  const {userData, socket, initializeSocket} = useContext(AppContent);

  useEffect(() => {
        if (!userData || !userData.id) return; 
  
        if (!socket) {
            console.log("🔄 Initializing socket...");
            initializeSocket(userData.id);
        }
        fetch("http://localhost:4000/api/competitionRegistration/getUpcomingCompetitions")
        .then(response => response.json())
        .then(data => setCompetitions(data))
        .catch(err => {
          console.log(err);
        })
    }, [userData]);

  if (competitions.length !== 0){ 
    return(
      <div className="pb-10">
          {competitions.map((competition, index) => (
            <CompetitionInfo competition={competition} key={index} isFirst={index===0} />
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