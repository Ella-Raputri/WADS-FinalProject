import Modal from "react-modal";
import { useEffect, useState } from "react";

export const EditAccount = ({isOpen, setIsOpen, userName, mandarinName, email, dateOfBirth, gender, address, phoneNumber, institution, setUsername, setMandarinName, setEmail, setDateOfBirth, setGender, setAddress, setPhoneNumber, setInstitution}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow="hidden";
        }
        return () => {
            document.body.style.overflow="auto";
        }
    })

    const [userNameText, setUserNameText] = useState(userName);
    const [mandarinNameText, setMandarinNameText] = useState(mandarinName);
    const [emailText, setEmailText] = useState(email);
    const [dateOfBirthText, setDateOfBirthText] = useState(dateOfBirth);
    const [genderText, setGenderText] = useState(gender);
    const [addressText, setAddressText] = useState(address);
    const [phoneNumberText, setPhoneNumberText] = useState(phoneNumber);
    const [institutionText, setInstitutionText] = useState(institution);

    const applyChanges = () => {
        setUsername(userNameText);
        setMandarinName(mandarinNameText);
        setEmail(emailText);
        setDateOfBirth(dateOfBirthText);
        setGender(genderText);
        setAddress(addressText);
        setPhoneNumber(phoneNumberText);
        setInstitution(institutionText);

        alert("Changes Applied!")
    }

    return(
        <Modal isOpen={isOpen} onRequestClose={() => {
            setIsOpen(false);
        }} className="items-center font-poppins flex flex-col w-[90%] md:w-[70%] bg-white mx-auto shadow-xl relative overflow-y-auto rounded-[10px] xl:max-w-[1200px] 2xl:max-w-[1800px]" overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden">
            <p className="font-kanit text-center text-[1.3rem] mt-[1.5em]">Edit Account</p>
            <span className="text-[2.3rem] xl:text-[2.7rem] absolute top-0 right-0 mr-[1em] md:mr-[1.5em] mt-[0.4em] cursor-pointer" onClick={() => {setIsOpen(false)}}>&times;</span>

            <div className="max-h-[90vh] flex flex-col overflow-y-auto w-[100%] items-center" style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
                <div className="grid grid-cols-[auto] lg:max-h-none sm:grid-cols-[auto_1fr] gap-y-[0.5em] md:gap-y-[1.2em] gap-x-[1.5em] mt-[2em] w-fit">
                    <p>Name:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={userNameText} onChange={(e) => {setUserNameText(e.target.value)}} />
                    <p>Mandarin Name:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={mandarinNameText} onChange={(e) => {setMandarinNameText(e.target.value)}} />
                    <p>Date of Birth:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={dateOfBirthText} onChange={(e) => {setDateOfBirthText(e.target.value)}} />
                    <p>Gender:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={genderText} onChange={(e) => {setGenderText(e.target.value)}} />
                    <p>Full Address:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={addressText} onChange={(e) => {setAddressText(e.target.value)}} />
                    <p>Phone Number:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={phoneNumberText} onChange={(e) => {setPhoneNumberText(e.target.value)}} />
                    <p>Email:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={emailText} onChange={(e) => {setEmailText(e.target.value)}} />
                    <p>Institution:</p>
                    <input type="text" className="rounded-[5px] border border-black pl-[1em] text-gray-500" value={institutionText} onChange={(e) => {setInstitutionText(e.target.value)}} />
                </div>
                <button className='color-component-red rounded-md hover:!bg-red-700 duration-300 text-white cursor-pointer py-2 px-3 mt-[2em] mb-[2em] w-fit mx-auto' onClick={() => {applyChanges()}}>Save Changes</button>
            </div>
        </Modal>
    );
}