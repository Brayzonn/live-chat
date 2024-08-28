import jwt from 'jsonwebtoken';

require('dotenv').config();

const generateUserToken = (id: any) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret is not defined');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export default generateUserToken