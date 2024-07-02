import session, { SessionOptions } from 'express-session';

const sessionConfig: SessionOptions = {
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
};

export default session(sessionConfig);
