import mongoose, { Schema, Document } from 'mongoose';

interface schemaType extends Document{
    username: string;
    email: string;
    password: string;
    date: Date;
}

const userSchema: Schema<schemaType> = new Schema({ 
    username: String,
    email: String,
    password: String,
    date: { type: Date, default: Date.now }
});


const userModel = mongoose.model('userModel', userSchema);

export default userModel;