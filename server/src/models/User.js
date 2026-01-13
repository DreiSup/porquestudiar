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

//implementa el userSchema.set que tienes de FSO y ten en cuenta para adelante hashear la password


export default mongoose.model('User', userSchema)