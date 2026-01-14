import { Router } from "express";
import sendRequestBedrock from "../services/bedrockService.js" 

const chatRoutes = Router() 

//Ruta de prueba 
chatRoutes.post('/', async (req, res) => {

    const {message} = req.body;

    if (!message) {
        return res.status(400).json({ error: "Algo ha ido mal con el mensaje"})
    }

    try {
        console.log(`[LOG] Procesandi pregunta: "${message}"`)
        
        //Llamamos al servicio de Bedrock, y responde
        const responseAI = await sendRequestBedrock(message);

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
            error: "Ha habido un problema al intentar conectar con la IA"
        })
    }
});


export default chatRoutes