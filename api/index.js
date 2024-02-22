import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
dotenv.config();

const app = express();

app.use('/api/user', userRouter);

app.listen(3000, () => {
    console.log("Served started listening 3000")
    mongoose.connect(process.env.MONGO).then(() => {
        console.log("Connected to Database");
    }).catch((error) => {
        console.log(error);
    })
});
