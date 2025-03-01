import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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

function App() {
  // const [page, setPage] = useState("Welcome");
  // const [isLogin , setIsLogin] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="App">
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<WelcomePage/>}></Route>
                <Route path='/login' element={ <LoginRegisterPage/> }></Route>

                <Route path='/userhome' element={ <HomePage/> }></Route>
                <Route path='/usercomp' element={ <CompetitionPage/> }></Route>
                <Route path='/userhelp' element={ <HelpPage/> }></Route>

                <Route path='/admindashboard' element={ <Dashboard/> }></Route>
                <Route path='/admincomp' element={ <CompManagement/> }></Route>
                <Route path='/adminticket' element={ <TicketManagement /> }></Route>

                <Route path='/*' element={<NotFound/>}></Route>
            </Routes>
            <Footer />
        </Router>
    </div>
  )
}

export default App