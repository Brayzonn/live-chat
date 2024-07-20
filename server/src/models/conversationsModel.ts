import mongoose, { Schema, Document, model } from 'mongoose';

interface conversationDocument extends Document {
    sessionID: string;
    socketID: string[];
}

const conversationSchema: Schema<conversationDocument> = new Schema({ 
    sessionID: { type: String},
    socketID: { type: [String] }
});

const conversationModel = mongoose.model('conversationModel', conversationSchema);

export default conversationModel;




