import jwt, { JwtPayload } from 'jsonwebtoken';

const ensureAdminSocket = (data: { token: string }, socket: any, callback: Function, next: Function) => {
    let adminToken;

    if (socket.handshake.headers && socket.handshake.headers.auth) {
        adminToken = socket.handshake.headers.auth.split(' ')[1];
    }

    if (!adminToken || adminToken === 'null') {
        return callback({ error: 'Unauthorized Access.' });
    }

    try {
        const secret = process.env.JWT_SECRET;

        if (secret) {
            const decoded = jwt.verify(adminToken, secret) as JwtPayload;

            if (!decoded.id) {
                return callback({ error: 'Unauthorized Access.' });
            } else {
                next();
            }
        } else {
            return callback({ error: 'Something went wrong' });
        }

    } catch (error) {
        console.error(error);
        return callback({ error: 'Internal server error' });
    }
};

export default ensureAdminSocket