import jwt from 'jsonwebtoken';
import AppError from './AppError.js';
export default  async (req,res,next) => {
    const token =  req.headers.token
    if(!token)
    {
        next (new AppError('kindly login first',401));
    }
    else{
    const data = jwt.decode(token,process.env.JWT_SECRET);
    req.user=data.data;
    next();
    }
};
