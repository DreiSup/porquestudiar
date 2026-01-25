import { createContext } from "react";
import { checkAuthStatus, loginUser, logoutUser, signupUser } from "../services/user-api";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const navigate = useNavigate() 

    useEffect(() => {
        async function checkStatus() {
            try {
                setLoading(true)
                const data = await checkAuthStatus()
                console.log("Data del useEffect situado en AuthContext:", data)
                if (data) {
                setUser({name: data.name, email: data.email, profilePic: data.profilePic, chats: data.chats})
                setIsLoggedIn(true)
                } 
                
            } catch (error) {
                console.log("Sesión no válida o expirada: ", error.message)
                setIsLoggedIn(false)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkStatus()
    }, [])

    useEffect(() => {
        console.log("user ha cambiado", user);
        
    }, [user])


    const login = async (email, password) => {
        
        setLoading(true)
        
        try {
            const response = await loginUser(email, password)

            console.log("DATA RECEIVED AFTER LOGIN", response)
            
            if (response) {
                setUser({email: response.data.user.email, password: response.data.user.password, profilePic: response.data.user.profilePic})
                console.log(response.data)
                setIsLoggedIn(true)
                return response
            }

        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }
    
    const signup = async (name, email, password) => {
        setLoading(true)
        try {
            const data = await signupUser(name, email, password)
            if (data & data.user) {
                setUser({email: data.email, name: data.name})
                setIsLoggedIn(true)
                return data
            } 
        } catch (error) {
            console.log("Somehting went wrong:", error)
            throw error;
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        setLoading(true)

        try {
            const data = await logoutUser()
            console.log(data)
            navigate("/login", {replace: true})
            
            setIsLoggedIn(false)
            setUser(null)
            localStorage.removeItem("auth-data")
            
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        setLoading,
        loading
    }

    /* console.log("Estado actual - Loading:", loading, "isLoggedIn:", isLoggedIn); */

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);