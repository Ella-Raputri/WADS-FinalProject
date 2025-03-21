import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRegisterPage = () => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault(); 
    navigate("/login"); 
  };
  const handleSignUp = () => {
    navigate("/userhome"); 
  };
  
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}>
       <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

      <div className="relative z-10 flex w-[70%] h-[70%] flex-col overflow-hidden rounded-lg bg-white shadow-lg md:flex-row">
        <div className="hidden w-1/2 flex-col items-center justify-center bg-[#DD3833] p-12 text-white md:flex rounded-r-[80px]">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Hello Friend!</h1>
          <p className="mb-6 text-center text-sm md:text-base">
            Already have an account? Login to Continue Competing and Winning!
          </p>
          <button onClick={handleLogin} className="rounded-lg border-2 border-white px-10 py-2 font-medium hover:bg-white hover:text-[#DD3833]" aria-label="Sign Up">
            Login
          </button>
        </div>
        <div className="w-full p-6 md:w-1/2 md:p-12">
          <p className="mt-8 mb-6 text-center text-2xl font-bold md:text-4xl">USER LOGIN</p>
          <form onSubmit={handleSignUp} className="space-y-6 mt-6">
            <div>
              <input
                id="FullName"
                type="text"
                placeholder="Full Name"
                className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <input
                id="Email"
                type="text"
                placeholder="Email"
                className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <input
                id="Phone"
                type="text"
                placeholder="Phone"
                className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <input
                id="Password"
                type="password"
                placeholder="Password"
                className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-15 rounded-lg bg-[#DD3833] py-2 text-lg text-white hover:bg-red-600 focus:outline-none"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="relative z-10 mt-6 flex w-full max-w-sm flex-col items-center justify-center bg-[#DD3833] p-6 text-white md:hidden rounded-lg shadow-lg">
        <p className="mb-3 text-2xl font-bold">Welcome!</p>
        <p className="mb-4 text-center text-sm">
          Register with your personal details to compete in competitions!
        </p>
        <button
          onClick={handleSignUp}
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

