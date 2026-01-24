import apiClient from "./axios-client"

const api = apiClient

export const signupUser = async (name, email, password) => {
    
        console.log(name, email, password)
        const res = await api.post("/user/signup", {name, email, password});
        if (res.status !== 201) {
            throw new Error("Unable to Signup")
        }
        
        return res
    }

export const loginUser = async (email, password) => {
    
        console.log(email, password)
        const res = await api.post("/user/login", {email, password});
        if (res.status !== 200) {
            throw new Error("Unable to login")
        }
        
        return res
    }

export const logoutUser = async () => {

    console.log("Trying to logout user...")
    const res = await api.post("/user/logout")
    
    if (res.status !== 200) {
        throw new Error("Unable to logout user")
    } 
                
    const data = await res.data
    console.log(data)
    return true
}

export const checkAuthStatus = async () => {

    const res = await api.get("/user/auth-status")
    
    if (res.status !== 200) {
        throw new Error("Unable to authenticate")
    } 
                
    const data = await res.data
    return data
}
