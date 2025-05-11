import Modal from "react-modal";
import { Button } from "./ui/button";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator, faCalendar, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import UploadImage from "./UploadImage";
import { AppContent } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export const EditAccount = ({isOpen, setIsOpen, userName, mandarinName, dateOfBirth, gender, address, phoneNumber, institution, studentCardUrl}) => {

    useEffect(() => {
        if (isOpen) {
          const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          
          document.body.style.overflow = "hidden";
          document.body.style.paddingRight = `${scrollbarWidth}px`;
      
          const navbar = document.querySelector(".navbar"); // Ensure this class is in your Navbar
          if (navbar) {
            navbar.style.paddingRight = `${scrollbarWidth}px`;
          }
        } else {
          document.body.style.overflow = "auto";
          document.body.style.paddingRight = "0px";
      
          const navbar = document.querySelector(".navbar");
          if (navbar) {
            navbar.style.paddingRight = "0px";
          }
        }
      
        return () => {
          document.body.style.overflow = "auto";
          document.body.style.paddingRight = "0px";
      
          const navbar = document.querySelector(".navbar");
          if (navbar) {
            navbar.style.paddingRight = "0px";
          }
        };
      }, [isOpen]);

    const [userNameText, setUserNameText] = useState(userName);
    const [mandarinNameText, setMandarinNameText] = useState(mandarinName);
    const [dateOfBirthText, setDateOfBirthText] = useState(() => {
        if (dateOfBirth) {
            const [day, month, year] = dateOfBirth.split('-'); // Split DD-MM-YYYY
            return `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
        }
        return ''; // Default to empty if no dateOfBirth is provided
    });
    const [genderText, setGenderText] = useState(gender);
    const [addressText, setAddressText] = useState(address);
    const [phoneNumberText, setPhoneNumberText] = useState(phoneNumber);
    const [institutionText, setInstitutionText] = useState(institution);
    const [image, setImage] = useState(studentCardUrl);
    const [imageName, setImageName] = useState('');

    const dateInputRef = useRef(null);
    const {backendUrl, getUserData, uploadImage} = useContext(AppContent);


    const applyChanges = async() => {
        try {
            let imageUrl = '';

            if(imageName){
                const linkResult = await uploadImage(image);
                if(linkResult) imageUrl = linkResult;
            }
            
            // 3. Prepare registration data
            const registrationData = {
                fullName:userNameText, 
                mandarinName:mandarinNameText, 
                dob: dateOfBirthText, 
                gender: genderText, 
                address: addressText, 
                phone: phoneNumberText, 
                institution: institutionText, 
                studentPhotoUrl: (imageUrl? imageUrl : studentCardUrl)
            };
    
            // 4. Register user
            axios.defaults.withCredentials =true
            const { data } = await axios.put(backendUrl + 'api/user/editUserDetails', {participantDetails: registrationData});

            if(data.success) {
                getUserData();
                toast.success("Changes applied!");
                setIsOpen(false);
            } 
        } catch (error) {
            console.error("error:", error);
            toast.error(error.response?.data?.message || error.message || "Edit failed");
        }
    }

    return(
        <Modal isOpen={isOpen} onRequestClose={() => {
            setIsOpen(false);
        }} className="font-poppins lg:w-[55%] xl:w-[50%] w-[90%] p-6 pb-8 bg-white mx-auto shadow-xl relative rounded-[10px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden">
            <p className="font-kanit font-medium text-center text-2xl xl:text-3xl mx-4 mb-2">Edit Account</p>
            <span className="text-[2rem] xl:text-[2.3rem] text-gray-500 absolute top-0 right-0 mr-[1em] md:mr-[1.5em] mt-[0.4em] hover:text-gray-600 cursor-pointer" onClick={() => {setIsOpen(false);}}> <FontAwesomeIcon icon={faTimes}/> </span>

            <div className="max-h-120 px-3 md:px-10 flex flex-col overflow-y-auto w-[100%]" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
                <div className="grid grid-cols-[auto] lg:max-h-none sm:grid-cols-[auto_1fr] gap-y-[0.5em] md:gap-y-6 gap-x-[1.5em] mt-[2em] w-full">
                    <p>Name:</p>
                    <input type="text" className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2" value={userNameText} onChange={(e) => {setUserNameText(e.target.value)}} />
                    <p>Mandarin Name:</p>
                    <input type="text" className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2" value={mandarinNameText} onChange={(e) => {setMandarinNameText(e.target.value)}} />
                    
                    <p>Date of Birth:</p>
                    <div className="relative w-full">
                        <input
                            type="date"
                            className="bg-white w-full placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2" 
                            value={dateOfBirthText} 
                            onChange={(e) => {setDateOfBirthText(e.target.value)}}
                            ref={dateInputRef}
                        />
                        <button
                            type="button"
                            className="absolute right-2 cursor-pointer hover:text-gray-600 top-2 text-gray-500 w-5 h-5 calendardate"
                            onClick={() => dateInputRef.current?.showPicker()}
                        >
                            <FontAwesomeIcon icon={faCalendar} />
                        </button>
                        </div>
                    
                    
                    <p>Gender:</p>
                    <select
                        id="gender"
                        value={genderText}
                        onChange={(e) => {setGenderText(e.target.value)}}
                        className="w-full font-poppins bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    
                    <p>Full Address:</p>
                    <input type="text" className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2" value={addressText} onChange={(e) => {setAddressText(e.target.value)}} />
                    <p>Phone Number:</p>
                    <input type="text" className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2" value={phoneNumberText} onChange={(e) => {setPhoneNumberText(e.target.value)}} />
                    <p>Institution:</p>
                    <input type="text" className="bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 pr-2 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2" value={institutionText} onChange={(e) => {setInstitutionText(e.target.value)}} />
                
                    {/* Image Upload Section */}
                    <p>Student Card:</p>
                    <div className='flex flex-col gap-2'>
                        <UploadImage inputId={'img-upload'} image={image} imageName={imageName} setImage={setImage} setImageName={setImageName} />
                    </div>
                </div>
                <button className='bg-red-600 shadow-md mt-8 mb-8 transition ease duration-200 rounded-md hover:!bg-red-700 text-white cursor-pointer py-2 px-3 w-fit mx-auto font-poppins font-semibold text-sm' onClick={() => {applyChanges()}}>Save Changes</button>
            </div>
        </Modal>
    );
}