import { Router } from "express";
import { getAllUsers, getUser, userLogIn, userSignUp } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";


const userRoutes = Router()

userRoutes.get("/", getAllUsers)
userRoutes.get("/:id", getUser)
userRoutes.post("/signup", validate(signupValidator) , userSignUp)
userRoutes.post("/login", validate(loginValidator), userLogIn)



export default userRoutes