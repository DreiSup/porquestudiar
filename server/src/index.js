import app from "./app.js"
import 'dotenv/config';
import { connectToDatabase } from "./db/connection.js";

const PORT = process.env.PORT || 3000;


//connection and listeners
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`
            Server open and connected to DB
            Endpoint: http://localhost:${PORT}/api/chat
            IA: Amazon Bedrock (Converse API) active 
            `)
    })

}).catch((err) => console.log(err) )