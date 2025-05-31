import React, { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import InputField from '@/components/InputField';
import UploadImage from '@/components/UploadImage';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

function CompleteInfoPage() {
    const [formData, setFormData] = useState({
        mandarinName: "",
        dob: "",
        gender: "",
        address: "",
        phone: "",
        institution: "",
    });
    const [image, setImage] =useState(null);
    const [imageName, setImageName] =useState("");
    const [loading, setLoading] = useState(false);
    const {backendUrl, setIsLoggedIn, setUserData, cleanupSocket, uploadImage, getUserData, userData} = useContext(AppContent);

    const dobRef = useRef(null);
    const mandarinNameRef = useRef(null);
    const addressRef = useRef(null);
    const phoneRef = useRef(null);
    const institutionRef = useRef(null);
    const genderRef = useRef(null);
    const navigate = useNavigate();

    // if user data is completed, redirect to home page
    useEffect(() => {
        if (userData && userData.phone) {
            navigate('/userhome');
        }
    }, [userData]);
    
    //submit handler
    const handleSubmitInfo = async(e)=>{
        e.preventDefault();
        if(!userData) return;

        setLoading(true);
        if(!image){
            toast.error("Please upload your student card photo.")
            setLoading(false)
            return
        }

        try {
            const linkResult = await uploadImage(image);
            const registrationData = {
                ...formData,
                studentPhotoUrl: linkResult,
                fullName: userData.name
            };
    
            axios.defaults.withCredentials =true
            const { data } = await axios.put(backendUrl + 'api/user/editUserDetails', {participantDetails: registrationData});
            if(data.success) {
                await getUserData();
                toast.success("Changes applied!");
            } 

        } catch (error) {
            console.error("error:", error);
            toast.error(error.response?.data?.message || error.message || "Edit failed");
        }
        setLoading(false);
    }

    // change handler for each field
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    // press enter to next field
    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
        e.preventDefault();
        nextRef?.current?.focus();
        }
    };

    // logout function
    const logOut = async() => {
        try {
            const {data} =await axios.post(backendUrl+'api/auth/logout')
            if(data.success){
                setIsLoggedIn(false)
                setUserData(null)
                cleanupSocket()
                toast.success(data.message)
                navigate('/')
            }

        } catch (error) {
            console.error(error.message)
        }
    }

  return (
    <div
      className="relative z-1000 flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8 font-poppins"
      style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

      <button
        className="bg-white absolute top-8 left-8 z-1000 text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
        onClick={logOut} data-testid='logout'
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        
        {/* header */}
        <div className="bg-red-600 p-6 text-white text-center">
          <p className="mb-3 font-kanit text-3xl font-medium">Complete Registration Info</p>
          <p className="mb-3 text-md font-poppins">
            Complete your information before proceeding in the website. 
          </p>
        </div>

        {/* inputs */}
        <div className="p-6">
            <form onSubmit={handleSubmitInfo} className="space-y-6">
            <InputField
              id="mandarinName"
              type="text"
              value={formData.mandarinName}
              onChange={handleChange}
              placeholder="Chinese characters or -"
              ref={mandarinNameRef}
              onKeyDown={(e) => handleKeyDown(e, addressRef)}
            />
            <InputField
              id="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your address"
              ref={addressRef}
              onKeyDown={(e) => handleKeyDown(e, phoneRef)}
            />
            <InputField
              id="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Starts with +628XX or 08XX"
              ref={phoneRef}
              onKeyDown={(e) => handleKeyDown(e, institutionRef)}
            />
            <InputField
              id="institution"
              type="text"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Your institution"
              ref={institutionRef}
              onKeyDown={(e) => handleKeyDown(e, dobRef)}
            />

              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Date of Birth</p>
              <div className="w-full relative">
                <input
                  type="date"
                  name="dob"
                  data-testid='dob'
                  id="dob"
                  className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                  value={formData.dob}
                  onChange={handleChange}
                  ref={dobRef}
                  onKeyDown={(e) => handleKeyDown(e, genderRef)}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1 text-gray-500 w-5 h-5"
                  onClick={() => dobRef.current?.showPicker()}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                </button>
              </div>
              
              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Gender</p>
              <select
                id="gender"
                data-testid='gender'
                value={formData.gender}
                onChange={handleChange}
                ref={genderRef}
                className="w-full font-poppins bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              
              <label htmlFor='student-card-upload-complete' className="block font-poppins text-md xl:text-lg mb-2 font-semibold mt-2">Upload Student Card</label>
              <UploadImage image={image} setImage={setImage} imageName={imageName} setImageName={setImageName} inputId={'student-card-upload-complete'}/>
            
            {/* submit button */}
            <div className="flex justify-center mt-10">
              <button type="submit" 
              className={`${loading? 'cursor-not-allowed': 'cursor-pointer'} px-15 transition ease duration-150 rounded-md bg-red-600 py-2 text-lg text-white hover:bg-red-700 shadow-md font-semibold focus:outline-none`}>
                {loading? 
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                :'Submit'}
                </button>
            </div>
            </form>          
        </div>
      </div>
    </div>
  )
}

export default CompleteInfoPage