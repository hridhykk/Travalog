
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config()


const Adminprotect =  expressAsyncHandler((req, res, next) => {
  try {
    let token = req.cookies.adminjwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (token && typeof token === 'object' && token.accessToken) {
    token = token.accessToken;
  }

  console.log("Received token:", token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    next();
  } catch (err) {
    console.error('Admin middleware error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
});




export { Adminprotect };