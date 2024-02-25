import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req,res,next) => {
    const {userName, email, password} = req.body;
    if(!userName && !email && !password) {
        next(errorHandler(404, "All fields are mandatory"))
    }
    const hashedPassword = password && bcryptjs.hashSync(password, 10);
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
    try {
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, 'User not found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, 'Wrong Password!'));
        const {password: pass, ...userWithoutPassword} = validUser.toObject();
        const token = jwt.sign({ id:validUser._id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(userWithoutPassword);
    } catch (error) {
        next(error);        
    }
}

export const google = async (req,res,next) => {
    const { userName, email, photo } = req.body;
    try {
        const user = await User.findOne({email: email});
        if(user) {
            const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);
            const {password: pass, ...rest} = user;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8);
            const newUser = new User({
                userName: userName.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email,
                password: generatedPassword,
                photo
            })
            await newUser.save();
            const token = jwt.sign({ id:newUser._id }, process.env.JWT_SECRET);
            const {password: pass, ...rest} = newUser;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
}