import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

export const signup = async (req,res) => {
    const {userName, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({userName, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json('User added to database')
    } catch (error) {
        res.status(500).json(error.message)
    }
}