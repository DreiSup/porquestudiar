import axios from 'axios'
const PORT = import.meta.env.VITE_PORT

const baseUrl = `http://localhost:${PORT}/api`

const api = axios.create({
    baseURL: baseUrl
});

export const sendMessage = async (message, sessionId) => {
    try{
        const response = await api.post('/chat', { message: message, sessionId: sessionId })
        return response.data
    } catch (error) {
        console.log("Something went wrong", error)
        throw error
    }
}

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
        console.log(baseUrl)
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

    }