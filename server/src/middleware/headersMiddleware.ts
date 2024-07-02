import { Request, Response, NextFunction } from 'express';

const setHeaders = (req:Request, res:Response, next:NextFunction) => {
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  
    next();
  };

  export default setHeaders;