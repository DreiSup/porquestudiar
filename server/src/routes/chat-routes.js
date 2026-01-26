import { Router } from "express";
/* import {invokeAgent} from "../services/bedrockAgentService.js"  */
import { createNewChat, deleteChat, postMessage } from "../controllers/chat-controllers.js";
import { verifyToken } from "../utils/token-manager.js";

const chatRoutes = Router() 


chatRoutes.post('/', verifyToken, postMessage)
chatRoutes.post('/new', verifyToken, createNewChat)


//delete
chatRoutes.delete("/:id", verifyToken,deleteChat)



export default chatRoutes