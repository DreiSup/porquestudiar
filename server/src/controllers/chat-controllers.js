import User from "../models/User.js";
import { invokeAgent } from "../services/bedrockAgentService.js";

export const postMessage = async (req, res) => {
    const {message, sessionId} = req.body;
    
        if (!message) {
            return res.status(400).json({ error: "Algo ha ido mal con el mensaje"})
        }
    
        try {
            console.log(`[LOG] Procesandi pregunta: "${message}"`)
            
            //Llamamos al servicio de Bedrock, y responde
            const responseAI = await invokeAgent(message, sessionId);
    
            //Devolvemos la respuesta de Bedrock
            res.json({
                ok: true,
                response: responseAI
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
    const {message} = req.body

    try {
        const user = await User.findById(res.locals.jwtData.id)
        if(!user) return res.status(401).json({message: "User not found"})

        let currentChat;

        if (user.chats.length === 0) {
            const newChat = {
                title: message.substring(0, 15),
                messages: []
            };
            user.chats.push(newChat);
            currentChat = user.chats[0]
        } else {
            currentChat = user.chats[user.chats.length - 1]
        }

        currentChat.message.push({role: "user", content: message})

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