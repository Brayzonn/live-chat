import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

import Chatbox from './Chatbox';
import { ConversationSchema } from '../assets/Types';

const AdminChatBox = () => {

    //session storate variables
    const userSessionIDFromSessionStorage = sessionStorage.getItem('userSessionID');

    const [chatboxActive, updateChatBoxActivity] = useState<boolean>(false);
    const [isAdminOnline, updateIsAdminOnline] = useState<boolean>(false)

    const ENDPOINT = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : '';
    const [socket, setSocket] = useState<Socket | null>(null);

    const [allSessionData, updateAllSessionData] = useState<ConversationSchema[]>([]);
    const [activeUserSessionData, updateActiveUserSessionData] = useState<ConversationSchema>({
        sessionID: '',
        messages: []
    });



    //
    useEffect(() => {
        if (socket) {
            socket.on('all_user_messages', (data) => {
                const { updatedSessionInfo } = data;

                updateActiveUserSessionData(updatedSessionInfo)
            });
        }

        return () => {  
            if (socket) {
                socket.off('all_user_messages');
            }
        };
    }, [socket]);
    
    //get available all sessions 
    const adminGetAllSessions = () => {
        if (!socket) {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);

            newSocket.emit('admin_signin', { sessionId: 'admin' });

            newSocket.on('active_rooms_info', (data) => {
                const { allSessionData } = data;
                updateAllSessionData(allSessionData);
            });

            newSocket.on('admin_errors_feedback', (data) => {
                const { message } = data;

                toast.error(message, {
                    position:"top-center",
                    autoClose: 5000,
                    hideProgressBar:false,
                    closeOnClick:true,
                    rtl:false,
                    pauseOnFocusLoss:false,
                    draggable:false,
                    pauseOnHover: false,   
                });
                
            });
        }
    };

    //when admin closes socket connection
    const closeSocket = () => {
        if (socket) {
            socket.emit('admin_signin', { sessionId: 'admin' });
    
            //update allSessionData then close connection
            const handleActiveRoomsInfo = (data: { allSessionData: ConversationSchema[] }) => {
                const { allSessionData } = data;
                updateAllSessionData(allSessionData);

                if(userSessionIDFromSessionStorage){
                    const parsedSessionID = JSON.parse(userSessionIDFromSessionStorage);
                    socket.emit('admin_leave_conversation', { userSessionId: parsedSessionID, adminSessionID: 'admin' });
                }
                updateIsAdminOnline(false)
                socket.disconnect();
                setSocket(null);
            };
    
            socket.once('active_rooms_info', handleActiveRoomsInfo);
        }
    };

    //when admin selects room to join
    const getRoomInfo = (userSessionId: string) => {
        const filteredSession = allSessionData.find(item => item.sessionID === userSessionId);

        sessionStorage.setItem('userSessionID', JSON.stringify(userSessionId))
        
        if(socket){
            if (filteredSession) {
                updateActiveUserSessionData(filteredSession);
                updateChatBoxActivity(true);
                socket.emit('admin_join_conversation', { userSessionId, adminSessionID: 'admin' });      
            }

            socket.on('admin_activity', (data) => {
                const { status} = data;
                if (status === true) {
                    updateIsAdminOnline(true)
                }else{
                    updateIsAdminOnline(false)
                }
            });

        }else{
            reconnectToRoom(userSessionId)
        }
        
    };
    
    //when admin sends message
    const sendMessage = (message: string) => {
        if (socket) {
            socket.emit("admin_message", { userSessionID: activeUserSessionData?.sessionID, adminSessionID: 'admin', message });
        }
    };

    //reconnect to room when admin exits chat
    const reconnectToRoom = (userSessionId : string) =>{
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);
        const filteredSession = allSessionData.find(item => item.sessionID === userSessionId);
    
        if (filteredSession) {
            updateActiveUserSessionData(filteredSession);
            updateChatBoxActivity(true);
            newSocket.emit('admin_join_conversation', { userSessionId, adminSessionID: 'admin' });   
        }

        newSocket.on('admin_activity', (data) => {
            const { status} = data;
            if (status === true) {
                updateIsAdminOnline(true)
            }else{
                updateIsAdminOnline(false)
            }
        });
    }


    return (
        <>
            {!chatboxActive ? (
                <div className="absolute h-[100vh] w-full flex flex-col justify-start items-start overflow-hidden bg-white">
                    <div className="relative h-full w-full overflow-x-hidden flex flex-col justify-start items-start text-black">
                        <div className='w-full flex space-x-3'>
                            <button onClick={() => adminGetAllSessions()} className='w-[200px] h-[50px] bg-red-500'>
                                Find Conversations
                            </button>
                            <p>Active Rooms</p>
                            {allSessionData.map((eachSession) => (
                                <button onClick={() => getRoomInfo(eachSession.sessionID)} key={eachSession.sessionID} className='p-4 bg-[#08389f] border border-[#024AE8] rounded-[5px]'>
                                    <p className='text-[15px] text-white'>{eachSession.sessionID}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="absolute h-[100vh] w-full flex flex-col justify-start items-start overflow-hidden bg-white">
                    <div className="relative h-full w-full overflow-x-hidden flex flex-col justify-start items-start text-black">   
                        <div className='fixed bottom-0 right-0 w-screen h-screen flex flex-col justify-start items-start bg-white border-inherit sm:right-[10px] sm:bottom-[20px] sm:border sm:rounded-[20px] sm:w-[400px] sm:h-[580px] shadow-[0px_4px_10px_rgba(0,0,0,0.1),0px_2px_5px_rgba(0,0,0,0.05)] overflow-hidden'>
                                <Chatbox 
                                    isAdminOnline={isAdminOnline} 
                                    closeSocket={closeSocket} 
                                    conversation={activeUserSessionData} 
                                    sendMessage={sendMessage} 
                                    updateMessageBoxActive={updateChatBoxActivity} 
                                />
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}
    


export default AdminChatBox;
