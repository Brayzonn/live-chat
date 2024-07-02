import  { useState } from 'react';
import botimage from '../../images/programmer.png'


import { FaChevronLeft } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";

interface chatboxProps {
    updateMessageBoxActive: React.Dispatch<React.SetStateAction<boolean>>,
}

const Chatbox: React.FC<chatboxProps>  = ({updateMessageBoxActive}) => {

  
    const [inputFocus, updateInputFocus] = useState<boolean>(false)


  return (
                   <div className='relative w-full bg-inherit h-full flex flex-col justify-start items-start'>
                        <div className='px-4 py-[2rem] min-h-[35px] w-full bg-gradient-to-r from-zinc-100 to-slate-300 flex items-center justify-between '>
                              <button onClick={()=>updateMessageBoxActive(false)} className='w-full flex justify-between items-start'>
                                  <FaChevronLeft className="text-black font-bold text-[19px]"/>
                              </button>

                              <div className='flex'>
                                  <img src={botimage} alt="profile" className='shrink-0 w-[25px] h-[25px]'/>
                                  <div className='w-[8px] h-[8px] rounded-[10px] bg-green-400 shrink-0'></div>
                              </div>
                        </div>

                        <div className='w-full px-4 py-2 h-[385px] bg-inherit flex flex-col space-y-2 overflow-y-auto'>
                              <div className='w-full pt-4 flex justify-start items-center space-x-3'>
                                    <div className='flex'>
                                          <img src={botimage} alt="profile" className='shrink-0 w-[25px] h-[25px]'/>
                                          <div className='w-[8px] h-[8px] rounded-[10px] bg-green-400 shrink-0'></div>
                                    </div>

                                    <div className='flex flex-col space-y-1'>
                                          <div className='p-4 bg-[#f5f5f5] border border-[#f5f5f5] rounded-[5px]'>
                                              <p className='text-[15px] text-black '>How can i assist you?</p>
                                          </div>

                                          <div className='p-4 bg-[#f5f5f5] border border-[#f5f5f5] rounded-[5px]'>
                                              <p className='text-[15px] text-black '>How can i assist you?</p>
                                          </div>

                                          <div className='p-4 bg-[#f5f5f5] border border-[#f5f5f5] rounded-[5px]'>
                                              <p className='text-[15px] text-black '>How can i assist you?</p>
                                          </div>

                                          <div className='p-4 bg-[#f5f5f5] border border-[#f5f5f5] rounded-[5px]'>
                                              <p className='text-[15px] text-black '>How can i assist you?</p>
                                          </div>

                                          <div className='p-4 bg-[#f5f5f5] border border-[#f5f5f5] rounded-[5px]'>
                                              <p className='text-[15px] text-black '>How can i assist you?</p>
                                          </div>
                                    </div>
                              </div>

                              <div className='w-full flex flex-col justify-start items-end space-x-3'>
                                    <div className='flex flex-col space-y-1'>
                                          <div className='p-4 bg-[#08389f] border border-[#024AE8] rounded-[5px]'>
                                              <p className='text-[15px] text-white '>How can i assist you?</p>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        <div className={`absolute left-0 bottom-0 w-full h-[60px] transition-all flex  ${inputFocus ? 'border-t border-[#eaeaea] bg-white ' : 'bg-[#FAFAFA]' }`}>
                              <input
                                  type= 'text'
                                  name='usertext'
                                  placeholder='Message...'
                                  onFocus={()=> {
                                    updateInputFocus(true)
                                  }}
                                  onBlur={() => {
                                    updateInputFocus(false);
                                  }}
                                  className={`px-3 border border-[#FAFAFA] w-[90%] h-full text-black text-[16px] ${inputFocus ? 'bg-white' : 'bg-[#FAFAFA]' } focus:outline-none`}
                              />

                              <div className='flex justify-center items-center'>
                                  <IoIosSend className = "text-[20px] font-bold"/>
                              </div>
                        </div>
                  </div>
  )
}

export default Chatbox