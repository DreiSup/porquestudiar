import apiClient from "./axios-client"

const api = apiClient

export const createNewChat = async () => {
    try {
        console.log("creating new chat")

        const res = await api.post("/chat/new")

        return res.data

    } catch (error) {
        console.log(error)
    }
} 

export const sendChatMessage = async (message, sessionId) => {
    try{
        const response = await api.post('/chat', { message: message, sessionId: sessionId })
        return response.data
    } catch (error) {
        console.log("Something went wrong", error)
        throw error
    }
}