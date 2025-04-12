import React, { useContext, useEffect, useState } from 'react'
import { SecheduleList } from '../../components/ScheduleList';
import { UpcomingCompetitionsList } from '../../components/UpcomingCompetitionsList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserData } from '../../components/UserData';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { EditAccount } from '@/components/EditAccount';
import { AppContent } from '@/context/AppContext';

const HomePage = () => {
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
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  //userData isinya ada apa aja, silakan lihat ke userController.js ~
  const {userData, socket, initializeSocket} = useContext(AppContent);
  useEffect(() => {
      if (!userData || !userData.id) return; 

      if (!socket) {
          console.log("🔄 Initializing socket...");
          initializeSocket(userData.id);
      }
  }, [userData]);
  
  //berikut adalah isi dari participant field dari userData
  // MandarinName: { type: String },
  // DOB: { type: Date },
  // Gender: { type: String },
  // Address: { type: String },
  // Institution: { type: String },
  // StudentCardPhoto: { type: String },

  const [userName, setUsername] = useState(userData.name)
  const [mandarinName, setMandarinName] = useState(userData.participant.MandarinName)

  //yang di bawah ini, silakan lanjutkan :D
  const [email, setEmail] = useState("Santoso@gmail.com")
  const [dateOfBirth, setDateOfBirth] = useState("2002-01-02");
  const [gender, setGender] = useState("Male");
  const [address, setAddress] = useState("123 Main Street, Jakarta, Indonesia");
  const [phoneNumber, setPhoneNumber] = useState("+ 62 812-3456-7890");
  const [institution, setInstitution] = useState("Binus University");
  const [studentCardUrl, setStudentCardUrl] = useState('https://indonesia.travel/content/dam/indtravelrevamp/home-revamp/bali-jack.jpg')

  return (
    <>
      <div className='mt-[7em] text-center flex flex-col justify-center sm:text-start sm:ml-[4em]'>
        <p className='font-kanit mx-auto text-3xl font-medium'>Dashboard</p>
        <p className='font-poppins mx-auto text-[#7D7979] text-xl'>{new Date().toDateString()}</p>
        <p className='font-poppins mx-auto text-lg mt-[1em]'>Welcome Back, {userName}!</p>
      </div>


      <div className="flex flex-col mt-4 md:mt-0 w-[95%] sm:w-[80%] md:w-[70%] mx-auto p-[2em] sm:p-[3em] xl:max-w-[1200px] 2xl:max-w-[1800px]">
        {/* User Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Left Section: Icon + Text */}
          <div className="flex items-center gap-4">
            {/* User Icon */}
            <div className="bg-gray-500 rounded-full h-fit w-fit py-3 px-4 flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-gray-900 text-[1.5em]" />
            </div>

            {/* User Info */}
            <div className="flex flex-col">
              <p className="font-semibold font-kanit text-2xl">{userName}</p>
              <p className="font-poppins text-lg mt-1">{email}</p>
            </div>
          </div>

          {/* Button - Moves below on small screens */}
          <div className="mt-4 sm:mt-0 sm:ml-auto flex sm:justify-end">
            <button
              className="bg-red-600 rounded-md hover:!bg-red-700 duration-200 text-white cursor-pointer py-2 px-4 flex items-center gap-2 shadow-md ease transition font-poppins font-semibold"
              onClick={() => setIsEditingAccount(true)}
            >
              <FontAwesomeIcon icon={faEdit} />
              Change
            </button>
          </div>
        </div>

        {/* User Data */}
        <UserData
          name={userName}
          mandarinName={mandarinName}
          DOB={dateOfBirth}
          gender={gender}
          fullAddress={address}
          phoneNumber={phoneNumber}
          email={email}
          institution={institution}
          studentCardUrl={studentCardUrl}
        />
      </div>


      
      <div className='bg-[#F4F4F4] w-[100%] mt-[2.5em] flex justify-center items-center relative'>
        <div className='bg-[#FFFFFF] w-[90%] md:w-[70%] shadow-xl rounded-[20px] py-6 my-[3em] xl:max-w-[1200px] 2xl:max-w-[1800px]'>
          <p className='font-kanit text-3xl font-medium sm:ml-25 justify-self-center mt-2 md:mt-6 pb-[0.5em] sm:justify-self-start'>Schedule</p>
          <div className={`h-[70vh] min-h-[200px] max-h-[300px] xl:max-h-[500px] overflow-auto sm:mx-[2em] mb-5`} style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
            {sortedCompetitions.length > 0 ? sortedCompetitions.map((competition, index) => (
              <SecheduleList competition={competition} key={index} />
            )) : (
              <p className='font-poppins text-[#818181] '>-- No Upcoming Competitions --</p>
            )}
          </div>
        </div>
      </div>
      

      {/* <p className='font-kanit text-[1.4rem] ml-[3em] mt-[3em] font-medium'>Upcoming Competitions</p>
      <UpcomingCompetitionsList competitions={upcomingCompetitions} /> */}
      { isEditingAccount && 
        <EditAccount isOpen={isEditingAccount} setIsOpen = {setIsEditingAccount}
        userName={userName} mandarinName={mandarinName} email={email} dateOfBirth={dateOfBirth} gender={gender} address={address} phoneNumber={phoneNumber} institution={institution}
        setUsername={setUsername} setMandarinName={setMandarinName} setEmail={setEmail} setDateOfBirth={setDateOfBirth} setGender={setGender} setAddress={setAddress} setPhoneNumber={setPhoneNumber} setInstitution={setInstitution}
        studentCardUrl={studentCardUrl} setStudentCardUrl={setStudentCardUrl} />
      }
    </>
  )
}
export default HomePage