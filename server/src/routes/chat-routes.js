import { Router } from "express";
/* import {invokeAgent} from "../services/bedrockAgentService.js"  */
import { createNewChat, postMessage } from "../controllers/chat-controllers.js";
import { verifyToken } from "../utils/token-manager.js";

const chatRoutes = Router() 

//Ruta de prueba 
chatRoutes.post('/', postMessage)
chatRoutes.post('/new', verifyToken, createNewChat)


export default chatRoutes