import { AppContent } from "@/context/AppContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userData } = useContext(AppContent); // Get user data from context

  if (!userData || !allowedRoles.includes(userData.role)) {
    if(userData.role === 'admin') return (<Navigate to="/admindashboard" />);
    if(userData.role === 'participant') return (<Navigate to="/userhome" />); 
  }

  return children;
};

export default ProtectedRoute;
