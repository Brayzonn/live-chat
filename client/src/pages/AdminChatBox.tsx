import  {useEffect,  useState } from 'react';
import io, { Socket } from 'socket.io-client';

import helloImage from '../../images/hello.png'
import botimage from '../../images/24-hours-support.png'


import { BiSolidMessage } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

import Chatbox from './Chatbox';
import { ConversationSchema } from '../assets/Types';


const AdminChatBox = () => {

    //chat window
    const ENDPOINT = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : '';
    const [chatboxActive, updateChatBoxActivity] = useState<boolean>(false)

    const [socket, setSocket] = useState<Socket | null>(null);
    const [allSessionData, updateAllSessionData] = useState<ConversationSchema[] >([]);
    const [activeUserSessionData, updateActiveUserSessionData] = useState<ConversationSchema >({
        sessionID: '',
        messages: []
    });
      
    const [adminMessage, setAdminMessage] = useState<string>('');

    const adminJoinConvo = () =>{
        if (!socket) {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);
    
            newSocket.emit('admin_join', {sessionId: 'admin'}) 

            newSocket.on('active_rooms_info', (data) => {
                const {sessionData} = data;
                console.log(sessionData)
                updateAllSessionData((prevSessions) => [...prevSessions, sessionData])
                updateAllSessionData((prevChats) => [...prevChats, sessionData.sessionID]);
            });

            newSocket.on('received_user_message', (data) => {
                const {message} = data;
            });
        }
    }

    const initiateSocket = () => {

    }

    const closeSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    }
    
    const sendMessage = (message: string) => {
        if (socket) {
            socket.emit("user_message", { sessionId: 'admin', message });
        }
    };

    const getRoomInfo = (sessionId: string) => {
        const filteredSession = allSessionData.find(item => item.sessionID === sessionId);
        if(filteredSession){
            updateActiveUserSessionData(filteredSession)
            updateChatBoxActivity(true)
        }
       
        
    }

 




  return (
    <div className="absolute h-[100vh] w-full flex flex-col justify-start items-start overflow-hidden bg-white">
        <div className="relative h-full w-full overflow-x-hidden flex flex-col justify-start items-start text-black">              
              <div className='w-full flex space-x-3 '>
                    {!chatboxActive ? 
                        <>
                            <button onClick={()=>adminJoinConvo()} className='w-[200px] h-[50px] bg-red-500'>
                                join convo
                            </button>

                            <p>Active Rooms</p>

                            {allSessionData.map((sessionId) => (
                                <button onClick={()=> getRoomInfo(sessionId.sessionID)} key={(sessionId.sessionID)} className='p-4 bg-[#08389f] border border-[#024AE8] rounded-[5px]'>
                                    <p className='text-[15px] text-white '>{sessionId.sessionID}</p>
                                </button>
                            ))}
                        </>
                        :
                        <Chatbox conversation={activeUserSessionData} sendMessage = {sendMessage} updateMessageBoxActive = {updateChatBoxActivity} />
                    }
              </div>  
        </div>
    </div>
  )
}

export default AdminChatBox