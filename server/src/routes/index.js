import {Router} from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";


const appRouter = Router()

appRouter.use("/health", (req, res) => {
    res.json({status: "ok", uptime: process.uptime()})
})
appRouter.use("/user", userRoutes)
appRouter.use("/chat", chatRoutes)


//Ruta para verifiacar la salud del server
/* appRouter.get('/health', (req, res) => {
    res.json({status: "ok", uptime: process.uptime()})
})
 */
export default appRouter