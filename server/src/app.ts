import express from 'express';
import http from "http";
import { Server, Socket } from "socket.io";

import allRoutes from './routes/mainRoutes'

// import middleware modules
import corsMiddleware from './middleware/corsMiddleware';
import headersMiddleware from './middleware/headersMiddleware';
import sessionMiddleware from './middleware/sessionMiddleware';
import connectToDb from './config/db';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: process.env.endpoint, 
      methods: ['GET', 'POST'],
    }
});

interface Conversations {
    [key: string]: Socket;
}

const conversations: Conversations = {};

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on('start_conversation', ({ sessionId }) => {
        conversations[sessionId] = socket;
        conversations[sessionId].emit("admin_welcome_message", { message: 'Hello! Welcome to Botchat!' });
        conversations[sessionId].emit("admin_welcome_message", { message: 'How can I be of help?' });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        for (const sessionId in conversations) {
          if (conversations[sessionId] === socket) {
            delete conversations[sessionId];
            break;
          }
        }
    });
      
    socket.on("user_message", (data) => {
        console.log("Message received: ", data);

        const { sessionId, message } = data;

        if (conversations[sessionId]) {
            conversations[sessionId].emit("receive_message", { message: 'fuck off' });
        } else {
            console.error(`No conversation found for session ID: ${sessionId}`);
        }
    });
});

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(corsMiddleware)
app.use(headersMiddleware)
app.use(sessionMiddleware)

app.use('/api', allRoutes)

//connect to db
connectToDb()

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => console.log(`template app listening on port ${PORT}!`));
