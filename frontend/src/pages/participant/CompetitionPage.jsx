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
        rules: "Contestants must be between 16 and 20 years old.\nThe meeting link will be sent to the contestant's registered mail.\nThe usage of internet is allowed.\nUsage of any forms of AI is prohibited.\nA challenge regarding the task will be given by the competition committee.\nContestants must submit their recording through the provided submission on time. Late submissions can result in the deduction of points, or disqualification.\nRegistration fee must be paid the latest 24 hours before the competition.\nCheating, plagiarism, or the usage of unauthorized materials will result in the immediate disqualification of the contestant.",
        startDate: new Date(2025, 11, 21),
        endDate: new Date(2025, 11, 25)
    },
    {
      "title": "Modern Chinese Pop Singing",
      "category": "Singing",
      "description": "This competition focuses on singing modern Chinese pop songs. Contestants can choose from a pre-approved song list provided by the committee. They will have 45 minutes to practice before recording and submitting their performance through the designated submission form.",
      "venue": "Online Submission",
      "date": "Jan 10 - 15",
      "time": "14:00 - 17:00",
      "price": "100.000",
      "prizepool": "2.000.000",
      "rules": "Contestants must be between 15 and 22 years old.\nThe official song list will be provided upon registration.\nThe use of internet resources for practice is permitted.\nAny use of AI-assisted vocals or enhancements is strictly prohibited.\nContestants must submit their recordings by the specified deadline; late submissions may lead to point deductions or disqualification.\nThe registration fee must be paid at least 48 hours before the competition starts.\nPlagiarism, cheating, or using unauthorized backing tracks will result in immediate disqualification.",
      startDate: new Date(2026, 0, 10),
      endDate: new Date(2026, 0, 15)
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