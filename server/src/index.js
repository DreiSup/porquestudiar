require('dotenv').config();
const express = require('express');
const cors = require('cors');

const {sendRequestBedrock} = require('./services/bedrockService')

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


//Ruta para verifiacar la salud del server
app.get('/health', (req, res) => {
    res.json({status: "ok", uptime: process.uptime()})
})

//Ruta de prueba 
app.post('/api/chat', async (req, res) => {

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

    } catch (error) {
        console.error("Error en el endpoint /api/chat:", error)

        res.status(500).json({
            ok: false,
            error: "Ha habido un problema al intentar conectar con la IA"
        })
    }
});


app.listen(PORT, () => {
    console.log(`
        Server corriendo con éxito
        Endpoint: http://localhost:${PORT}/api/chat
        IA: Amazon Bedrock (Converse API) activo
        `)
})