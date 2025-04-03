import { useContext, useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation, matchRoutes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx'
import NotFound from './pages/NotFound.jsx'
import LoginRegisterPage from './pages/LoginRegisterPage.jsx'
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
import { ToastContainer } from 'react-toastify';
import VerifyEmailPage from './pages/VerifyEmail';
import ForgotPasswordPage from './pages/ForgotPassword.jsx';
import { AppContent } from './context/AppContext';
import ProtectedRoute from './lib/protectedRoute';

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
    <div className={`flex flex-col min-h-screen`} style={{ backgroundColor: bgColor }}>
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<LoginRegisterPage />} />
          <Route path="/verifyemail" element={<VerifyEmailPage />} />
          <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="/usercomp" element={<CompetitionPage />} />
          <Route path="/userhelp" element={<HelpPage />} />

          {/* User-only Routes */}
          <Route
            path="/userhome"
            element={
              <ProtectedRoute allowedRoles={["participant"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/usercomp"
            element={
              <ProtectedRoute allowedRoles={["participant"]}>
                <CompetitionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userhelp"
            element={
              <ProtectedRoute allowedRoles={["participant"]}>
                <HelpPage />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/usernewticket"
            element={
              <ProtectedRoute allowedRoles={["participant"]}>
                <NewTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userticketdetails"
            element={
              <ProtectedRoute allowedRoles={["participant","admin"]}>
                <TicketDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admincomp"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CompManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminticket"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <TicketManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminparticipantdetails"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ParticipantDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminticketdetails"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminTicketDetails />
              </ProtectedRoute>
            }
          />

          {/* Catch-all for 404 */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}


export default App
