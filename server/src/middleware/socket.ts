import { Server } from 'socket.io';
import http from "http";
import messageModel from '../models/messageModel';
import conversationModel from '../models/conversationsModel';
import { CorsOptions } from 'cors';


const webSocketConfig = async (server: http.Server, corsOptions: CorsOptions) => {
    const io = new Server(server, {
        cors: corsOptions
    });

    io.on('connection', (socket) => {
        console.log('New client connected');

        //when user joins conversation
        socket.on('start_conversation', async ({ sessionId }: { sessionId: string }) => {

            const findConversation = await conversationModel.findOne({sessionId})

            if (!findConversation) {
                const conversation = new conversationModel({
                    sessionID: sessionId,
                    socketID: []
                });

                if (!conversation.socketID.includes(socket.id)) {
                    conversation.socketID.push(socket.id);
                    await conversation.save();
                }
            }
        
            try {
                const existingSession = await messageModel.findOne({ sessionID: sessionId });
        
                if (!existingSession) {

                    const newMessage = { text: 'Hello! How can I help you?', timestamp: new Date(), isAdmin: true };
                   
                    const createSessionData = new messageModel({
                        sessionID: sessionId,
                        messages: []
                    });

                    createSessionData.messages.push(newMessage);
        
                    await createSessionData.save();
                   
                    socket.join(sessionId);

                    const updatedSessionInfo = await messageModel.findOne({sessionID: sessionId}, { _id: 0, 'messages._id': 0 })
                            
                    if(updatedSessionInfo){
                        io.in(sessionId).emit("all_user_messages", { updatedSessionInfo });
                    }
                }

            } catch (error) {
                console.error(`Error starting conversation for session ID: ${sessionId}`, error);
            }
        });


        //reconnect user to session
        socket.on('reconnect_session', async ({ sessionId }) => {

            const findconversation = await conversationModel.findOne({sessionID: sessionId});
    
            if (findconversation && !findconversation.socketID.includes(socket.id)) {
                socket.join(sessionId);
                findconversation.socketID.push(socket.id);
                await findconversation.save();

                const updatedSessionInfo = await messageModel.findOne({sessionID: sessionId}, { _id: 0, 'messages._id': 0 })
                            
                if(updatedSessionInfo){
                    io.in(sessionId).emit("all_user_messages", { updatedSessionInfo });
                }
            }
        });
        

        //when user sends messages
        socket.on('user_message', async (data: { sessionId: string, message: string }) => {
            const { sessionId, message } = data;

            try {
                const findConversation = await conversationModel.findOne({sessionID: sessionId})

                if (findConversation) {
                        const findSession = await messageModel.findOne({sessionID: sessionId})
    
                        if(findSession){
                            const newMessage = { text: message, timestamp: new Date(), isAdmin: false };
                            findSession.messages.push(newMessage);

                            try {
                                await findSession.save();
                                const updatedSessionInfo = await messageModel.findOne({sessionID: sessionId}, { _id: 0, 'messages._id': 0 })
                            
                                if(updatedSessionInfo){
                                    io.in(sessionId).emit("all_user_messages", { message, updatedSessionInfo });
                                }
                               
                            } catch (error) {
                                console.error(`Error saving message for session ID: ${sessionId}`, error);
                            }
                        } else {
                            console.error(`No conversation found for session ID: ${sessionId}`);
                        }
                }else{
                    console.error(`No conversation found for user`);
                }
    
            } catch (error) {
                console.error(`No conversation found ${sessionId}`, error);
            } 
        });


        //send all available session data to admin on dashboard login
        socket.on('admin_join', async ({ sessionId }: { sessionId: string }) => {
            const findConversation = await conversationModel.find({})

            if(sessionId === "admin"){
                if (findConversation.length === 0) {
                    io.to(sessionId).emit('admin_errors_feedback', { message: 'No sessions available' });
                } else {
                    for (const sessionID of findConversation) {
                        socket.join(sessionId);
        
                        try {
                            const sessionData = await messageModel.find({ sessionID: sessionID }, { _id: 0, 'messages._id': 0 });
                            socket.emit('active_rooms_info', { sessionData });
                            io.to(sessionId).emit('admin_message', { message: 'Admin has joined the conversation' });
                        } catch (err) {
                            console.error(`Error fetching data for session ID: ${sessionId}`, err);
                        }
                    }
                }
            }
        });

        // socket.on('admin_message', async (data: { sessionId: string, message: string }) => {
        //     const { sessionId, message } = data;

        //     const findConversation = await ConversationModel.findOne({sessionId})

        //     if (conversations[sessionId]) {
        //         io.to(sessionId).emit("received_user_message", { message: `Admin: ${message}`, sessionId });
        //     } else {
        //         console.error(`No conversation found for session ID: ${sessionId}`);
        //     }
        // });

        socket.on('disconnect', async () => {
            console.log('Client disconnected');

            // try {
            //     const conversations = await ConversationModel.find({ socketIds: socket.id });

            //     for (const conversation of conversations) {
            //         // Remove the disconnected socket ID from the conversation
            //         const updatedSocketIds = conversation.socketIds.filter(id => id !== socket.id);

            //         if (updatedSocketIds.length === 0) {
            //             // If no socket IDs left, delete the conversation
            //             await ConversationModel.deleteOne({ sessionId: conversation.sessionId });
            //         } else {
            //             // Otherwise, update the conversation with the remaining socket IDs
            //             conversation.socketIds = updatedSocketIds;
            //             await conversation.save();
            //         }
            //     } 
            // } catch (error) {
            //     console.log(error)
            // }
        });
    });
};

export default webSocketConfig;
