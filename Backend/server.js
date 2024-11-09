import  mongoose from "mongoose";
mongoose.connect("mongodb://127.0.0.1:27017/MEARN");
import express from 'express';
import dotenv from 'dotenv';
dotenv.config()
import cors from 'cors'
const port = process.env.PORT || 5000;
import cookieParser from 'cookie-parser';

import userRouter from './router/userRoutes.js';
import adminRouter from './router/adminRouter.js';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: 'http://localhost:5173', // your frontend's origin
  credentials: true, // Allow credentials (cookies)
}));



app.use('/api/users',userRouter)
app.use('/admin',adminRouter)


app.listen(port,()=>console.log(`http://localhost:${port}`))
