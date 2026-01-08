const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Ruta de prueba 
app.post('/api/chat', (req, res) => {
    const {mensaje} = req.body;
    console.log("Mensaje recibido del usuario:", mensaje)

    // de momento devuelvo una respuesta estática, simuando la IA
    res.json({
        respuesta: `Hola, he recibido tu mensaje: "${mensaje}". Pronto estaré conectado con Bedrock`
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en https://localhost:${PORT}`)
})