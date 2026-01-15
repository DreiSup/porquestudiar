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