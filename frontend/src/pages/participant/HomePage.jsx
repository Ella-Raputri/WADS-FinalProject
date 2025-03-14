import React from 'react'
import { SecheduleList } from '../../components/ScheduleList';
import { UpcomingCompetitionsList } from '../../components/UpcomingCompetitionsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserData } from '../../components/UserData';

const HomePage = () => {
  let userName = "Santoso";

  let upcomingCompetitions = [
    {
      title: "Traditional Chinese Songs Singing 1", 
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
    "title": "Modern Chinese Pop Singing 2",
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
},
{
  title: "Traditional Chinese Songs Singing 3", 
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
"title": "Modern Chinese Pop Singing 4",
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
      <div className='mt-[7em] text-center sm:text-start sm:ml-[4em]'>
        <p className='font-kanit text-[1.7rem] xl:text-[2.1rem] font-medium'>Dashboard</p>
        <p className='font-poppins text-[#7D7979] text-[0.9rem] xl:text-[1.3rem]'>{new Date().toDateString()}</p>
        <p className='font-poppins text-[0.9rem] xl:text-[1.3rem] mt-[1em]'>Welcome Back, {userName}!</p>
      </div>
      <div className='flex flex-col w-[95%] sm:w-[70%] mx-auto p-[2em] sm:p-[3em] xl:max-w-[1200px] 2xl:max-w-[1800px]'>
        <div className='flex items-center gap-[15px]'>
          <div className='bg-gray-500 rounded-full h-fit w-fit py-3 px-4'>
            <FontAwesomeIcon icon={faUser} className='text-gray-900 text-[1.5em]' />
          </div>
          <div className='flex flex-col'>
            <p className='font-semibold font-kanit text-[1.5rem]'>Santoso</p>
            <p className='font-poppins text-[0.9rem]'>Santoso@gmail.com</p>
          </div>
        </div>
        <div className='flex flex-col'>
            <UserData data1="Name" data2="Santoso" margin="2em" />
            <UserData data1="Mandarin Name" data2="Xi Xi Xi"/>
            <UserData data1="Date Of Birth" data2="2002-05-15"/>
            <UserData data1="Gender" data2="Male"/>
            <UserData data1="Full Address" data2="123 Main Street, Jakarta, Indonesia"/>
            <UserData data1="Phone Number" data2="+ 62 812-3456-7890"/>
            <UserData data1="Email" data2="Santoso@gmail.com"/>
            <UserData data1="Institution" data2="Bina Nusantara"/>
        </div>
      </div>
      <div className='bg-[#F4F4F4] w-[100%] mt-[1 em] flex justify-center items-center relative'>
        <div className='bg-[#FFFFFF] w-[90%] md:w-[70%] shadow-xl rounded-[20px] my-[3em] xl:max-w-[1200px] 2xl:max-w-[1800px]'>
          <p className='font-kanit text-[1.4rem] xl:text-[1.8rem] font-medium sm:ml-[4em] justify-self-center pt-[2em] pb-[0.5em] sm:justify-self-start'>Schedule</p>
          <div className={`h-[70vh] min-h-[200px] max-h-[300px] xl:max-h-[500px] overflow-auto sm:mx-[2em] mb-5`}>
            {sortedCompetitions.length > 0 ? sortedCompetitions.map((competition) => (
              <SecheduleList competition={competition} />
            )) : (
              <p className='font-poppins text-[#818181] '>-- No Upcoming Competitions --</p>
            )}
          </div>
        </div>
      </div>
      <p></p>
      <p className='font-kanit text-[1.4rem] xl:text-[1.8rem] ml-[3em] mt-[2em] font-medium'>Upcoming Competitions</p>
      <UpcomingCompetitionsList competitions={upcomingCompetitions} />
    </>
  )
}

export default HomePage