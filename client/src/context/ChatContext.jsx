import { createContext, useState } from "react"
import { useAuth } from "./AuthContext"

const chatContext = createContext()

export const ChatProvider = ({children}) => {
    const {user} = useAuth()

    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [message, setMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);


}