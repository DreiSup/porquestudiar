import { Router } from "express";
/* import {invokeAgent} from "../services/bedrockAgentService.js"  */
import { postMessage } from "../controllers/chat-controllers.js";

const chatRoutes = Router() 

//Ruta de prueba 
chatRoutes.post('/', postMessage)


export default chatRoutes