import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] =useState([])
    
    const onlineUsersRef = useRef(onlineUsers);
    useEffect(() => {
        onlineUsersRef.current = onlineUsers; // Keep ref updated
    }, [onlineUsers]);

    axios.defaults.withCredentials = true;

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "api/user/data");
            if (data.success) {
                setUserData(data.userData);
            } else {
                setUserData(null);
            }
        } catch (error) {
            setUserData(null);
            toast.error(error.message);
        }
    };

    const initializeSocket = (userId) => {
        if (userId) {
            // Disconnect existing socket if any
            if (socket) {
                socket.disconnect();
            }

            const newSocket = io(backendUrl, {
                withCredentials: true,
                query: { userId },
            });

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
                setSocket(newSocket);
            });

            newSocket.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
            });

            newSocket.on("getOnlineUsers", (users) => {
                console.log("online user berubah");
                setOnlineUsers(users);
                onlineUsersRef.current =users;
            });

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            return newSocket;
        }
    };


    // Clean up socket connection when user logs out
    const cleanupSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    useEffect(() => {
        getAuthState();
        return () => {
            // Clean up on unmount
            cleanupSocket();
        };
    }, []);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + "api/auth/is-auth");
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    const uploadImage = async (image) =>{
        const imageFormData = new FormData();
        imageFormData.append('file', image); 

        // 2. Upload image first
        const { data: uploadData } = await axios.post(
            backendUrl + 'api/image/upload', 
            imageFormData, 
            {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            }
        ).catch(error => {
            // Handle image upload failure
            console.error("Image upload error:", error);
            toast.error("Image upload failed. Please try again.");
            return '';
        });

        if(!uploadData?.imageUrl) {
            return '';
        }
        else return uploadData.imageUrl;
    }


    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        socket,
        onlineUsersRef,
        initializeSocket,
        cleanupSocket,
        uploadImage
    };

    return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};