import User from "../models/User.js"
import { Router } from "express";
import { compare } from "bcrypt"
import jwt from "jsonwebtoken"


const loginRoutes = Router()

loginRoutes.post("/", async (req, res) => {
    try {
        const {name, password} = req.body

        const user = await User.findOne({name})
        console.log(user)

        const passwordCorrect = user === null
            ? false
            : await compare(password, user.passwordHash)

        if (!(user && passwordCorrect)) {
            return res.status(401).json({ error: "invalid name or password", user})
        }

        const userForToken = {
            name: user.name,
            id: user._id
        }

        const token = jwt.sign(userForToken, process.env.JWT_SECRET)

        res.status(200).send({token, user: user.name})

    } catch (error) {
        console.log(error)
    }
})


export default loginRoutes