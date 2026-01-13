import User from "../models/User.js"
import { genSaltSync, hashSync} from "bcrypt"

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
        
        if (password.length < 3){
            return res.status(400).json({error: "The password must be at least 3 characters long"})
        }

        const salt = genSaltSync(10)
        const passwordHash = hashSync(password, salt)
        console.log(passwordHash)

        const user = new User ({
            name, 
            email,
            passwordHash
        })

        const savedUser = await user.save()

        return res.status(201).json(savedUser)

    } catch (error) {
        console.log(error)
        return res.status(404).json({message: 'Error trying to signup user: ', error})
    }
}