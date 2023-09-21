import { USER } from "../models/user.js";
import jwt  from "jsonwebtoken";

export const isAuthenticated = async(req, res, next) =>{
    const { token } = req.cookies;
    if (!token)
        return res
            .status(404)
            .json({
                success: false,
                message: "Login First"
            });
    //verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await USER.findById(decoded.id);
    
    next()
}