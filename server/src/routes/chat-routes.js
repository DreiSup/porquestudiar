import { Router } from "express";
/* import {invokeAgent} from "../services/bedrockAgentService.js"  */
import { changeChatTitle, createNewChat, deleteChat, getUniqueChat, getUserChats, postMessage } from "../controllers/chat-controllers.js";
import { verifyToken } from "../utils/token-manager.js";

const chatRoutes = Router() 


chatRoutes.get('/chats', verifyToken, getUserChats)
chatRoutes.get('/:id', verifyToken, getUniqueChat)

chatRoutes.post('/', verifyToken, postMessage)
chatRoutes.post('/new', verifyToken, createNewChat)


chatRoutes.patch('/:id', verifyToken, changeChatTitle)

//delete
chatRoutes.delete("/:id", verifyToken,deleteChat)



export default chatRoutes