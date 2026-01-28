import mongoose from "mongoose";
import {randomBytes, randomUUID} from 'crypto'

const messageSchema =new mongoose.Schema({
    role: {type: String, required: true},
    content: {type: String, required: true}
})

const chatSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => randomUUID()
    },
    title: {type: String, required: true},
    messages: [messageSchema]
    }, {
        timestamps: true
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
        default: () => {
            const seed = randomBytes(8).toString('hex');
            return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
        }
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