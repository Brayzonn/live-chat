import mongoose, { ConnectOptions } from 'mongoose';
require('dotenv').config();

const mongoURI = `mongodb+srv://${process.env.MongoName}:${process.env.MongoPass}@zoneyprojects.sjbew2h.mongodb.net/minilink?retryWrites=true&w=majority`


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