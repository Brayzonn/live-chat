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
        console.log(`Conversation started with session ID: ${sessionId}`);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("send_message", (data) => {
        console.log("Message received: ", data);
        socket.emit("receive_message", data); 
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
