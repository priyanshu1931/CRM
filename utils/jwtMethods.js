import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

export const getJWTToken = function (data ) {
    
    return jwt.sign({ data: data }, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE
    })
}
export const verifyJWTToken = function (token) {
    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        return decodedData.data;
    } catch (err) {
        throw new AppError('Authentication failed', 401);
    }
}
export const createAndSendJWTToken = function (req, res, user, status = 200, message) {
    
    if (user instanceof Object && user.toObject instanceof Function) {
        // If 'user' is a Mongoose document, convert it to a plain JavaScript object
        user = user.toObject();
    }
    

    try {
        const token = getJWTToken(user._id);

        res.cookie('jwt', token, {
            expires: new Date(
                Date.now() + process.env.JWT_EXPIRE * 1,
            ),
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
        });

        return res.status(status).json({
            success: true,
            message: message,
            user: user,
            token: token
        });
    } catch (error) {
        // Handle the error appropriately
        console.error('Error creating and sending JWT token:', error);
        return res.status(500).send('Internal Server Error');
    }
};
