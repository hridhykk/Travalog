"use strict";
// import { Request, Response, NextFunction } from 'express';
// import { verifyToken, verifyRefreshToken, generateToken } from '../../utils/jwt';
// import { UserModel } from '../models/userModel';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// interface AuthenticatedRequest extends Request {
//   user?: any;
//   // _id?: any
// }
// export const authenticateUser = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // Get the access token from the Authorization header
//     const authHeader = req.headers.authorization;
//     const accessToken = authHeader?.split(' ')[1];
//     if (!accessToken) {
//       return res.status(401).json({ message: 'Access token not provided' });
//     }
//     try {
//       const decoded = verifyToken(accessToken);
//       req.user = decoded;
//       return next();
//     } catch (error: any) {
//       // If access token is expired, try to refresh it
//       if (error.name === 'TokenExpiredError') {
//         // Get refresh token from cookie
//         const refreshTokenCookie = req.cookies.userRefreshToken;
//         if (!refreshTokenCookie) {
//           return res.status(401).json({ message: 'Refresh token not found' });
//         }
//         try {
//           // Verify refresh token
//           const decoded = verifyRefreshToken(refreshTokenCookie);
//           // Find user in database to ensure they still exist and are not blocked
//           const user = await UserModel.findOne({ 
//             _id: typeof decoded === 'object' ? decoded._id  : decoded,
//             is_bloackes: false 
//           });
//           if (!user) {
//             return res.status(401).json({ message: 'User not found or blocked' });
//           }
//           return next();
//         } catch (refreshError) {
//           res.clearCookie('userjwt');
//           res.clearCookie('userRefreshToken');
//           return res.status(401).json({ message: 'Invalid refresh token' });
//         }
//       }
//       // For any other token verification errors
//       return res.status(401).json({ message: 'Invalid access token' });
//     }
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };
// import { Request, Response, NextFunction } from 'express';
// import expressAsyncHandler from 'express-async-handler';
// import { IUserRepository } from '../../domain/interfaces/repositories/iUserRepository';
// import { IAuthService } from '../../domain/interfaces/services/iAuthService';
// import { IUser } from '../../domain/entities/userEntities';
// interface AuthRequest extends Request {
//   user?: IUser;
// }
// export class AuthMiddleware {
//   constructor(
//     private readonly userRepository: IUserRepository,
//     private readonly authService: IAuthService
//   ) {}
//   protect = expressAsyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//       // Get token from cookie or Authorization header
//       let token = req.cookies.jwt ||
//         (req.headers.authorization?.startsWith('Bearer')
//           ? req.headers.authorization.split(' ')[1]
//           : null);
//       // Handle case where token might be an object with accessToken property
//       if (token && typeof token === 'object' && 'accessToken' in token) {
//         token = token.accessToken;
//       }
//       if (!token) {
//         return res.status(401).json({
//           status: 'error',
//           message: 'Not authorized, no token provided'
//         });
//       }
//       try {
//         // Verify token using auth service
//         const decoded = await this.authService.verifyToken(token);
//         // Find user using repository
//         const user = await this.userRepository.findById(decoded.id);
//         if (!user) {
//           return res.status(401).json({
//             status: 'error',
//             message: 'User not found'
//           });
//         }
//         // Attach user to request object
//         req.user = user;
//         next();
//       } catch (error: any) {
//         if (error.name === 'TokenExpiredError') {
//           return res.status(401).json({
//             status: 'error',
//             message: 'Token has expired'
//           });
//         }
//         if (error.name === 'JsonWebTokenError') {
//           return res.status(401).json({
//             status: 'error',
//             message: 'Invalid token'
//           });
//         }
//         return res.status(401).json({
//           status: 'error',
//           message: 'Not authorized'
//         });
//       }
//     } catch (error) {
//       res.status(500).json({
//         status: 'error',
//         message: 'Server error in authentication'
//       });
//     }
//   });
// }
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    // Get the token from headers or cookies
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token missing or invalid' });
    }
    // Verify the token
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            // Token expired or invalid
            return res.status(401).json({ message: 'Token is not valid or expired' });
        }
        // Attach the user information to the request
        // req.user = user;
        // Continue with the request
        next();
    });
};
exports.default = authenticateToken;
