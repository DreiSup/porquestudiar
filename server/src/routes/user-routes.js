import { Router } from "express";
import { getAllUsers, getUser, userLogIn, userLogout, userSignUp, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";


const userRoutes = Router()

userRoutes.get("/", getAllUsers)
userRoutes.post("/signup", validate(signupValidator) , userSignUp)
userRoutes.post("/login", validate(loginValidator), userLogIn)
userRoutes.post("/logout", verifyToken, userLogout)
userRoutes.get("/auth-status", verifyToken, verifyUser)
userRoutes.get("/:id", getUser)

export default userRoutes