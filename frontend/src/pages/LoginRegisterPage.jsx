import React from "react";
import { useNavigate } from "react-router-dom";


const LoginRegisterPage = () => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault(); 
    navigate("/userhome"); 
  };
  const handleSignUp = () => {
    navigate("/register"); 
  };
  return (
    <div className="relative flex h-screen items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}>
       <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>


      <div className="relative z-10 flex w-[70%] h-[70%] flex-col overflow-hidden rounded-lg bg-white shadow-lg md:flex-row">
        <div className="w-full p-6 md:w-1/2 md:p-12">
          <p className="mt-8 mb-6 text-center text-2xl font-bold md:text-4xl">USER LOGIN</p>
          <form onSubmit={handleLogin} className="space-y-6 mt-6">
            <div>
              <input
                id="emailOrPhone"
                type="text"
                placeholder="Email or Phone"
                className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none"
              />
            </div>
            <div className="mt-2 text-center">
              <a href="#" className="text-base text-gray-500 hover:text-gray-700">
                Forgot Your Password?
              </a>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-15 rounded-lg bg-[#DD3833] py-2 text-lg text-white hover:bg-red-600 focus:outline-none"
              >
                LOGIN
              </button>
            </div>
          </form>
        </div>
        <div className="hidden w-1/2 flex-col items-center justify-center bg-[#DD3833] p-12 text-white md:flex rounded-l-[80px]">
          <p className="mb-4 text-3xl font-bold md:text-4xl">Welcome!</p>
          <p className="mb-6 text-center text-sm md:text-base">
            Register with your personal details to compete in competitions!
          </p>
          <button onClick={handleSignUp} className="rounded-lg border-2 border-white px-10 py-2 font-medium hover:bg-white hover:text-[#DD3833]"aria-label="Sign Up"
          >
            SIGN UP
          </button>
        </div>
      </div>
      <div className="relative z-10 mt-6 flex w-full max-w-sm flex-col items-center justify-center bg-[#DD3833] p-6 text-white md:hidden rounded-lg shadow-lg">
        <p className="mb-3 text-2xl font-bold">Welcome!</p>
        <p className="mb-4 text-center text-sm">
          Register with your personal details to compete in competitions!
        </p>
        <button
          className="rounded-lg border-2 border-white px-6 py-2 font-medium hover:bg-white hover:text-[#DD3833]"
          aria-label="Sign Up"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
