import apiClient from "./axios-client"

const api = apiClient


export const getUserChats = async () => {
    try {
        const res = await api.get("/chat/chats")

        console.log("!!!!!!!!!!!!!!!", res)

        return res.data
    } catch (error) {
        console.log(error)
    }
}


//POST
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



//DELETE
export const deleteOneChat = async (id) => {
    try {
        console.log(id)
        const response = await api.delete(`/chat/${id}`)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
    }
}