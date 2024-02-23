import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

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