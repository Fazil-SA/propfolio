import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req,res) => {
    res.json({message: "This is a test api"});
}

export const updateUser = async (req,res,next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'));
    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                userName: req.body.userName,
                email: req.body.email,
                password: req.body.password,
                photo: req.body.photo
            } 
        }, {new: true}) // existing files will be same new will be replaced

        const {password, ...rest} = updatedUser._doc    
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}
