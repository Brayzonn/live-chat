import cors, { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
