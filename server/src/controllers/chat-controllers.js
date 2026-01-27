import User from "../models/User.js";
import { invokeAgent } from "../services/bedrockAgentService.js";


//GET
export const getUserChats = async (req,res) => {
    try {
        
        const user = await User.findById(res.locals.jwtData.id)

        if (!user) {
        return res.status(401).json({ message: "Usuario no registrado" });
        }

        const sortedChats = user.chats.sort((a,b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt)
        })
      
        return res.status(200).json({message: "Ok", sortedChats: sortedChats})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'something went wrong', error})
    }
}


export const getUniqueChat = async (req, res) => {
    
}


//POST
export const createNewChat = async (req, res) => {
    try {
        console.log("YOU ARE TRYNG TO CREATE A NEW CHAT")
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) { return res.status(401).json({ message: "User not found"}) }

        console.log(user.chats)

        if (user.chats.length >= 5 ) {
            return res.status(403).json({ message: "You have reached the limit of 5 conversations"})
        }

        user.chats.push({
            title: "New conversation",
            messages: []
        })

        await user.save()

        const newChat = user.chats[user.chats.length - 1]

        return res.status(201).json({ chat: newChat})

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error trying to create a new chat"})
    }
}

export const postMessage = async (req, res) => {

    const {message, sessionId} = req.body;
    
        if (!message) {
            return res.status(400).json({ error: "Algo ha ido mal con el mensaje"})
        }
    
        try {
            console.log(`[LOG] Procesandi pregunta: "${message}"`)

            const user = await User.findById(res.locals.jwtData.id)
            if (!user) return res.status(404).json({error: "User not found"})

            console.log(user.chats, "Session id:", sessionId)
            
            const chat = user.chats.find(c => c.id === sessionId)
            if (!chat) return res.status(404).json({error: "Chat not found"})

            console.log("this is chat:", chat)

            chat.messages.push({role: "user", content: message})

            //Llamamos al servicio de Bedrock, y responde
            const responseAI = await invokeAgent(message, sessionId);

            chat.messages.push({role: "assistant", content: responseAI})

            await user.save()
    
            //Devolvemos la respuesta de Bedrock
            res.json({
                ok: true,
                messages: chat.messages
            })
    
            console.log("!!!   DEBUG   !!!: esto es responseAI:", responseAI)
    
        } catch (error) {
            console.error("Error en el endpoint /api/chat:", error)
    
            res.status(500).json({
                ok: false,
                error: "Ha habido un problema al intentar conectar con el Agente"
            })
        }
}

export const generateChatCompletion = async (req, res) => {
    const {message, chatId} = req.body

    try {
        const user = await User.findById(res.locals.jwtData.id)
        if(!user) return res.status(401).json({message: "User not found"})

        const currentChat = user.chats.id(chatId)

        if (!currentChat) {
            return res.status(404).json({ message: "Chat not found or deleted"})
        }

        currentChat.messages.push({role: "user", content: message})

        /* const response = await  */
        const aiResponse = "Esta es la respuesta simulada de la IA"

        currentChat.messages.push({role: "assistant", content: aiResponse})

        await user.save()

        return res.status(200).json({chats: user.chats})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error trying to communicate"})
    }
}


//PUT
export const changeChatTitle = async (req, res) => {
    try {
        const userId = await User.findById(res.locals.jwtData.id)

        if (!user) {
        return res.status(401).json({ message: "Usuario no registrado" });
        }

        const chatId = req.params.id
        const {title} = req.body;

        if (!title) {
            return res.status(400).json({ message: "Titol required" });
        }

        const user = await User.findOneAndUpdate(
            {
                _id: userId,
                "chats.id": chatId
            },
            {
                $set: {
                    "chats.$.title": title
                }
            },
            {new: true}
        );

        if (!user) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        const updatedChat = user.chats.find(c => c.id === chatId);

        return res.status(200).json({ message: "Título actualizado", chat: updatedChat });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'something went wrong', error})
    }
}


//DELETE
export const deleteChat = async (req, res) => {
    
    const {id} = req.params 

    try {
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).json({error: "User not found"})
        }

        const initialCount = user.chats.length;
        user.chats = user.chats.filter(chat => chat.id !== id)

        if (user.chats.length === initialCount) {
            return res.status(404).json({error: "Chat did not exist in th DB"})
        }

        await user.save()

        return res.status(200).json({ok: true, message: "Chat deleted", chats: user.chats})
    } catch (error) {
        console.log("Error trying to delete chat: ",error)
        return res.status(500).json({ error: "Internal error"})
    }
}