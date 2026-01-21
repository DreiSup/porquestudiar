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

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
        async function checkStatus() {
            const data = await checkAuthStatus()
            if (data) {
            setUser({email: data.email, password: data.password})
            setIsLoggedIn(true)
            } 
        }
        checkStatus()
    }, [])


    const login = async (email, password) => {
        const data = await loginUser(email, password)
        if (data) {
            setUser({email: data.email, password: data.password})
            setIsLoggedIn(true)
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
        await logoutUser()
    }

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);