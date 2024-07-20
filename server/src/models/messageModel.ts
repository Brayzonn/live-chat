import mongoose, { Schema, Document } from 'mongoose';

interface Message {
    text: string;
    isAdmin: boolean;
    timestamp: Date;
}

interface schemaType extends Document{
    sessionID: String,
    messages: Message[],
}

const messageSchema: Schema<schemaType> = new Schema({ 
    sessionID: { type: String, required: true },
    messages: [{
        text: { type: String},
        isAdmin: {type: Boolean},
        timestamp: { type: Date, default: Date.now }
    }]
});


const messageModel = mongoose.model('messageModel', messageSchema);

export default messageModel;