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

export const getUniqueChat = async (chatId) => {
    try {
        const res = await api.get(`/chat/${chatId}`)

        console.log(res)
        return res.data.chat
    } catch (error) {
        console.log(error);
        
    }
}


//POST
export const createNewChat = async () => {
    try {
        console.log("creating new chat")

        const res = await api.post("/chat/new")

        console.log(res)

        return res

    } catch (error) {
        console.log(error)
        return error
    }
} 

export const sendChatMessage = async (message, sessionId) => {
    try{
        console.log("DESDE CHAT-API:", message, sessionId)
        const response = await api.post('/chat', { message: message, sessionId: sessionId })

        console.log(response)
        return response.data
    } catch (error) {
        console.log("Something went wrong", error)
        throw error
    }
}


//PATCH
export const changeChatTitle = async (id, editTitle) => {
    try {
        const res = await api.patch(`/chat/${id}`, { title: editTitle });
        console.log(res)
        return res.data
    } catch (error) {
        console.log(error)
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