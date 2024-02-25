import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req,res,next) => {
    const {userName, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({userName, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json('User added to database')
    } catch (error) {
        // Passing error to middleware written in index.js for throwing error more readably
        next(error);
    }
}

export const signin = async (req,res,next) => {
    const {email, password} = req.body;
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if(!validPassword) return next(errorHandler(401, 'Wrong Password!'));
    const {password: pass, ...userWithoutPassword} = validUser.toObject();
    console.log("userWithoutPassword", userWithoutPassword);
    const token = jwt.sign({ id:validUser._id }, process.env.JWT_SECRET);
    res.cookie('access_token' ,token, {httpOnly: true}).status(200).json(userWithoutPassword);
}