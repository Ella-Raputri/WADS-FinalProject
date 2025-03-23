import React from "react";
import { useNavigate } from "react-router-dom";

const LoginRegisterPage = () => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault(); 
    navigate("/login"); 
  };
  const handleSignUp = (e) => {
    e.preventDefault(); 
    const fullName = document.getElementById("FullName").value.trim();
    const email = document.getElementById("Email").value.trim();
    const phone = document.getElementById("Phone").value.trim();
    const password = document.getElementById("Password").value.trim();
  
    if (!fullName || !email || !phone || !password) {
      alert("Please fill in all fields");
      return;
    }
  
    console.log("User Signed Up:", { fullName, email, phone, password }); 
    navigate("/userhome");
  };
  
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-cover bg-center px-4" style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}>
       <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

       <div className="relative z-10 flex w-[70%] min-h-[70%] flex-col overflow-hidden rounded-lg bg-white shadow-lg md:flex-row">
        <div className="w-full flex flex-col items-center justify-center bg-[#DD3833] p-6 text-white md:w-1/2 md:rounded-r-[80px]">
          <p className="mb-4 text-3xl font-bold md:text-4xl">Hello Friend!</p>
          <p className="mb-6 text-center text-sm md:text-base">
            Already have an account? Login to Continue Competing and Winning!
          </p>
          <button onClick={handleLogin} className="rounded-lg border-2 border-white px-10 py-2 font-medium hover:bg-white hover:text-[#DD3833]" aria-label="Sign Up">
            Login
          </button>
        </div>
        <div className="w-full p-6 flex-1 md:p-12">
          <p className="mt-8 mb-6 text-center text-2xl font-bold md:text-4xl">USER SIGNUP</p>
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
                className="w-30 rounded-lg bg-[#DD3833] py-2 text-lg text-white hover:bg-red-600 focus:outline-none">
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
  );
};

export default LoginRegisterPage;


