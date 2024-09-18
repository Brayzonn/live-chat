import cors, { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
  origin: process.env.CORS_ENDPOINT,
  credentials: true
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
