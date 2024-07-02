import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: ['http://localhost:3000'],
  credentials: true
};

export default cors(corsOptions);
