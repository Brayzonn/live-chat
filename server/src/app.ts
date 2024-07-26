import express from 'express';
import http from "http";
import allRoutes from './routes/mainRoutes'

// import middleware modules
import webSocketConfig from './middleware/socket';
import corsMiddleware, { corsOptions } from './middleware/corsMiddleware';
import headersMiddleware from './middleware/headersMiddleware';
import sessionMiddleware from './middleware/sessionMiddleware';
import connectToDb from './config/db';

const app = express();
const server = http.createServer(app);

// Use middleware
webSocketConfig(server, corsOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(corsMiddleware)
app.use(headersMiddleware)
app.use(sessionMiddleware)

app.use('/api', allRoutes)

//connect to db
connectToDb()

const PORT = process.env.PORT || 3300;

server.listen(PORT, () => console.log(`chat bot listening on port ${PORT}!`));
