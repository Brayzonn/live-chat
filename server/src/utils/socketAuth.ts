import jwt, { JwtPayload } from 'jsonwebtoken';

const ensureAdminSocket = (data: { token: string }, socket: any, next: Function) => {
    let adminToken: string | null = null;

    if (socket.handshake.auth && socket.handshake.auth.token) {
        adminToken = socket.handshake.auth.token;
    }

    if (!adminToken || adminToken === 'null') {
        return next({ error: 'Unauthorized Access.' });
    }

    try {
        adminToken = adminToken.replace(/['"]+/g, '');

        const secret = process.env.JWT_SECRET;

        if (secret) {
            const decoded = jwt.verify(adminToken, secret) as JwtPayload;

            if (!decoded.id) {
                return next({ error: 'Unauthorized Access.' });
            } else {
                return next(); 
            }
        } else {
            return next({ error: 'Something went wrong' });
        }

    } catch (error) {
        console.error(error);
        return next({ error: 'Internal server error' });
    }
};

export default ensureAdminSocket;
