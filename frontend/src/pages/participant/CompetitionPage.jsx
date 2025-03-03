import React from 'react'
import { CompetitionInfo } from '../../components/CompetitionInfo';
import { useState } from 'react';

const CompetitionPage = ({}) => {
  const [competitions, setCompetitions] = useState([
    {
        title: "Traditional Chinese Songs Singing", 
        category: "Singing", 
        description: "This competition's theme revolves around singing Chinese traditional songs, where the committee will decide the songs for each contestant. The contestants will be given 30 minutes to prepare themselves, before recording them singing and submit it on the submission form provided.", 
        venue: "Online Meeting",
        date: "Dec 21 - 25",
        time: "13:00 - 16:00",
        price: "150.000",
        prizepool: "1.500.000",
        rules: "Contestants must be between 16 and 20 years old.\nThe meeting link will be sent to the contestant's registered mail.\nThe usage of internet is allowed.\nUsage of any forms of AI is prohibited.\nA challenge regarding the task will be given by the competition committee.\nContestants must submit their recording through the provided submission on time. Late submissions can result in the deduction of points, or disqualification.\nRegistration fee must be paid the latest 24 hours before the competition.\nCheating, plagiarism, or the usage of unauthorized materials will result in the immediate disqualification of the contestant."
    },
    {
        title: "Traditional Chinese Songs Singing", 
        category: "Singing", 
        description: "This competition's theme revolves around singing Chinese traditional songs, where the committee will decide the songs for each contestant. The contestants will be given 30 minutes to prepare themselves, before recording them singing and submit it on the submission form provided.", 
        venue: "Online Meeting",
        date: "Dec 21 - 25",
        time: "13:00 - 16:00",
        price: "150.000",
        prizepool: "1.500.000",
        rules: "Contestants must be between 16 and 20 years old.\nThe meeting link will be sent to the contestant's registered mail.\nThe usage of internet is allowed.\nUsage of any forms of AI is prohibited.\nA challenge regarding the task will be given by the competition committee.\nContestants must submit their recording through the provided submission on time. Late submissions can result in the deduction of points, or disqualification.\nRegistration fee must be paid the latest 24 hours before the competition.\nCheating, plagiarism, or the usage of unauthorized materials will result in the immediate disqualification of the contestant."
    }
]);

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