import {Request,Response,NextFunction} from 'express'
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const SECRET=process.env.SECRET || '';
interface DecodedToken{
    username:string;
    role:string
}

interface AuthenticatedRequest extends Request {
    user?: {
        username: string;
        role: string;
    };
}

const requireAdminAuth=(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const cookie=req.cookies?.adminJWT;
    if(!cookie){
        return res.status(403).json({ msg: "Not logged in" });
    }

    try {
        const decoded =jwt.verify(cookie,SECRET) as DecodedToken;

        if(!decoded || !decoded.username || !decoded.role){
            res.status(403).json({msg:"Invalid token"});
        }
        if(decoded.role!=='admin')return res.status(403).json({ msg: "Unauthorized role" });

        req.user = {
            username: decoded.username,
            role: decoded.role
        };

        
        
        
        next();
    } catch (error) {
        console.error("Error verifying admin JWT:", error);
        return res.redirect('/signin');
    }
}

export  {requireAdminAuth,AuthenticatedRequest} ;