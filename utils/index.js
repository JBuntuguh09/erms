import jwt from 'jsonwebtoken';

export const generateWebToken=(payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIME
    })

}