import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';


const protect = expressAsyncHandler(async (req, res, next) => {

  let token = req.cookies.jwt || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (token && typeof token === 'object' && token.accessToken) {
    token = token.accessToken;
  }

  console.log("Received token:", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: "Not authorized, Token expired" });
      } else if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ message: "Not authorized, Invalid token" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    }
  } else {
    res.status(401).json({ message: "Not authorized, No token found" });
  }
});









export { protect };
