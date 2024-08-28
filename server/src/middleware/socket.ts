import { Server } from 'socket.io';
import http from "http";
import { CorsOptions } from 'cors';


import messageModel from '../models/messageModel';
import conversationModel from '../models/conversationsModel';
import sendMessageNotificationEmail from '../utils/nodemailer';
import ensureAdminSocket from '../utils/socketAuth';



const webSocketConfig = async (server: http.Server, corsOptions: CorsOptions) => {
    const io = new Server(server, {
        cors: corsOptions
    });

    io.on('connection', (socket) => {

        //when user starts conversation
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
        socket.on('reconnect_session', async ({ sessionId }: { sessionId: string }) => {

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
                                    await sendMessageNotificationEmail(message)
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
        socket.on('admin_signin', (data) => {
            ensureAdminSocket(data, socket, async () => {
                const { sessionId } = data;
        
                const findConversations = await conversationModel.find({});
        
                if (findConversations.length === 0) {
                    io.to(sessionId).emit('admin_errors_feedback', { message: 'No sessions available' });
                } else {
                    socket.join(sessionId);
        
                    const allSessionData = [];
        
                    for (const conversation of findConversations) {
                        try {
                            const sessionData = await messageModel.find({ sessionID: conversation.sessionID }, { _id: 0, 'messages._id': 0 });
                            allSessionData.push(...sessionData);
                        } catch (err) {
                            console.error(`Error fetching data for conversation ID: ${conversation.sessionID}`, err);
                        }
                    }
                    io.to(sessionId).emit('active_rooms_info', { allSessionData });
                }
            });
        });
        
        
        // Handle the admin joining a user's conversation
        socket.on('admin_join_conversation', (data) => {
            ensureAdminSocket(data, socket, async () => {
                const{ userSessionId, adminSessionId } = data;

                try {
                    const existingSession = await messageModel.findOne({ sessionID: userSessionId }, { _id: 0, 'messages._id': 0 });

                    if(existingSession){
                        socket.join(userSessionId);
                        io.to(adminSessionId).emit("all_user_messages", {existingSession });
                        io.to(userSessionId).emit('admin_activity', { status: true, message: 'Admin has joined the conversation' });
                        io.to(adminSessionId).emit('admin_activity',{ status: true, message: `You have joined the session` });
                    }
                } catch (error) {
                        console.error('Error joining admin to user session:', error);
                        socket.emit('admin_errors_feedback', { message: 'Failed to join the session' });
                }
            });
        });

        socket.on('admin_leave_conversation', (data) => {
            ensureAdminSocket(data, socket, async () => {
                const{ userSessionId, adminSessionId } = data;

                try {
                    const existingSession = await messageModel.findOne({ sessionID: userSessionId }, { _id: 0, 'messages._id': 0 });

                    if(existingSession){
                        io.to(userSessionId).emit('admin_activity', { status: false, message: 'Admin has left the conversation' });
                    }
                } catch (error) {
                        console.error('Error leaving user session:', error);
                }
            })
        });


        socket.on('admin_message', (data) => {
            ensureAdminSocket(data, socket, async () => {
                const { userSessionID, adminSessionID, message } = data;

                const findConversation = await messageModel.findOne({sessionID: userSessionID})

                if (findConversation) {
                    const newMessage = { text: message, timestamp: new Date(), isAdmin: true };
                    findConversation.messages.push(newMessage);

                    try {
                        await findConversation.save();

                        const updatedSessionInfo = await messageModel.findOne({sessionID: userSessionID}, { _id: 0, 'messages._id': 0 })
                    
                        if(updatedSessionInfo){
                            io.in(userSessionID).emit("all_user_messages", { message, updatedSessionInfo });
                        }
                    } catch (error) {
                        console.error(`Error saving message for session ID: ${userSessionID}`, error);
                    }
                    
                } else {
                    console.error(`No conversation found for session ID: ${userSessionID}`);
                }
            })
        });

        //when admin ends conversation and delete history
        socket.on('end_conversation', (data) => {
            ensureAdminSocket(data, socket, async () => {
                const { userSessionID, adminSessionID } = data;
            
                try {
                    if (adminSessionID === 'admin') {
                        const conversations = await conversationModel.findOne({ sessionID: userSessionID });
                        const findMessageModel = await messageModel.findOne({ sessionID: userSessionID });
            
                        if (conversations && findMessageModel) {
                            await conversationModel.deleteOne({ sessionID: userSessionID });
                            await findMessageModel.deleteOne({ sessionID: userSessionID });

                            socket.emit('admin_success_feedback', {message: 'Conversation ended'})
                        }
                    }         
                } catch (error) {
                    console.log(error);
                    socket.emit('admin_errors_feedback', { message: 'Failed to end conversation' });
                }
            })
        });
        
    });
};

export default webSocketConfig;
