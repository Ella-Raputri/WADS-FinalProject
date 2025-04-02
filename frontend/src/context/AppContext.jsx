import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext()

export const AppContextProvider = (props)=>{
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] =useState(false);
    const [userData, setUserData] =useState(null);
    axios.defaults.withCredentials=true

    const getUserData = async()=>{
        try {
            const {data} = await axios.get(backendUrl+'api/user/data')
            if (data.success) {
                setUserData(data.userData);
            } else {
                setUserData(null);  
            }

        } catch (error) {
            setUserData(null)
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const getAuthState =async()=>{
        try {
            const {data} = await axios.get(backendUrl+'api/auth/is-auth')
            if(data.success) {
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const value ={
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
    }

    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}