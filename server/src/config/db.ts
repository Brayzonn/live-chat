import mongoose, { ConnectOptions } from 'mongoose';
require('dotenv').config();

const mongoURI = process.env.mongoURI ? process.env.mongoURI : ''


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