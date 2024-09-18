import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

import botimage from '../../images/24-hours-support.png'

import { BiSolidMessage } from "react-icons/bi";
import { FaChevronLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

import Chatbox from './Chatbox';
import { ConversationSchema } from '../assets/Types';


const ClientChatBox = () => {
  
  //session storate variables
  const userSessionIDFromSessionStorage = sessionStorage.getItem('userSessionID');

  //chat window
  const [chatWindow, updateChatWindow] = useState<boolean>(false)
  const [messageBoxActive, updateMessageBoxActive] = useState<boolean>(false)
  const [isAdminOnline, updateIsAdminOnline] = useState<boolean>(false)

  //web socket
  const [sessionId] = useState<string>(() => `session-${Math.random().toString(36).substr(2, 9)}`);
  const [socket, setSocket] = useState<Socket | null>(null);
  const ENDPOINT = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : '';
  const [userConversation, updateUserConversation] = useState<ConversationSchema>({
        sessionID: '',
        messages: []
  })


  //check for socket session ID in session storage and run initiateSocket
  useEffect(()=>{

        if(userSessionIDFromSessionStorage && !socket){

            const parsedSessionID = JSON.parse(userSessionIDFromSessionStorage);

            const newSocket = io(ENDPOINT);

            setSocket(newSocket);

            newSocket.emit('reconnect_session', { sessionId: parsedSessionID });

            newSocket.on('all_user_messages', (data) => {
                const { updatedSessionInfo } = data;
                updateUserConversation(updatedSessionInfo)
            });

            newSocket.on('admin_activity', (data) => {
                const { status } = data;
                updateIsAdminOnline(status);
            });
          
            newSocket.on('delete_convo_for_user', (data) => {
                const { deletestatus } = data;
                if (deletestatus) {
                    sessionStorage.removeItem('userSessionID');
                }
            });

            return initiateSocket()
        }

   }, [])


  //socket initialization
  const initiateSocket = () => {
        if (!userSessionIDFromSessionStorage) {
            const newSocket = io(ENDPOINT);
            setSocket(newSocket);

            sessionStorage.setItem('userSessionID', JSON.stringify(sessionId))

            
            newSocket.emit('start_conversation', { sessionId });

            newSocket.on('all_user_messages', (data) => {
                const { updatedSessionInfo } = data;
                updateUserConversation(updatedSessionInfo)
            });   

            newSocket.on('admin_activity', (data) => {
                const { status} = data;
                if (status === true) {
                    updateIsAdminOnline(true)
                }else{
                    updateIsAdminOnline(false)
                }
            });

            newSocket.on('delete_convo_for_user', (data) => {
                const { deletestatus } = data;
                if (deletestatus) {
                    sessionStorage.removeItem('userSessionID');
                }
            });

        }else{
            if(socket){
                socket.on('all_user_messages', (data) => {
                    const { updatedSessionInfo } = data;
                    updateUserConversation(updatedSessionInfo)
                });

                socket.on('admin_activity', (data) => {
                    const { status } = data;
                    if (status === true) {
                        updateIsAdminOnline(true)
                    }else{
                        updateIsAdminOnline(false)
                    }
                });

                socket.on('delete_convo_for_user', (data) => {
                    const { deletestatus } = data;
                    if (deletestatus) {
                        sessionStorage.removeItem('userSessionID');
                    }
                });
            }      
        }
  }
 
  //close socket connection
  const closeSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
  }


  //when user sends message to chat
  const sendMessage = (message: string) => {

        const storedUserSession = sessionStorage.getItem('userSessionID');

        let sessionToUse = sessionId; 

        if (storedUserSession) {
            const userSessionIDFromSessionStorage = JSON.parse(storedUserSession);
            sessionToUse = userSessionIDFromSessionStorage ? userSessionIDFromSessionStorage : sessionId;
        }

        if (socket) {
            socket.emit("user_message", { sessionId: sessionToUse, message });
            
            socket.on('admin_activity', (data) => {
                const { status } = data;
                if (status === true) {
                    updateIsAdminOnline(true)
                }else{
                    updateIsAdminOnline(false)
                }
            });
        }

  };

  return (
    <div className="absolute h-[100vh] w-full flex flex-col justify-start items-start overflow-hidden bg-white">
        <div className="relative h-full w-full overflow-x-hidden flex flex-col justify-start items-start text-black">              

              {!chatWindow ? (<button onClick={()=> updateChatWindow(true)} className='fixed bottom-[40px] right-[10px] w-[60px] h-[60px] flex justify-center items-center bg-black border-black rounded-full'>
                  <BiSolidMessage className = "text-white text-[29px]" />
              </button>)
              :
              <div className='fixed bottom-0 right-0 w-screen h-screen flex flex-col justify-start items-start bg-white border-inherit sm:right-[10px] sm:bottom-[20px] sm:border sm:rounded-[20px] sm:w-[400px] sm:h-[580px] shadow-[0px_4px_10px_rgba(0,0,0,0.1),0px_2px_5px_rgba(0,0,0,0.05)] overflow-hidden'>
                  {!messageBoxActive ? 
                      (<div className='relative w-full bg-inherit h-full flex flex-col justify-start items-start'>
                            <div className='px-4 py-[2rem] h-[300px] w-full bg-gradient-to-r from-zinc-100 to-slate-300 flex flex-col items-center justify-start space-y-8 sm:space-y-12'>
                                  <button onClick={()=>{updateChatWindow(false); closeSocket()}} className='w-full flex justify-between items-start'>
                                      <FaChevronLeft className="text-black font-bold text-[19px]"/>
                                  </button>

                                  <div className='w-full flex flex-col space-y-1 '>
                                      <div className='flex justify-start items-center space-x-1'>
                                          <h1 className='text-[23px] text-black font-bold'>Hi there </h1>
                                          <div>✋</div>
                                      </div>
                                      
                                      <p className='text-[16px] text-black max-w-[300px]'>Welcome to Chatbot. How can we help you today?</p>
                                  </div>

                                  <div className='relative w-[95%] px-4 py-2 min-h-[190px] bg-white flex flex-col justify-evenly items-center border border-inherit rounded-[10px] shadow-[0px_4px_10px_rgba(0,0,0,0.1),0px_2px_5px_rgba(0,0,0,0.05)] '>
                                          <h3 className='text-[19px] w-full text-left font-bold'>Start a conversation</h3>

                                          <div className='w-full flex items-center space-x-2'>
                                              <img src={botimage} alt="profile" className='shrink-0 w-[40px] h-[40px]'/>
                                              <p className='text-[15px] max-w-[300px]'>Our support are online and will help </p>
                                          </div>

                                          <button onClick={()=>{updateMessageBoxActive(true); initiateSocket()}} className='w-full text-white text-[15px] bg-[#0d3a99] border border-[#08389f] rounded-md min-h-[24px] p-2 flex justify-center items-center space-x-4'>
                                              <p>Start Conversation</p>  
                                              <IoIosSend className = "text-[20px] text-white font-bold"/>
                                          </button>
                                  </div>
                            </div>
                      </div>)
                  :
                  <Chatbox isAdminOnline ={isAdminOnline} closeSocket = {closeSocket} conversation={userConversation}  sendMessage = {sendMessage} updateMessageBoxActive = {updateMessageBoxActive} />}
              </div>
              }

        </div>
    </div>
  );
}

export default ClientChatBox;
