import React from 'react'
import { CompetitionInfo } from '../../components/CompetitionInfo';
import { useState } from 'react';

const CompetitionPage = ({}) => {
  const [competitions, setCompetitions] = useState([
    {
        title: "Traditional Chinese Songs Singing", 
        category: "Singing", 
        description: "This competition's theme revolves around singing Chinese traditional songs, where the committee will decide the songs for each contestant. The contestants will be given 30 minutes to prepare themselves, before recording them singing and submit it on the submission form provided.", 
        date: "Dec 21 - 25"
    },
    {
        title: "Traditional Chinese Songs Singing", 
        category: "Singing", 
        description: "This competition's theme revolves around singing Chinese traditional songs, where the committee will decide the songs for each contestant. The contestants will be given 30 minutes to prepare themselves, before recording them singing and submit it on the submission form provided.", 
        date: "Dec 21 - 25"
    }
]);

  return (  
      <div className="pb-10">
          {competitions.map((competition, index) => (
            <CompetitionInfo competition={competition} key={index} isFirst={index===0} />
      ))}
      </div>
  );
}


export default CompetitionPage;