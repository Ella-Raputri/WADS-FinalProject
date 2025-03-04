import React from 'react'
import { SecheduleList } from '../../components/ScheduleList';
import { CompetitionPopUp } from '../../components/CompetitionPopUp';

const HomePage = () => {
  let userName = "Santoso";
  let competitionsParticipated = 10;
  let competitionsWon = 0;
  let upcomingRegisteredCompetitions = 3;
  
  let upcomingCompetitions = [
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
  ]

  let sortedCompetitions = upcomingCompetitions.sort((a, b) => a.startDate - b.startDate);
  
  return (
    <>
      <p className='font-kanit mt-[4em] ml-[2em] text-[1.7rem] font-medium'>Dashboard</p>
      <p className='font-poppins text-[#7D7979] text-[0.9rem] ml-[3.8em]'>{new Date().toDateString()}</p>
      <p className='font-poppins text-[0.9rem] ml-[3.8em] mt-[1em]'>Welcome Back, {userName}!</p>
      <div className='flex flex-col w-[80%] md:w-[60%] min-h-[60vh] h-auto mx-auto mt-[2em] gap-11 font-kanit md:flex-row md: w-[60%]'>
        <div className='w-[100%] md:w-[50%] flex flex-col gap-[30px]'>
          <div className='bg-[#DD3833] h-[50%] rounded-[15px] flex flex-col items-center justify-center max-h-[200px] pt-2 pb-2'>
            <p className='text-white font-semibold text-[1.1rem] text-center'>Competitions Participated</p>
            <p className='text-white font-bold text-[3rem]'>{competitionsParticipated}</p>
            <p className='text-white font-light text-[0.8rem]'>All Time</p>            
          </div>
          <div className='bg-[#DD3833] h-[50%] rounded-[15px] flex flex-col items-center justify-center max-h-[200px] pt-2 pb-2'>
            <p className='text-white font-semibold text-[1.1rem] text-center'>Competitions Won</p>
            <p className='text-white font-bold text-[3rem]'>{competitionsWon}</p>
            <p className='text-white font-light text-[0.8rem]'>All Time</p>            
          </div>
        </div>
        <div className='md:w-[50%] bg-[#DD3833] rounded-[15px] flex flex-col items-center justify-center max-h-[430px] pt-2 pb-2'>
            <p className='text-white font-semibold text-[1.1rem] text-center w-[80%]'>Upcoming Registered Competitions</p>
            <p className='text-white font-bold text-[3rem]'>{upcomingRegisteredCompetitions}</p>
            <p className='text-white font-light text-[0.8rem]'>Competition(s)</p>            
        </div>
      </div>
      <div className='bg-[#F4F4F4] w-[100%] h-[80vh] mt-[4em] flex justify-center items-center'>
        <div className={`bg-[#FFFFFF] w-[80%] md:w-[70%] h-[80%] shadow-xl rounded-[20px] ${sortedCompetitions.length > 0 ? "overflow-y-auto overflow-hidden" : "flex justify-center items-center relative"}`}>
          <p className={`font-kanit font-medium text-[1.4rem] mt-[2em] md:ml-[3em] text-center md:text-left ${sortedCompetitions.length > 0 ? "" : "md:absolute md:top-0 md:left-0"}`}>Schedule</p>
          {sortedCompetitions.length > 0 ? sortedCompetitions.map((competition) => (
            <SecheduleList competition={competition} />
          )) : (
            <p className='font-poppins text-[#818181] '>-- No Upcoming Competitions --</p>
          )}
        </div>
      </div>
    </>
  )
}

export default HomePage