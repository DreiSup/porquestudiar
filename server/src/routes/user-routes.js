import { Router } from "express";
import { getAllUsers, getUser, userLogIn, userSignUp, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";


const userRoutes = Router()

userRoutes.get("/", getAllUsers)
userRoutes.get("/:id", getUser)
userRoutes.post("/signup", validate(signupValidator) , userSignUp)
userRoutes.post("/login", validate(loginValidator), userLogIn)
userRoutes.get("/auth-status", verifyToken(), userLogIn)

export default userRoutes