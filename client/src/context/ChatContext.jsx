import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { createNewChat, deleteOneChat, sendChatMessage } from "@/services/chat-api"
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
        console.log("chats desde ChatContent:", chats);
        if (user && user?.chats) {
            setChats(user.chats)
            
        } else {
            /* navigate("/login") */
        }
    }, [user])

    const createChat = async () => {

        setIsLoading(true)

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
        console.log(chatId, chats)
        const foundChat = chats.find(c => c.id === chatId);

        console.log(foundChat)
        if (foundChat) {
            setSelectedChatId(chatId);
            setMessages(foundChat.messages || [])
        }
    }

    const sendMessage = async (content) => {

        if (!selectedChatId) return

        console.log("content:", content)

        const newMsg = {role: "user", content: content}

        setMessages(prev => [...(prev || []), newMsg])

        console.log("NEWMSG:", newMsg)

        try {
            const data = await sendChatMessage(content, selectedChatId)
            console.log("DATA MESSAGES FROM CHATCONTEXT:", data)
            if (data.ok) {
                setMessages([...data.messages])
            }

        } catch (error) {
            console.log("Error trying to send message",error)
        }
    }


    const deleteChat = async (id) => {
        try {
            console.log(id)
            const data = await deleteOneChat(id)

            if (data.ok) {
                setChats(data.chats)
            }
            
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }


    const value = {
        chats,
        messages,
        isLoading,
        createChat,
        selectChat,
        selectedChatId,
        sendMessage,
        deleteChat
    }

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}


export const useChat = () => useContext(ChatContext)