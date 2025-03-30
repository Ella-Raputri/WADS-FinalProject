import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const InputField = ({ id, type = "text", value, onChange, placeholder }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none mt-4"
  />
);

const LoginRegisterPage = () => {
  const navigate = useNavigate();
  const studentCardRef = useRef(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    mandarinName: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    institution: "",
    password: "",
  });

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setError("Enter Your Email and Password to Login");
      return;
    }
    setError("");
    navigate("/userhome");
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const studentCard = studentCardRef.current?.files[0];
    if (
      !formData.fullName ||
      !formData.mandarinName ||
      !formData.dob ||
      !formData.gender ||
      !formData.address ||
      !formData.phone ||
      !formData.email ||
      !formData.institution ||
      !studentCard
    ) {
      alert("Please fill in all fields");
      return;
    }
    console.log("User Signed Up:", { ...formData, studentCard });
    navigate("/userhome");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8" style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg md:hidden">
        <div className="bg-[#DD3833] p-6 text-white">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-4 text-3xl font-bold">{isLogin ? "Welcome!" : "Hello Friend!"}</p>
            <p className="mb-6 text-center text-sm">
              {isLogin ? "Register with your personal details to compete in competitions!" : "Already have an account? Login to Continue Competing and Winning!"}
            </p>
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="rounded-lg border-2 border-white px-10 py-2 font-medium hover:bg-white hover:text-[#DD3833]"
            >
              {isLogin ? "SIGN UP" : "LOGIN"}
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLogin ? (
            <>
              <p className="mb-6 text-center text-2xl font-bold">USER LOGIN</p>
              <form onSubmit={handleLogin} className="space-y-6">
                <InputField 
                  id="emailOrPhone" 
                  type="text" 
                  value={emailOrPhone} 
                  onChange={(e) => setEmailOrPhone(e.target.value)} 
                  placeholder="Email or Phone" 
                />
                <InputField 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Password" 
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="mt-2 text-center">
                  <a href="#" className="text-base text-gray-500 hover:text-gray-700">Forgot Your Password?</a>
                </div>
                <div className="flex justify-center">
                  <button type="submit" className="w-full rounded-lg bg-[#DD3833] py-3 text-lg text-white hover:bg-red-600 focus:outline-none">LOGIN</button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className="mb-6 text-center text-2xl font-bold">USER SIGNUP</p>
              <form onSubmit={handleSignUp} className="space-y-6">
                {["fullName", "mandarinName", "dob", "address", "phone", "email", "institution"].map((id) => (
                  <InputField 
                    key={id} 
                    id={id} 
                    type={id === "dob" ? "date" : "text"} 
                    value={formData[id]} 
                    onChange={handleChange} 
                    placeholder={id.charAt(0).toUpperCase() + id.slice(1)} 
                  />
                ))}
                <select 
                  id="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none mt-4"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input 
                  ref={studentCardRef} 
                  id="studentCard" 
                  type="file" 
                  className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none mt-4" 
                />
                <div className="flex justify-center mt-6">
                  <button type="submit" className="w-full rounded-lg bg-[#DD3833] py-3 text-lg text-white hover:bg-red-600 focus:outline-none">Signup</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>


      <div className="relative z-10 hidden w-[70%] h-[70%] flex-row overflow-hidden rounded-lg bg-white shadow-lg md:flex">
        <div className={`absolute top-0 h-full w-1/2 bg-[#DD3833] p-6 text-white transition-all duration-500 ${isLogin ? "translate-x-full rounded-l-[80px]" : "translate-x-0 rounded-r-[80px]"}`}>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="mb-4 text-3xl font-bold md:text-4xl">{isLogin ? "Welcome!" : "Hello Friend!"}</p>
            <p className="mb-6 text-center text-sm md:text-base">
              {isLogin ? "Register with your personal details to compete in competitions!" : "Already have an account? Login to Continue Competing and Winning!"}
            </p>
            <button onClick={() => setIsLogin(!isLogin)} className="rounded-lg border-2 border-white px-10 py-2 font-medium hover:bg-white hover:text-[#DD3833]">
              {isLogin ? "SIGN UP" : "LOGIN"}
            </button>
          </div>
        </div>
        
        <div className={`w-1/2 p-6 md:p-12 overflow-y-auto max-h-[60vh] transition-all duration-500 ease-in-out 
          ${isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"}`}>
          <p className="mt-8 mb-6 text-center text-2xl font-bold md:text-4xl">USER LOGIN</p>
          <form onSubmit={handleLogin} className="space-y-6 mt-6">
            <InputField id="emailOrPhone" type="text" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} placeholder="Email or Phone" />
            <InputField id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="mt-2 text-center">
              <a href="#" className="text-base text-gray-500 hover:text-gray-700">Forgot Your Password?</a>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="px-15 rounded-lg bg-[#DD3833] py-2 text-lg text-white hover:bg-red-600 focus:outline-none">LOGIN</button>
            </div>
          </form>
        </div>

        <div className={`w-1/2 p-6 md:p-12 overflow-y-auto max-h-[60vh] transition-all duration-500 ease-in-out
          ${isLogin ? "opacity-0 translate-x-full pointer-events-none" : "opacity-100 translate-x-0"}`}>
          <p className="mt-8 mb-6 text-center text-2xl font-bold md:text-4xl">USER SIGNUP</p>
          <form onSubmit={handleSignUp} className="space-y-6 mt-6">
            {["fullName", "mandarinName", "dob", "address", "phone", "email", "institution"].map((id) => (
              <InputField key={id} id={id} type={id === "dob" ? "date" : "text"} value={formData[id]} onChange={handleChange} placeholder={id.charAt(0).toUpperCase() + id.slice(1)} />
            ))}
            <select id="gender" value={formData.gender} onChange={handleChange} className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none mt-4">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input ref={studentCardRef} id="studentCard" type="file" className="w-full rounded-lg bg-gray-100 px-5 py-4 text-lg text-gray-700 focus:outline-none mt-4" />
            <div className="flex justify-center mt-6">
              <button type="submit" className="w-30 rounded-lg bg-[#DD3833] py-2 text-lg text-white hover:bg-red-600 focus:outline-none">Signup</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
