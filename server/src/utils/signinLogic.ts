import bcrypt from 'bcryptjs';
import userModel from '../models/usermodel';


//function to validate user sign in
const validateLogin = async (username: string, password: string ) => {

    const userExists =  await userModel.findOne({ email: username })

    if (userExists){
        const validatePassword = await comparePasswordWithHash(password, userExists.password);

        if(!validatePassword){
            return ({ errMsg: 'Incorrect Password!' })
        }else{
           return({successMessage: 'Sign in successful', userId: userExists._id}) 
        }
    }else{
        return ({ errMsg: 'No account found.' });
    }
}

const comparePasswordWithHash = async (password: any, hashedPassword: any) => {
    return bcrypt.compare(password, hashedPassword);
};

export default validateLogin