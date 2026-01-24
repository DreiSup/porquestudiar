import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { createNewChat, sendChatMessage } from "@/services/chat-api"
import { useNavigate } from "react-router-dom"

const ChatContext = createContext(null)

export const ChatProvider = ({children}) => {

    const {user} = useAuth()

    const navigate = useNavigate()

    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("user desde ChatContent:",user)
        console.log("user.chats desde ChatContent:",user?.chats);
        if (user && user?.chats) {
            setChats(user.chats)
            
        } else {
            /* navigate("/login") */
        }
    }, [user])

    const createChat = async () => {

        isLoading(true)

        try {
            const data = await createNewChat()
            setChats([...chats, data.chat])
            setSelectedChatId(data.chat._id)
            setMessages([])

        } catch (error) {
            console.log("Error creando el chat", error)
        } finally {
            setIsLoading(false)
        }
    }

    const selectChat = async (chatId) => {
        const foundChat = chats.find(c => c._id === chatId);
        if (foundChat) {
            setSelectedChatId(chatId);
            setMessages(foundChat.messages || [])
        }
    }

    const sendMessage = async (content) => {

        if (!selectedChatId) return

        const newMsg = {role: "user", message: content}
        setMessages(prev => [...(prev || []), newMsg])

        try {
            const data = await sendChatMessage(content, selectedChatId)
            console.log("DATA MESSAGES FROM CHATCONTEXT:", data)
            setMessages(data.messages)

        } catch (error) {
            console.log("Error trying to send message",error)
        }
    }


    const value = {
        chats,
        messages,
        isLoading,
        createChat,
        selectChat,
        selectedChatId,
        sendMessage
    }

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}


export const useChat = () => useContext(ChatContext)