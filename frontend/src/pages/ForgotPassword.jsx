import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import InputField from "@/components/InputField";
import { toast } from "react-toastify";
import { AppContent } from "@/context/AppContext";
import axios from "axios";
import bgImage from '../assets/Bg.webp'


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] =useState(false);
  const [wrongOtp, setWrongOtp] =useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {backendUrl} =useContext(AppContent);
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    // Move focus to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // paste to all six square inputs
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

  // handle timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (showOtp && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showOtp]);

  // reset sending otp
  const sendingOtp =async()=>{
    setLoading(true);
    try {
      const {data} =await axios.post(backendUrl+'api/auth/send-reset-otp', {email})
      if(data.success){
        setShowOtp(true)
        setResendTimer(30);
        setCanResend(false);
        toast.success(data.message)
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
    setLoading(false);
  }

  const handleResetRequest = async(e) => {
    e.preventDefault();
    sendingOtp();
  };

  const handleResendCode = async() => {
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

  // submit handler
  const onSubmitOtp =async(e)=>{
    e.preventDefault()

    // prevent otp bruteforcing
    if(wrongOtp >=3) {
      toast.error("Too many times of wrong OTP, please resend a new OTP");
      return;
    }

    const inputtedOtp = otp.join('')
    try {
      // verify otp
      const {data} =await axios.post(backendUrl+'api/auth/verify-otp-reset', {email:email, otp:inputtedOtp})
      if(data.success){
        setShowNewPassword(true)
        toast.success(data.message)
      }
      else {
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

  // make new password
  const onSubmitNewPassword =async(e)=>{
    e.preventDefault()
    try {
      const {data} = await axios.post(backendUrl+'api/auth/reset-password', {email:email,newPassword:newPassword})
      if(data.success){
        toast.success(data.message)
        navigate('/login')
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Password setting failed");
    }
  }

  return (
    <div
      className="relative z-1000 flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

      {/* back button */}
      <button
        className="bg-white absolute top-8 left-8 z-1000 text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
        onClick={() => navigate("/login")}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {/* headers */}
      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-red-600 p-6 text-white text-center">
          <p className="mb-3 font-kanit text-3xl font-medium">Forgot Password</p>
          <p className="mb-3 text-md font-poppins">
            {!showOtp && !showNewPassword && ("Enter your email to receive a password reset link.") }
            {showOtp && !showNewPassword && ("Insert the 6-number OTP sent to your email.")} 
            {showOtp && showNewPassword && ("Set a new password with at least 8 characters with the combination of letters and numbers.")} 
          </p>
        </div>

        <div className="p-6">
          {!showOtp && !showNewPassword && (
            // email field
            <form onSubmit={handleResetRequest} className="space-y-6">
              <InputField
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`${loading? 'cursor-not-allowed': 'cursor-pointer'} w-full shadow-md font-semibold rounded-md font-poppins bg-red-600 py-3 text-lg text-white hover:bg-red-700 focus:outline-none`}
                >
                  {loading? 
                    <svg className="mx-auto animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    :'Send OTP to Email'}
                </button>
              </div>
            </form>
          ) }


          {showOtp && !showNewPassword && (
            <form className="space-y-6" onSubmit={onSubmitOtp}>
              <p className="text-center text-gray-700 font-poppins">
                Enter the 6-digit code sent to your email:
              </p>
              {/* otp field */}
              <div data-testid='icon-eye' className="flex justify-center space-x-2" onPaste={handlePaste}>
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

              {/* submit button for otp */}
              <div className="flex justify-center">
                <button
                    type="submit"
                    className="w-full cursor-pointer shadow-md font-semibold rounded-md font-poppins bg-red-600 py-3 text-lg text-white hover:bg-red-700 focus:outline-none"
                  >
                    Submit OTP
                  </button>
              </div>

            </form>
          )}

          {showOtp && showNewPassword && (
            // new password field
            <form onSubmit={onSubmitNewPassword} className="space-y-6">
              <div className="w-full relative">
                <InputField
                  id="password"
                  type={showPassword? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={"Enter new password"}
                />

                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-10 text-gray-500 w-5 h-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword? faEyeSlash: faEye} />
                </button>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full cursor-pointer shadow-md font-semibold rounded-md font-poppins bg-red-600 py-3 text-lg text-white hover:bg-red-700 focus:outline-none"
                >
                  Set New Password
                </button>
              </div>
            </form>
          ) }

          
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
