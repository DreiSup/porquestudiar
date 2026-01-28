import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import { changeChatTitle, createNewChat, deleteOneChat, getUniqueChat, getUserChats, sendChatMessage } from "@/services/chat-api"
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
        /* console.log("user.chats desde ChatContent:",user?.chats);
        console.log("chats desde ChatContent:", chats); */
        if (user && user?.chats) {
            console.log(user?.chats)
            const sorted = [...user.chats].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setChats(sorted);
        } else {
            /* navigate("/login") */
        }
    }, [user])


    const getOneChat = async (chatId) => {
        try {
            const data = await getUniqueChat(chatId)
            
            console.log(data)
            return data
        } catch (error) {
            console.log(error);
        }
    }

    const getAllChats = async () => {
        try {
            const data = await getUserChats()

            return data
        } catch (error) {
            console.log(error)
        }
    }

    const createChat = async () => {

        setIsLoading(true)

        try {
            const data = await createNewChat()
            setChats([...chats, data.chat])
            setSelectedChatId(data.chat._id)
            setMessages([])
            console.log(chats)

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

            setChats ((prevChats) => {
            const currentChat = prevChats.find(c => (c.id) === selectedChatId);
        
            if (!currentChat) return prevChats

            const otherChats = prevChats.filter(c => (c.id) !== selectedChatId)

            const newTitleFromBackend = data.chatTitle;

            const updatedChat = {
                ...currentChat,
                updatedAt: new Date().toISOString(),
                title: (newTitleFromBackend && newTitleFromBackend !== currentChat.title)
                    ? newTitleFromBackend 
                    : currentChat.title
            }

            return [updatedChat, ...otherChats]
        })

        } catch (error) {
            console.log("Error trying to send message",error)
        }
    }


    const updateChatTitle = async (id, editTitle) => {
        try {
            const res = await changeChatTitle(id, editTitle)
            console.log(res)
            return res.data
        } catch (error) {
            console.log(error)
        }
    }


    const deleteChat = async (id) => {
        try {
            console.log(id)
            const data = await deleteOneChat(id)

            if (data.ok) {
                const updatedChats = data.chats || [];
                setChats(updatedChats)

                if (selectedChatId === id) {
                    if (updatedChats.length > 0) {
                        // Como el backend los devuelve ordenados por updatedAt, 
                        // el índice [0] es el último chat utilizado.
                        const nextChat = updatedChats[0];
                        
                        // Actualizamos el ID seleccionado
                        setSelectedChatId(nextChat.id);
                        
                        // Actualizamos los mensajes con los del nuevo chat seleccionado
                        setMessages(nextChat.messages || []);
                        
                        console.log("Cambiando al chat más reciente:", nextChat.id);
                    } else {
                        // Si no quedan más chats, limpiamos la selección y los mensajes
                        setSelectedChatId(null);
                        setMessages([]);
                    }
                }
            }
            
            
            

            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }


    const value = {
        chats,
        setChats,
        messages,
        isLoading,
        selectChat,
        selectedChatId,
        setSelectedChatId,
        getOneChat,
        createChat,
        sendMessage,
        deleteChat,
        getAllChats,
        updateChatTitle
    }

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}


export const useChat = () => useContext(ChatContext)