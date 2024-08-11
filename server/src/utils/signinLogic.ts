import bcrypt from 'bcryptjs';
import userModel from '../models/usermodel';


//function to validate user sign in
const validateLogin = async (username: string, password: string ) => {
    //check db for user
    const userResp =  await userModel.findOne({ email: username })

    //if user exists
    if (userResp){
        //check password
        const validatePassword = await comparePasswordWithHash(password, userResp.password);

        if(!validatePassword){
            return ({ errMsg: 'Incorrect Password!' })
        }else{
           return({successMessage: 'Sign in successful', userId: userResp._id}) 
        }
    }else{
        return ({ errMsg: 'No account found.' });
    }
}

const comparePasswordWithHash = async (password: any, hashedPassword: any) => {
    return bcrypt.compare(password, hashedPassword);
};

export default validateLogin