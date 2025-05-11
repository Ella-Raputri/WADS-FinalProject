import UploadImage from "@/components/UploadImage";
import { AppContent } from "@/context/AppContext";
import { faCalendar, faChevronLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "@/components/InputField";
import { io } from "socket.io-client";

const LoginRegisterPage = () => {
  const navigate = useNavigate();
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

  const [emailLogin, setEmailLogin] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] =useState(null);
  const [imageName, setImageName] =useState("");

  const {backendUrl, setIsLoggedIn, getUserData, userData, initializeSocket, uploadImage} = useContext(AppContent)

  const dobRef = useRef(null);
  const [showPassword, setShowPassword] =useState(false);  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(()=>{
    if(userData){
      console.log(userData.role)
      if(userData.role === 'admin') navigate('/admindashboard') 
      else if(userData.role === 'participant') navigate('/userhome')
    }
  },[userData])

  const handleLogin = async(e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials =true
      const {data}=await axios.post(backendUrl+'api/auth/login', {email:emailLogin,password})
      console.log(data)
        
      if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          initializeSocket(data.userData._id);
          toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Login failed");
    }
  };

  const handleSignUp = async(e) => {
    e.preventDefault();

    try {
        const linkRes = await uploadImage(image);
        if(linkRes==='') return;

        // 3. Prepare registration data
        const registrationData = {
            ...formData,
            studentPhotoUrl: linkRes
        };
        registrationData.email = formData.email.toLowerCase()

        // 4. Register user
        axios.defaults.withCredentials =true
        const { data } = await axios.post(backendUrl + 'api/auth/register', {participantDetails: registrationData});
        
        if(data.success) {
          navigate('/verifyemail', { state: { email: registrationData.email } });
          console.log("passing emaill: "+registrationData.email);
        } 
    } catch (error) {
        console.error("Signup error:", error);
        toast.error(error.response?.data?.message || error.message || "Signup failed");
    }
};

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4 py-8" style={{ backgroundImage: "url('/src/assets/Bg.webp')" }}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-xl"></div>

      <button className="bg-white absolute top-8 left-8 z-1000 text-slate-500 border shadow-md border-slate-300 w-10 h-10 flex items-center justify-center rounded-full hover:cursor-pointer hover:bg-gray-100"
        onClick={() => navigate('/')}>
            <FontAwesomeIcon icon={faChevronLeft} />
        </button>

      <div className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-lg lg:hidden">
        <div className="bg-red-600 p-6 text-white">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-3 font-kanit text-3xl font-medium">{isLogin ? "Welcome!" : "Hello Friend!"}</p>
            <p className="mb-6 text-center text-md font-poppins">
              {isLogin
                ? "Register with your personal details to compete in competitions!"
                : "Already have an account? Login to continue competing and winning!"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-poppins font-semibold rounded-lg border-2 border-white px-10 py-2 hover:bg-white hover:text-[#DD3833]"
            >
              {isLogin ? "SIGN UP" : "LOGIN"}
            </button>
          </div>
        </div>

        {/* Animated Container */}
        <div
          className={`transition-all duration-500 overflow-hidden ${
            isLogin ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-6">
            <p className="mb-6 font-poppins font-semibold text-center text-2xl">USER LOGIN</p>
            <form onSubmit={handleLogin} className="space-y-6">
              <InputField
                id="email"
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder="Email"
              />
              
              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Password</p>
              <div className="w-full relative">
                <input
                    key='password'
                    id='password'
                    type={showPassword? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                />  
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1.5 text-gray-500 w-5 h-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword? faEyeSlash: faEye} />
                </button>
              </div>

              <div className="mt-2 text-center">
                <a href="/forgotpassword" className="text-base font-poppins underline text-gray-500 hover:text-gray-700">
                  Forgot Your Password?
                </a>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full shadow-md font-semibold rounded-md font-poppins bg-red-600 py-3 text-lg text-white hover:bg-red-700 focus:outline-none"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          className={`transition-all duration-500 overflow-scroll ${
            isLogin ? "max-h-0 opacity-0" : "max-h-[100vh] opacity-100"
          }`}
        >
          <div className="p-6 mt-2 overflow-scroll ">
            <p className="mb-4 text-center text-2xl font-poppins font-semibold">USER SIGNUP</p>
            <form onSubmit={handleSignUp} className="space-y-6">
              {["fullName", "mandarinName", "address", "phone", "email", "institution"].map((id) => (
                <InputField
                  key={id}
                  id={id}
                  type="text"
                  value={formData[id]}
                  onChange={handleChange}
                  placeholder={
                    id === "mandarinName" ? "Chinese characters or  -" :
                    id === 'phone'? "Starts with +628XX or 08XX":
                    ''
                  }
                />
              ))}
              
              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Password</p>
              <div className="w-full relative">
                <input
                    key='password'
                    id='password'
                    type={showPassword? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 chars, letter & number"
                    className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                />  
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1.5 text-gray-500 w-5 h-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword? faEyeSlash: faEye} />
                </button>
              </div>


              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Date of Birth</p>
              <div className="w-full relative">
                <input
                  type="date"
                  name="createdStart"
                  id="dob"
                  className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                  value={formData.dob}
                  onChange={handleChange}
                  ref={dobRef}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1 text-gray-500 w-5 h-5"
                  onClick={() => dobRef.current?.showPicker()}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                </button>
              </div>
              
              
              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Gender</p>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full font-poppins bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              
              <label className="block font-poppins text-md xl:text-lg mb-2 font-semibold mt-2">Upload Student Card</label>
              <UploadImage image={image} setImage={setImage} imageName={imageName} setImageName={setImageName} inputId={'student-card-upload'}/>


              <div className="flex justify-center mb-6 mt-10">
                <button
                  type="submit"
                  className="w-full shadow-md rounded-lg bg-red-600 py-3 text-lg text-white hover:bg-red-700 focus:outline-none font-poppins font-semibold"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <div className="relative font-poppins z-10 hidden w-[70%] h-[70%] flex-row overflow-hidden rounded-lg bg-white shadow-lg lg:flex">
        <div className={`absolute top-0 h-full w-1/2 bg-red-600 p-6 text-white transition-all duration-500 ${isLogin ? "translate-x-full rounded-l-[80px]" : "translate-x-0 rounded-r-[80px]"}`}>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="mb-4 text-3xl font-kanit font-medium md:text-4xl">{isLogin ? "Welcome!" : "Hello Friend!"}</p>
            <p className="mb-6 text-center text-sm md:text-base leading-7">
              {isLogin ? "Register with your personal details to compete in competitions!" : "Already have an account? Login to continue competing and winning!"}
            </p>
            <button onClick={() => setIsLogin(!isLogin)} className="font-semibold rounded-lg border-2 border-white px-10 py-2 cursor-pointer transition duration-300 ease hover:bg-white hover:text-red-600">
              {isLogin ? "SIGN UP" : "LOGIN"}
            </button>
          </div>
        </div>
        
        <div className={`w-1/2 p-6 md:p-8 overflow-y-scroll max-h-[60vh] transition-all duration-500 ease-in-out 
          ${isLogin ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"}`} style={{scrollbarWidth:"none", scrollbarColor:"#ccc transparent"}}>
          <p className="mb-4 text-center font-poppins text-2xl font-semibold md:text-3xl">USER LOGIN</p>
          <form onSubmit={handleLogin} className="space-y-6 mt-6">
            <InputField id="email" type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} placeholder="Email" />
            <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Password</p>
            <div className="w-full relative">
              <input
                  key='password'
                  id='password'
                  type={showPassword? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Password'
                  className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
              />  
              <button
                type="button"
                className="absolute cursor-pointer right-2 top-1.5 text-gray-500 w-5 h-5"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword? faEyeSlash: faEye} />
              </button>
            </div>            
            
            <div className="mt-2 text-center">
              <a href="/forgotpassword" className="text-base text-gray-500 underline underline-offset-3 hover:text-gray-700">Forgot Your Password?</a>
            </div>
            <div className="flex justify-center">
              <button type="submit" className="px-15 transition ease duration-150 rounded-md bg-red-600 py-2 text-lg text-white hover:bg-red-700 focus:outline-none cursor-pointer shadow-md font-semibold">Login</button>
            </div>
          </form>
        </div>

        <div className={`w-1/2 p-4 md:p-8 overflow-y-auto max-h-[60vh] transition-all duration-500 ease-in-out
          ${isLogin ? "opacity-0 translate-x-full pointer-events-none" : "opacity-100 translate-x-0"}`} style={{scrollbarWidth:"thin", scrollbarColor:"#ccc transparent"}}>
          <p className="mb-4 text-center font-poppins text-2xl font-semibold md:text-3xl">USER SIGNUP</p>
          <form onSubmit={handleSignUp} className="space-y-6 mt-6">
            {["fullName", "mandarinName", "address", "phone", "email", "institution"].map((id) => (
              <InputField key={id} id={id} type={"text"} value={formData[id]} onChange={handleChange} 
              placeholder={
                id === "mandarinName" ? "Chinese characters or  -" :
                id === 'phone'? "Starts with +628XX or 08XX":
                ''
              } />
            ))}

              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Password</p>
              <div className="w-full relative">
                <input
                    key='password'
                    id='password'
                    type={showPassword? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Min 8 chars, letter & number'
                    className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                />  
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1.5 text-gray-500 w-5 h-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword? faEyeSlash: faEye} />
                </button>
              </div>


              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Date of Birth</p>
              <div className="w-full relative">
                <input
                  type="date"
                  name="createdStart"
                  id="dob"
                  className="p-2 font-poppins w-full pr-10 bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md pl-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow"
                  value={formData.dob}
                  onChange={handleChange}
                  ref={dobRef}
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-2 top-1 text-gray-500 w-5 h-5"
                  onClick={() => dobRef.current?.showPicker()}
                >
                  <FontAwesomeIcon icon={faCalendar} />
                </button>
              </div>
              
              
              <p className="ml-1 mb-2 font-semibold font-poppins text-md xl:text-lg">Gender</p>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full font-poppins bg-white placeholder:text-slate-400 text-slate-700 text-md border border-slate-300 rounded-md pl-3 pr-5 py-2 transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-400 shadow-sm focus:shadow p-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              
              <label className="block font-poppins text-md xl:text-lg mb-2 font-semibold mt-2">Upload Student Card</label>
              <UploadImage image={image} setImage={setImage} imageName={imageName} setImageName={setImageName} inputId={'student-card-upload'}/>
            
            
            
            <div className="flex justify-center mt-10">
              <button type="submit" className="px-15 transition ease duration-150 rounded-md bg-red-600 py-2 text-lg text-white hover:bg-red-700 shadow-md font-semibold cursor-pointer focus:outline-none">Sign up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
