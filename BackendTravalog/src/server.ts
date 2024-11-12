import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
 import { config } from './config/index';
 import { connectDatabase } from './infrastructure/database/mongoose';
import userRoutes from './presentation/routes/userRoutes';
import adminRoutes from './presentation/routes/adminRoute';
import { Request,Response } from "express";
import vendorRoutes from './presentation/routes/vendorRoutes'
import  session  from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
const app: Express = express();

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret:config.sessionSecret,resave:true,saveUninitialized:true, cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  maxAge: 30 * 60 * 1000 // 30 minutes
}}))


const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL  // Use environment variable for production
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],  // Allow both localhost variations
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use('/user',userRoutes);
 app.use('/vendor',vendorRoutes);


app.use('/admin',adminRoutes)
//  app.use('/VerifyLogin', (req: Request, res: Response) => {
//   console.log('Request received on /vendor route');
//   console.log('Request method:', req.method);
//   console.log('Request body:', req.body);

// });

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();