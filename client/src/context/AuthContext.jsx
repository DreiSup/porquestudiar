import { createContext } from "react";
import { checkAuthStatus, loginUser, logoutUser, signupUser } from "../services/user-api";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


/* const User = {
    name, email
}

const UserAuth = {
    isLoggedIn,
    user: User | null,
    login: (email, password)=>Promise<void>;
    signup: (name, email , password)=>Promise<void>;
    logout: (name ,email , password)=>Promise<void>;

} */

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
                console.log("Sesión no válida o expirada", error)
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
            const data = await loginUser(email, password)
            
            if (data) {
                setUser({email: data.email, password: data.password, profilePic: data.profilePic})
                setIsLoggedIn(true)
                return data
            }

        } catch (error) {
            console.log(error)
            return null
        } finally {
            setLoading(false)
        }
    }
    
    const signup = async (name, email, password) => {
        const data = await signupUser(name, email, password)
        if (data) {
            setUser({email: data.email, name: data.name})
            setIsLoggedIn(true)
        } 
    }

    const logout = async () => {

            const data = await logoutUser()
            console.log(data)
            setIsLoggedIn(false)
            setUser(null)
    
            localStorage.removeItem("auth-data")
    
            console.log("después de navigate")
            window.location.reload()

    }

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        loading
    }

    /* console.log("Estado actual - Loading:", loading, "isLoggedIn:", isLoggedIn); */

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);