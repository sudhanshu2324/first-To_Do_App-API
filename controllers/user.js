import { USER } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";


export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        let user = await USER.findOne({ email })
    
        if (user) return next(new ErrorHandler("This email is already registered", 404))
    
        const hashedPassword = await bcrypt.hash(password, 15);
        user = USER.create({ name, email, password: hashedPassword })
        sendCookie(user, res, "Registered Successfully", 201)
    } catch (error) {
        next(error)
    }
   


}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        let user = await USER.findOne({ email }).select("+password");
    
        if (!user) return next(new ErrorHandler("register first", 404))
    
    
        const isMatch = await bcrypt.compare(password, user.password)
    
        if (!isMatch) return next(new ErrorHandler("Invalid Email or Password", 404))
    
        sendCookie(user, res, `Welcome back, ${user.name}`, 200)
    } catch (error) {
        next(error)
    }

}

export const getMyProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    })
}
export const logout = (req, res) => {
    res.status(200).cookie("token","",{
        expire:new Date(Date.now()),
        httpOnly:true,
        sameSite: process.env.NODE_ENV === "Development"? "lax":"none",
        secure: process.env.NODE_ENV === "Development"? false : true,
    }).json({
        success: true,
        message: "You are logged out Successfully.",
    })
}