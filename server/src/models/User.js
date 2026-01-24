import mongoose from "mongoose";
import {randomUUID} from 'crypto'

const messageSchema =new mongoose.Schema({
    role: {type: String, required: true},
    content: {type: String, required: true}
})

const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => randomUUID
    },
    title: {type: String, required: true},
    messages: [messageSchema]
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
    profilePic: {
        type: String,
        default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    },
    chats: {type: [chatSchema], default: []}
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        //cambiamos id para que devuelva sin _, y borramos password para que no se revele
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
        delete returnedObject.chats
    }
})


export default mongoose.model('User', userSchema)