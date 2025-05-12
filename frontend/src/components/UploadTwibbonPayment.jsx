import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import Modal from "react-modal";
import UploadImage from './UploadImage';
import { useContext } from 'react';
import { AppContent } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function UploadTwibbonPayment({isOpen, onClose, onCloseParent, competition}) {
    const [twibbonImage, setTwibbonImage] = useState(null);
    const [paymentImage, setPaymentImage] = useState(null);
    const [twibbonImageName, setTwibbonImageName] = useState('');
    const [paymentImageName, setPaymentImageName] = useState('');
    const [loading, setLoading] = useState(false);
    const {userData, backendUrl, uploadImage} = useContext(AppContent);

    const handleSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault();

        const twibbonLink = await uploadImage(twibbonImage);
        if(twibbonLink === ''){
            setLoading(false);
            return;
        } 

        const paymentLink = await uploadImage(paymentImage);
        if(paymentLink === ''){
            setLoading(false);
            return;
        }

        const formData = {
            UserId: userData.id,
            CompetitionId: competition._id,
            PaymentProofUrl: paymentLink,
            TwibbonProofUrl: twibbonLink
        };

        try{
            const response = await axios.post(backendUrl+"api/competitionRegistration/registerCompetition", formData);
            if(response.data.success){
                toast.success("Registration completed!");
                onClose();
                onCloseParent();
            }
        } catch(err){
            alert("Error!");
        }
        setLoading(false);
    }

  return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onClose} 
            className="font-poppins md:w-[80%] w-[90%] py-6 pb-8 bg-white mx-auto shadow-xl relative rounded-[10px]" 
            overlayClassName="flex justify-center items-center inset-0 fixed z-1000 bg-[rgba(0,0,0,0.5)] overflow-hidden"
        >
            <div className="h-[60vh] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#ccc transparent" }}>
                <div className="top-0 sticky pt-1 bg-white">
                    <p className="font-kanit font-medium text-2xl w-[65%] xl:text-3xl ml-11">Upload Documents</p>
                    <span className="text-[2.3rem] xl:text-[2.7rem] text-gray-500 absolute top-0 right-0 mr-[1em] md:mr-[1.5em] hover:text-gray-600 cursor-pointer" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                    <div className="w-[80%] h-[0.05em] bg-gray-400 ml-[3.1em] mt-[0.5em]"></div>
                </div>

                <div className="ml-11 mt-5">
                    <label className="block text-md xl:text-lg mb-1 font-semibold">Upload Twibbon</label>
                    <UploadImage image={twibbonImage} setImage={setTwibbonImage} imageName={twibbonImageName} setImageName={setTwibbonImageName} inputId={'twibbon-upload'}/>

                    <label className="block text-md xl:text-lg mb-1 font-semibold mt-8">Upload Payment Proof</label>
                    <UploadImage image={paymentImage} setImage={setPaymentImage} imageName={paymentImageName} setImageName={setPaymentImageName} inputId={'payment-upload'}/>

                    <button 
                        className={`${loading? 'cursor-not-allowed': 'cursor-pointer'} mt-10 w-30 h-9 bg-red-600 hover:bg-red-700 shadow-md font-poppins font-semibold rounded-md text-white text-center block`}
                        onClick={handleSubmit}
                    >
                        {loading? 
                        <svg className="animate-spin m-auto h-6 w-6 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    :'Submit'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default UploadTwibbonPayment
