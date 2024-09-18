import mongoose from 'mongoose';
require('dotenv').config();

const mongoURI = process.env.MONGO_URI ? process.env.MONGO_URI : ''


//connect to Mongo
async function connectToDatabase() {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions);
      console.log('MongoDB connected.....');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

export default connectToDatabase