import { Router } from "express";
import { getAllUsers, getUser, userSignUp } from "../controllers/user-controllers.js";


const userRoutes = Router()

userRoutes.get("/", getAllUsers)
userRoutes.get("/:id", getUser)
userRoutes.post("/signup", userSignUp)



export default userRoutes