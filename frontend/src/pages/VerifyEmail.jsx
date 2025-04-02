import { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContent } from "@/context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const {backendUrl, getUserData} =useContext(AppContent);
  const inputRefs = useRef([]);
  const location = useLocation();


  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const sendingOtp =async()=>{
    try {
      axios.defaults.withCredentials = true;
      const {data} =await axios.post(backendUrl+'api/auth/send-verify-otp', {email:email})
      if(data.success){
        setResendTimer(30);
        setCanResend(false);
        toast.success(data.message)
      }
      else toast.error(data.message)
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      console.log(location.state.email);
    }
    else navigate('/login')
  }, [location.state?.email]);

  useEffect(() => {
      if (email) {
          console.log("Email before sending OTP: " + email);
          sendingOtp();
      }
  }, [email]);

  const handleResendCode = () => {
    if (canResend) {
      sendingOtp();
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
    e.preventDefault()
    const inputtedOtp = otp.join('')
    axios.defaults.withCredentials = true;
    
    try {
      console.log(email)
      console.log(inputtedOtp)
      const {data} =await axios.post(backendUrl+'api/auth/verify-account', {email:email, otp:inputtedOtp})
      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/userhome')
      }
      else toast.error(data.message)
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
      className="relative z-1000 flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>


      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-red-600 p-6 text-white text-center">
          <p className="mb-3 font-kanit text-3xl font-medium">Verify Email</p>
          <p className="mb-3 text-md font-poppins">
            Insert the 6-number OTP sent to your email.
          </p>
        </div>

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

          <div className="flex justify-center mb-8">
            <p className="font-poppins text-md text-gray-600" >Haven't got the code? &nbsp;</p>
            <p
              onClick={canResend ? handleResendCode : undefined}
              className={`font-poppins underline text-md ${
                canResend ? "cursor-pointer text-gray-600 hover:text-gray-800" : "cursor-not-allowed text-gray-400"
              }`}
            >
              {canResend ? "Resend Code" : `Resend in ${resendTimer}s`}
            </p>
          </div>

          
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