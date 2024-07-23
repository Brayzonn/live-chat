import { useState } from 'react';

import botImage from '../../images/programmer.png';

import { FaChevronLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

import { ChatboxProps, UserMessageSchema } from '../assets/Types';
import {formatMessageTimestamp, formatDateHeader, getDateHeader} from '../assets/HelperFunctions';


const Chatbox: React.FC<ChatboxProps> = ({sendMessage, updateMessageBoxActive, conversation }) => {
    
    const [inputFocus, updateInputFocus] = useState<boolean>(false);
    const [userMessage, updateUserMessage] = useState<UserMessageSchema>({ usertext: '' });

    const handleSendMessage = () => {
        sendMessage(userMessage.usertext);
        updateUserMessage({ usertext: '' }); 
    };

    let lastDate = '';

    return (
        <div className='relative w-full bg-inherit h-full flex flex-col justify-start items-start'>
            <div className='px-4 py-[2rem] h-[9%] w-full bg-gradient-to-r from-zinc-100 to-slate-300 flex items-center justify-between sm:min-h-[35px]'>
                <button onClick={() => updateMessageBoxActive(false)} className='w-full flex justify-between items-start'>
                    <FaChevronLeft className="text-black font-bold text-[19px]" />
                </button>

                <div className='flex'>
                    <img src={botImage} alt="profile" className='shrink-0 w-[25px] h-[25px]' />
                    <div className='w-[8px] h-[8px] rounded-[10px] bg-green-400 shrink-0'></div>
                </div>
            </div>

            <div className='w-full h-[82%] px-4 py-2 bg-inherit flex flex-col space-y-3 overflow-y-auto sm:h-[385px]'>
                {conversation.messages.map((data, index) => {

                    const messageDate = new Date(data.timestamp);
                    const chatCurrentDate = formatDateHeader(messageDate);
                    const showDateHeader = getDateHeader(chatCurrentDate, lastDate);
                    lastDate = chatCurrentDate;
                    
                    return (
                        <div key={index} className='w-full flex flex-col'>
                            {showDateHeader && (
                                <p className='text-center text-[14px] text-gray-500 my-2'>{chatCurrentDate}</p>
                            )}
                            {data.isAdmin ? (
                                <div className='w-full pt-4 flex justify-start items-center space-x-3'>
                                    <div className='flex'>
                                        <img src={botImage} alt="profile" className='shrink-0 w-[25px] h-[25px]' />
                                    </div>
                                    <div className='flex flex-col space-y-1'>
                                        <div className='p-4 bg-[#f5f5f5] border border-[#f5f5f5] rounded-[5px]'>
                                            <p className='text-[14px] text-black '>{data.text}</p>
                                        </div>
                                        <p className='text-[#bbbbbb] text-[13px]'>{formatMessageTimestamp(data.timestamp)}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className='w-full flex flex-col justify-start items-end space-x-3'>
                                    <div className='flex flex-col items-end space-y-1'>
                                        <div className='p-4 bg-[#08389f] border border-[#024AE8] rounded-[5px]'>
                                            <p className='text-[15px] text-white '>{data.text}</p>
                                        </div>
                                        <p className='text-[#bbbbbb] text-[13px]'>{formatMessageTimestamp(data.timestamp)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={`absolute left-0 bottom-0 w-full h-[9%] transition-all flex ${inputFocus ? 'border-t border-[#eaeaea] bg-white ' : 'bg-[#FAFAFA]'} sm:h-[60px]`}>
                <textarea
                    name='usertext'
                    placeholder='Message...'
                    value={userMessage.usertext}
                    onChange={(e) => { updateUserMessage({ usertext: e.target.value }) }}
                    onFocus={() => {
                        updateInputFocus(true);
                    }}
                    onBlur={() => {
                        updateInputFocus(false);
                    }}
                    className={`px-3 pt-2 resize-none border border-[#FAFAFA] w-[90%] h-full text-black text-[16px] ${inputFocus ? 'bg-white' : 'bg-[#FAFAFA]'} focus:outline-none`}
                />

                <button onClick={handleSendMessage} className='flex justify-center items-center'>
                    <IoIosSend className="text-[20px] font-bold" />
                </button>
            </div>
        </div>
    );
}

export default Chatbox;
