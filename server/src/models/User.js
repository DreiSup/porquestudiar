import mongoose from "mongoose";
import {randomUUID} from 'crypto'

const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID
    },
    role: {
        type: String,
        required: true
    },
    content: {
        //esto es el message
        type: String,
        required: true
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        require: true
    },
    chats: [chatSchema]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        //cambiamos id para que devuelva sin _, y borramos password para que no se revele
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})


export default mongoose.model('User', userSchema)