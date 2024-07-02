import signInFnc from '../config/signinLogic'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

//env variable
require('dotenv').config();

//generate user token
const generateUserToken = (id: any) => {
    // Check if process.env.JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


const signin = async (req: Request, res: Response , next: NextFunction) => {

    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
       return res.status(401).json({success: false, message: 'Please complete all fields'})
    }

    try {
       const LoginResponse = await signInFnc(username, password);
       
       if(LoginResponse.successMessage){
            res.status(200).json({success: true, message: LoginResponse.successMessage})
       }else{
            res.status(401).json({ success: false, message: LoginResponse.errMsg, token: generateUserToken(LoginResponse.userId) });
       }
       
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error' });
    }  
}

export { signin };