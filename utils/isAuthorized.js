import User from '../models/User.js';
import AppError from './AppError.js';
export default  async (req,res,next) => {

    const user = await User.findOne({_id:(req.user)});
    console.log(user);
    if(!user)
    {
        next (new AppError('you are not authorized',401));
    }
    else if(String(user.role)!=="admin")
    {
        next (new AppError('you are not authorized',401));
    }
    else{
        next();
    }
};