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
      <p className='font-kanit mt-[4em] ml-[2em] text-[1.7rem] xl:text-[2.1rem] font-medium'>Dashboard</p>
      <p className='font-poppins text-[#7D7979] text-[0.9rem] xl:text-[1.3rem] ml-[3.8em]'>{new Date().toDateString()}</p>
      <p className='font-poppins text-[0.9rem] xl:text-[1.3rem] ml-[3.8em] mt-[1em]'>Welcome Back, {userName}!</p>
      <div className='flex flex-col w-[80%] md:w-[60%] mx-auto mt-[2em] gap-11 font-kanit md:flex-row md: w-[60%]'>
        <div className='w-[100%] md:w-[50%] flex flex-col gap-[30px]'>
          <div className='bg-[#DD3833] h-[50%] rounded-[15px] flex flex-col items-center justify-center min-h-[150px] pt-5 pb-5'>
            <p className='text-white font-semibold w-[80%] text-[1.1rem] xl:text-[1.5rem] text-center'>Competitions Participated</p>
            <p className='text-white font-bold text-[3rem] xl:text-[3.4rem]'>{competitionsParticipated}</p>
            <p className='text-white font-light text-[0.8rem] xl:text-[1.2rem]'>All Time</p>            
          </div>
          <div className='bg-[#DD3833] h-[50%] rounded-[15px] flex flex-col items-center justify-center min-h-[150px] pt-5 pb-5'>
            <p className='text-white font-semibold w-[80%] text-[1.1rem] xl:text-[1.5rem] text-center'>Competitions Won</p>
            <p className='text-white font-bold text-[3rem] xl:text-[3.4rem]'>{competitionsWon}</p>
            <p className='text-white font-light text-[0.8rem] xl:text-[1.2rem]'>All Time</p>            
          </div>
        </div>
        <div className='md:w-[50%] bg-[#DD3833] rounded-[15px] flex flex-col items-center justify-center min-h-[150px]   md:min-h-[330px] pt-5 pb-5'>
            <p className='text-white font-semibold text-[1.1rem] xl:text-[1.5rem] text-center w-[80%]'>Upcoming Registered Competitions</p>
            <p className='text-white font-bold text-[3rem] xl:text-[3.4rem]'>{upcomingRegisteredCompetitions}</p>
            <p className='text-white font-light text-[0.8rem] xl:text-[1.2rem]'>Competition(s)</p>            
        </div>
      </div>
      <div className='bg-[#F4F4F4] w-[100%] mt-[4em] flex justify-center items-center relative'>
        <div className='bg-[#FFFFFF] w-[90%] md:w-[70%] shadow-xl rounded-[20px] my-[2em]'>
          <p className='font-kanit text-[1.4rem] xl:text-[1.8rem] font-medium sm:ml-[4em] justify-self-center pt-[2em] pb-[0.5em] sm:justify-self-start'>Schedule</p>
          <div className={`h-[70vh] min-h-[200px] max-h-[300px] overflow-auto sm:mx-[2em] mb-5`}>
            {sortedCompetitions.length > 0 ? sortedCompetitions.map((competition) => (
              <SecheduleList competition={competition} />
            )) : (
              <p className='font-poppins text-[#818181] '>-- No Upcoming Competitions --</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage