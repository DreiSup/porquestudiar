import { Router } from "express";
import { getAllUsers, getUser, userLogIn, userSignUp } from "../controllers/user-controllers.js";


const userRoutes = Router()

userRoutes.get("/", getAllUsers)
userRoutes.get("/:id", getUser)
userRoutes.post("/signup", userSignUp)
userRoutes.post("/login", userLogIn)



export default userRoutes