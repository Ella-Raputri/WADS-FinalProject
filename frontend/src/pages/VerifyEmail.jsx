import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResendCode = () => {
    if (canResend) {
      setResendTimer(30);
      setCanResend(false);
      alert("New OTP has been sent.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  return (
    <div
      className="relative z-1000 flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

      <button
        className="bg-white absolute top-8 left-8 z-1000 text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
        onClick={() => navigate("/login")}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-red-600 p-6 text-white text-center">
          <p className="mb-3 font-kanit text-3xl font-medium">Verify Email</p>
          <p className="mb-3 text-md font-poppins">
            Insert the 6-number OTP sent to your email.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-center text-gray-700 font-poppins">
            Enter the 6-digit code sent to your email:
          </p>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ))}
          </div>

          <div className="flex justify-center mb-8">
            <p className="font-poppins text-md text-gray-600">Haven't got the code? &nbsp;</p>
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
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;