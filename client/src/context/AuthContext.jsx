/* import { createContext } from "react";
import { loginUser, signupUser } from "../services/api"; */


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

/* const AuthContext = createContext(null)

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            setUser({email: data.email, password: data.password})
            setIsLoggedIn(true)
        } 
    }

    const logout = async () => {
        await logoutUser()
    }

} */