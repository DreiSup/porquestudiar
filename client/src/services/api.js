import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
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

export const signUp = async (name, email, password) => {
    
        console.log(name, email, password)
        const res = await api.post("/user/signup", {name, email, password});
        if (res.status !== 201) {
            throw new Error("Unable to Signup")
        }
        
        return res
    }
