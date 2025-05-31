import React, { useContext, useEffect, useState } from 'react'
import { SecheduleList } from '../../components/ScheduleList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserData } from '../../components/UserData';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { EditAccount } from '@/components/EditAccount';
import { AppContent } from '@/context/AppContext';
import { convertToTimeZone } from '@/lib/utils';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const {userData, backendUrl, socket, initializeSocket} = useContext(AppContent);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);

  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const [userName, setUsername] = useState('')
  const [mandarinName, setMandarinName] = useState('')
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [institution, setInstitution] = useState('');
  const [studentCardUrl, setStudentCardUrl] = useState('')

  // fetch competition details
  const fetchCompetitions =async()=>{
    try {
      const {data} =await axios.get(backendUrl+'api/competitionRegistration/userRegistrations');
      if(data.success){
        setUpcomingCompetitions(data.result);
      }
    } catch (error) {
      console.error(error.response.data);
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
      if (!userData || !userData.id) return; 

      if(!userData.phone) {
        navigate('/completeinfo');
        return;
      }

      if (!socket) {
          initializeSocket(userData.id);
      }    
      setUsername(userData.name);
      setMandarinName(userData.participant.MandarinName);
      setEmail(userData.email);
      setDateOfBirth(convertToTimeZone(userData.participant.DOB).substring(0, 10));
      setGender(userData.participant.Gender);
      setAddress(userData.participant.Address);
      setPhoneNumber(userData.phone);
      setInstitution(userData.participant.Institution);
      setStudentCardUrl(userData.participant.StudentCardPhoto);

      fetchCompetitions();

  }, [userData]);
  

  return (
    <>
      {/* headers */}
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

      {/* upcoming competition list */}
      <div className='bg-[#F4F4F4] w-[100%] mt-[2.5em] flex justify-center items-center relative'>
        <div className='bg-[#FFFFFF] w-[90%] md:w-[70%] shadow-xl rounded-[20px] py-6 my-[3em] xl:max-w-[1200px] 2xl:max-w-[1800px]'>
          <p className='font-kanit text-3xl font-medium sm:ml-25 justify-self-center mt-2 md:mt-6 pb-[0.5em] sm:justify-self-start'>Schedule</p>
          <div className={`h-[70vh] min-h-[200px] max-h-[300px] xl:max-h-[500px] overflow-auto sm:mx-[2em] mb-5`} style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
            {upcomingCompetitions.length > 0 ? upcomingCompetitions.map((competition, index) => (
              <SecheduleList competition={competition} key={index} />
            )) : (
              <p className='font-poppins text-[#818181] '>-- No Upcoming Competitions --</p>
            )}
          </div>
        </div>
      </div>
      
      {/* edit account pop up */}
      { isEditingAccount && 
        <EditAccount isOpen={isEditingAccount} setIsOpen = {setIsEditingAccount}
        userName={userName} mandarinName={mandarinName} dateOfBirth={dateOfBirth} gender={gender} address={address} phoneNumber={phoneNumber} institution={institution}
        studentCardUrl={studentCardUrl} />
      }
    </>
  )
}
export default HomePage