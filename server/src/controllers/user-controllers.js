import User from "../models/User.js"
import { genSaltSync, hashSync, compare} from "bcrypt"
import { createToken } from "../utils/token-manager.js"
import { COOKIE_NAME } from "../utils/constants.js"

export const getAllUsers = async (req, res) => {
    //get all users form DB
    try {
        const users = await User.find({})
        
        return res.status(200).json({message: "ok", users})

    } catch (error) {
        console.log(error)
        return res.status(404).json({message: 'something went wrong', error})
    }
}

export const getUser = async (req,res) => {
    try {
        console.log("BACKEEEND")
        const user = await User.findById(req.params.id)
        
        console.log(user)
        return res.json(user)

    } catch (error) {
        console.log(error)
        return res.status(404).json({message: 'something went wrong', error})
    }
}

export const userSignUp = async (req, res) => {
    //sign up user
    try {
        const {name, email, password} = req.body

        const salt = genSaltSync(10)
        const passwordHash = hashSync(password, salt)
        console.log(passwordHash)

        const user = new User ({
            name, 
            email,
            passwordHash
        })

        await user.save()

        //create token and store cookie
        res.clearCookie(COOKIE_NAME, {
                path: "/",
                domain:"localhost",
                httpOnly: true,
                signed: true
            })

        const token = createToken(user._id.toString(), user.email, "7d")
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)
        //cambiar esto en caso de deploy
        res.cookie(COOKIE_NAME, token, {
            path: "/",
            domain:"localhost",
            expires:"",
            httpOnly: true,
            signed: true
        })

        return res.status(201).json({mesage: "OK", name: user.name, email: user.email })

    } catch (error) {
        console.log(error)
        return res.status(404).json({message: 'Error trying to signup user: ', error})
    }
}

export const userLogIn = async (req, res) => {
    try {
            const {email, password} = req.body
    
            const user = await User.findOne({email})
            console.log(user)
    
            const isPasswordCorrect = user === null
                ? false
                : await compare(password, user.passwordHash)
    
            if (!(user && isPasswordCorrect)) {
                return res.status(401).json({ error: "invalid email or password"})
            }

            res.clearCookie(COOKIE_NAME, {
                path: "/",
                domain:"localhost",
                httpOnly: true,
                signed: true
            })
    
            const token = createToken(user._id.toString(), user.email, "7d")
            const expires = new Date()
            expires.setDate(expires.getDate() + 7)
            //cambiar esto en caso de deploy
            res.cookie(COOKIE_NAME, token, {
                path: "/",
                domain:"localhost",
                expires:"",
                httpOnly: true,
                signed: true
            })
    
            res.status(200).send({message: "Login OK",token, user: user.email})
    
        } catch (error) {
            console.log(error)
        }
} 


/* export const userLogout = async () => {
    try {
        const {}

        const user = User.findById({})
    } catch (error) {
        console.log(error)
    }
} */