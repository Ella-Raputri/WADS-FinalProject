import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, matchRoutes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx'
import NotFound from './pages/NotFound.jsx'
import LoginRegisterPage from './pages/LoginRegisterPage.jsx'
import RegisterLoginPage from './pages/RegisterLoginPage.jsx'
import HomePage from './pages/participant/HomePage.jsx'
import CompetitionPage from './pages/participant/CompetitionPage.jsx'
import HelpPage from './pages/participant/HelpPage.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import CompManagement from './pages/admin/CompManagement.jsx'
import TicketManagement from './pages/admin/TicketManagement.jsx'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import NewTicket from './pages/participant/NewTicket.jsx';
import ScrollToTop from './components/ScrolltoTop.jsx';
import ParticipantDetails from './pages/admin/ParticipantDetails.jsx';
import TicketDetails from './pages/participant/TicketDetails.jsx';
import AdminTicketDetails from './pages/admin/AdminTicketDetails';
import Loading from './components/Loading';

function App() {
  const [isLoading, setIsLoading] = useState(true);
 
    setTimeout(() => {
        setIsLoading(false);
    }, 1000);

  return (
    <Router>
      {isLoading ? (<Loading/>) : (<MainLayout/>)}
    </Router>
  );
}


function MainLayout() {
  const routes = [
    { path: "/" },
    { path: "/login" },
    { path: "/register" },
    { path: "/userhome" },
    { path: "/usercomp" },
    { path: "/userhelp" },
    { path: "/usernewticket" },
    { path: "/userticketdetails" },
    { path: "/admindashboard" },
    { path: "/admincomp" },
    { path: "/adminticket" },
    { path: "/adminparticipantdetails" },
    { path: "/adminticketdetails" },
  ];
  
  const location = useLocation();
  const matchedRoute = matchRoutes(routes, location);

const bgColor = matchedRoute
  ? location.pathname.includes("admin")
    ? "#f7f7f7"
    : "white"
  : "#fcf1d4";

  return (
    <div className={`flex flex-col min-h-screen`} style={{backgroundColor:bgColor}}>
        <ScrollToTop />
        <Navbar />

        <main className="flex-1"> 
          <Routes>
            <Route path='/' element={<WelcomePage />} />
            <Route path='/login' element={<LoginRegisterPage />} />
            <Route path='/register' element={<RegisterLoginPage />} />
            <Route path='/userhome' element={<HomePage />} />
            <Route path='/usercomp' element={<CompetitionPage />} />
            <Route path='/userhelp' element={<HelpPage />} />
            <Route path='/usernewticket' element={<NewTicket />} />
            <Route path='/userticketdetails' element={<TicketDetails />} />

            <Route path='/admindashboard' element={<Dashboard />} />
            <Route path='/admincomp' element={<CompManagement />} />
            <Route path='/adminticket' element={<TicketManagement />} />
            <Route path='/adminparticipantdetails' element={<ParticipantDetails />} />
            <Route path='/adminticketdetails' element={<AdminTicketDetails />} />

            <Route path='/*' element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
    </div>
  );
}


export default App
