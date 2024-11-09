import dotenv from 'dotenv';
dotenv.config();

export const config = {
  sessionSecret: "mysitesessionsecret",
  port: process.env.PORT || 5000,
  database: {
    url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TRAVALOG'
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY || 'hellooiamhridhya',
     Refreshsecret: process.env.JWT_SECRET_KEY || 'hellooiamdiya',
    expiresIn: '30d'
  },
  admin: {
    email: process.env.ADMIN_EMAIL||"admin@gmail.com",
    password: process.env.ADMIN_PASSWORD||"Admin@1234",
  },
  email: {
    user: 'hridhyashijina@gmail.com',
    password: 'syk gvdw ratk nvwi',
  },
 
};