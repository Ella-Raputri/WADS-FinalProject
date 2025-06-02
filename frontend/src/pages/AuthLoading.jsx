// src/pages/AuthLoading.jsx
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const AuthLoading = () => {
  const { getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const success = await getUserData();
        console.log('data success',success)

        if(success){
            console.log("lesgo ke userhome")
            navigate('/userhome');
        } 

      } catch (err) {
        console.error("OAuth fetch failed", err);
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  return <p>Loading...</p>; // Optional spinner here
};

export default AuthLoading;
