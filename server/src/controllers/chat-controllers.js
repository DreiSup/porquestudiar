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
    try {
        const chatId = req.params.id

        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "Usuario no registrado o Token inválido" });
        }

        const chat = user.chats.find(c => c.id === chatId || c._id.toString() === chatId);

        if (!chat) {
          return res.status(404).json({ message: "Chat no encontrado" });
        }

        return res.status(200).json({ message: "OK", chat });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error trying to get chat", error: error.message });
    }
}


//POST
export const createNewChat = async (req, res) => {
    try {
        /* console.log("YOU ARE TRYNG TO CREATE A NEW CHAT") */
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) { return res.status(401).json({ message: "User not found"}) }
        /* console.log(user.chats) */
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

            /* console.log("this is chat:", chat) */

            chat.messages.push({role: "user", content: message})


            //LOGICA QUE VERIFICA SI ES EL 1ER MENSAJE, Y CAMBIA chat.title
            if (chat.messages.length <= 1 || chat.title === "Nuevo Chat" || chat.title === "New conversation") {
            
                // Dividimos el mensaje en palabras, quitando espacios extra
                const words = message.trim().split(/\s+/);
                let newTitle = "";

                if (words.length > 0) {
                    if (words.length === 1) {
                        // Si es solo una palabra: "Hola"
                        newTitle = words[0];
                    } else {
                        // Si son más, tomamos las primeras 3
                        newTitle = words.slice(0, 3).join(" ");
                    }

                    // Capitalizamos la primera letra (opcional, por estética)
                    chat.title = newTitle.charAt(0).toUpperCase() + newTitle.slice(1);
                    
                    console.log(`[LOG] Título del chat actualizado a: "${chat.title}"`);
                }
            }

            //Llamamos al servicio de Bedrock, y responde
            const responseAI = await invokeAgent(message, sessionId);

            chat.messages.push({role: "assistant", content: responseAI})

            await user.save()
    
            //Devolvemos la respuesta de Bedrock
            res.json({
                ok: true,
                messages: chat.messages,
                chatTitle: chat.title
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

/* export const generateChatCompletion = async (req, res) => {
    const {message, chatId} = req.body

    try {
        const user = await User.findById(res.locals.jwtData.id)
        if(!user) return res.status(401).json({message: "User not found"})

        const currentChat = user.chats.id(chatId)

        if (!currentChat) {
            return res.status(404).json({ message: "Chat not found or deleted"})
        }

        currentChat.messages.push({role: "user", content: message})

        const aiResponse = "Esta es la respuesta simulada de la IA"

        currentChat.messages.push({role: "assistant", content: aiResponse})

        await user.save()

        return res.status(200).json({chats: user.chats})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error trying to communicate"})
    }
} */


//PUT
export const changeChatTitle = async (req, res) => {
    try {
        const user = await User.findById(res.locals.jwtData.id)

        if (!user) {
        return res.status(401).json({ message: "User not registered" });
        }

        const chatId = req.params.id
        const {title} = req.body;
        
        console.log("chatid: ",chatId)
        console.log("title: ",title)

        if (!title) {
            return res.status(400).json({ message: "Titol required" });
        }

        const userToModify = await User.findOneAndUpdate(
            {
                _id: user.id,
                "chats._id": chatId
            },
            {
                $set: {
                    "chats.$.title": title
                }
            },
            {new: true}
        );

        console.log(userToModify)

        if (!userToModify) {
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

        user.chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

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