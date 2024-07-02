const router = require("express").Router();
import { Request, Response, NextFunction } from 'express'

import { signin } from '../controllers/mainController'; 


router.get('/', (req: Request, res: Response , next: NextFunction)=>{
    res.send('fuck off!!')
})

router.post('/signin', signin)



export default router 