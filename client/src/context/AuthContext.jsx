import { createContext } from "react";
import { checkAuthStatus, loginUser, logoutUser, signupUser } from "../services/api";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";


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

    useEffect(() => {
        async function checkStatus() {
            try {
                setLoading(false)
                const data = await checkAuthStatus()
                console.log(data.name)
                if (data) {
                setUser({name: data.name, email: data.email})
                setIsLoggedIn(true)
                } 
                console.log(user);
                
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
        const data = await loginUser(email, password)
        if (data) {
            setUser({email: data.email, password: data.password})
            setIsLoggedIn(true)
            return data
        }
        return null
    }
    
    const signup = async (name, email, password) => {
        const data = await signupUser(name, email, password)
        if (data) {
            setUser({email: data.email, name: data.name})
            setIsLoggedIn(true)
        } 
    }

    const logout = async () => {
        await logoutUser()
    }

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        loading
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);