import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContent } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import bgImage from '../assets/Bg.webp'

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const [wrongOtp, setWrongOtp] =useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {backendUrl, getUserData, initializeSocket} =useContext(AppContent);
  const inputRefs = useRef([]);
  const location = useLocation();

  // resend timer functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // resend otp
  const sendingOtp =async()=>{
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const {data} =await axios.post(backendUrl+'api/auth/send-verify-otp', {email:email})
      if(data.success){
        setResendTimer(30);
        setCanResend(false);
        toast.success(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false);
  }

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    else navigate('/login')
  }, [location.state?.email]);

  useEffect(() => {
      if (email) {
          sendingOtp();
      }
  }, [email]);

  const handleResendCode = () => {
    if (canResend) {
      sendingOtp();
      setWrongOtp(0);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow digits and empty string
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Auto-focus next input when a digit is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // paste to six inputs of otp
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    const pasteDigits = pasteData.replace(/\D/g, '').split('').slice(0, 6);
    
    if (pasteDigits.length === 6) {
      const newOtp = [...otp];
      pasteDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
    }
  };

  const onSubmitOtp = async(e)=>{
    e.preventDefault();

    // prevent otp bruteforcing
    if(wrongOtp >=3) {
      toast.error("Too many times of wrong OTP, please resend a new OTP");
      return;
    }

    const inputtedOtp = otp.join('')
    axios.defaults.withCredentials = true;
    
    try {
      // verify the email 
      const {data} =await axios.post(backendUrl+'api/auth/verify-account', {email:email, otp:inputtedOtp})
      if(data.success){
        toast.success(data.message)
        await getUserData()
        initializeSocket(data.userData._id);
        navigate('/userhome')
      }
      else{
        if(wrongOtp <3){
          toast.error(data.message)
          setWrongOtp(wrongOtp+1);
        }
        else toast.error("Too many times of wrong OTP, please resend a new OTP");
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Verify failed");
    }
  }

  return (
    <div
      className="relative z-1000 flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

      {/* headers */}
      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-red-600 p-6 text-white text-center">
          <p className="mb-3 font-kanit text-3xl font-medium">Verify Email</p>
          <p className="mb-3 text-md font-poppins">
            Insert the 6-number OTP sent to your email.
          </p>
        </div>

        {/* inputs */}
        <form className="space-y-6 p-6" onSubmit={onSubmitOtp}>
          <p className="text-center text-gray-700 font-poppins">
            Enter the 6-digit code sent to your email:
          </p>
          <div className="flex justify-center space-x-2" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={otp[index]}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ))}
          </div>

            {/* resend button */}
          <div className="flex justify-center mb-8">
            <p className="font-poppins text-md text-gray-600" >Haven't got the code? &nbsp;</p>
            <p
              onClick={canResend && !loading ? handleResendCode : undefined}
              className={`font-poppins text-md ${
                loading? "cursor-not-allowed text-gray-400" : canResend ? "underline cursor-pointer text-gray-600 hover:text-gray-800" : "underline cursor-not-allowed text-gray-400"
              }`}
            >
              {loading? 'Sending OTP...' : canResend? "Resend Code" : `Resend in ${resendTimer}s`}
            </p>
          </div>

          {/* submit button */}
          <div className="flex justify-center">
            <button
                type="submit"
                className="w-full cursor-pointer shadow-md font-semibold rounded-md font-poppins bg-red-600 py-3 text-lg text-white hover:bg-red-700 focus:outline-none"
              >
                Submit OTP
              </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;