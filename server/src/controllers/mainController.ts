import signInFnc from '../utils/signinLogic'
import { Request, Response, NextFunction } from 'express'
import generateUserToken from '../utils/jwtTokenFunc'


const signin = async (req: Request, res: Response , next: NextFunction) => {

    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password){
       return res.status(400).json({success: false, message: 'Please complete all fields'})
    }

    try {
       const LoginResponse = await signInFnc(email, password);
       
       if(LoginResponse.successMessage){
            res.status(200).json({message: LoginResponse.successMessage, token: generateUserToken(LoginResponse.userId)})
       } else{
            res.status(401).json({message: LoginResponse.errMsg})
       }
    } catch (error) {
        res.status(500).json({message: 'Internal server error' });
    }  
}

export { signin };