import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';


const Signin = () => {

    const adminToken = sessionStorage.getItem('adminToken');
    const ENDPOINT = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL : '';

    const navigate = useNavigate();
    
    const [buttonLoadingAnimation, updateButtonLoadingAnimation] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    //sign in logic
    interface SigninFormFieldDataSchema {
        email: string,
        password: string, 
    }
    const [signinFormFieldData, updateSigninFormFieldData] = useState<SigninFormFieldDataSchema>({
        email: '',
        password: '', 
    });

    const submitSigninData = async () =>{

        if(adminToken){
            navigate('/admin/adminchatbox'); 
        }else{
            try {
                updateButtonLoadingAnimation(true)
                if(signinFormFieldData.email === '' || signinFormFieldData.password === ''){
                    toast.error('Complete all fields')
                    updateButtonLoadingAnimation(false)
                }
    
                //make post request if field validation complete
                else{
                    const signupApiCall = await axios.post(`${ENDPOINT}/api/signin`, {...signinFormFieldData})
                    const signInResponseData = signupApiCall.data;
    
                    if(signInResponseData){
                        sessionStorage.setItem('adminToken', JSON.stringify(signInResponseData.token))
                        updateSigninFormFieldData({
                            email: '',
                            password: '', 
                        })
    
                        toast.success('Sign in successful')
    
                        setTimeout(()=>{
                            navigate('/admin/adminchatbox');  
                        }, 2500) 
                        
                    }
                
                    updateButtonLoadingAnimation(false)
                    
                }     
            } catch (error) {

                    if (axios.isAxiosError(error)) {
                        toast.error(error.response?.data.message)
                        updateButtonLoadingAnimation(false)
                    }
                     
            }
        }
       

    }


        return (
            <div className="absolute h-[100vh] w-full flex flex-col justify-start items-start overflow-hidden bg-greyMainBackground">
                <div className="relative h-full w-full overflow-x-hidden flex flex-col justify-start items-start text-black">                                    
                    <div className="relative w-full h-full flex flex-start justify-center space-x-4 p-4 ">

                            {/* signin box */}
                            <div className='w-[50%] flex flex-col justify-center items-center space-y-6'>
                                

                                    <div className="shadow-lg flex flex-col justify-center items-center space-y-2 w-[370px] min-h-[420px] py-3 px-6 bg-white border border-white rounded-[15px] shadow-[0_35px_60px_-15px_rgba(231, 231, 231, 0.3)]">
                                        <h5 className='text-[20px] pt-[1rem] font-[550] tracking-wide'> Admin Login</h5>
                                        <p className='text-[14.40px] pb-[1.3rem] text-[#3c3b3b]'>Enter your registered details to sign in</p>

                                        <div className='w-full flex flex-col space-y-[1rem]'>
                                            <div className='flex flex-col space-y-2'>
                                                <label className='text-[15px] text-[#636363]'>Email</label>
                                                <input type="email" name='email' 
                                                    value={signinFormFieldData.email}
                                                    onChange={(e)=>{ updateSigninFormFieldData({...signinFormFieldData, email: e.target.value })}}
                                                    placeholder='Enter email'
                                                    className='bg-inherit px-2 border-[#e1e1e1] border-[1px] rounded-[5px] w-full h-[42px] text-black text-[16px] focus:border-greyMainBackground focus:bg-greyMainBackground focus:outline-none' 
                                                />
                                            </div>

                                            <div className='flex pb-[1rem] flex-col space-y-2 relative'>
                                                <label className='text-[15px] text-[#636363]'>Password</label>
                                                <div className='relative'>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name='password'
                                                        value={signinFormFieldData.password}
                                                        onChange={(e)=>{ updateSigninFormFieldData({...signinFormFieldData, password: e.target.value })}}
                                                        placeholder='Enter password'
                                                        className='bg-inherit px-2 border-[#e1e1e1] border-[1px] rounded-[5px] w-full h-[42px] pr-[30px] text-black text-[16px] focus:border-greyMainBackground focus:bg-greyMainBackground focus:outline-none'
                                                    />
                                                    <div
                                                        className='absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button onClick={()=>submitSigninData()} 
                                            disabled = {buttonLoadingAnimation} 
                                            className='bg-black px-2 flex justify-center items-center text-white border-black border-[1px] rounded-[5px] w-full h-[45px] transition-properties hover:bg-[#181762]'>
                                                {buttonLoadingAnimation ? 
                                                    <p>...</p>
                                                    // <img src = 's' className='w-[30px] h-[30px]' alt='loader'/>    
                                                :
                                                    <>
                                                        <p>Sign in</p>
                                                    </>
                                                }
                                        </button>
                                            
                                    </div>

                            </div>
                
                    </div>ß
                </div>
            </div>
        )
    }

export default Signin