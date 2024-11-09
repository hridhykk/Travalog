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

const app: Express = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:true}))


const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

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