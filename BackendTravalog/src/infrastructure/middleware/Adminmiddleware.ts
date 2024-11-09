// // src/infrastructure/middleware/Adminmiddleware.ts

// import { Request, Response, NextFunction } from 'express';
// import { verifyToken, verifyRefreshToken, generateToken } from '../../utils/jwt';
// import { config } from '../../config/index';

// // Define the JWT payload type
// interface JWTPayload {
//   id: string;
//   email: string;
//   [key: string]: any;
// }

// // Define the authenticated request type
// interface AuthenticatedRequest extends Request {
//   admin?: {
//     id: string;
//     email: string;
//     [key: string]: any;
//   };
// }

// export const adminAuthMiddleware = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): void => {
//   try {
//     const authHeader = req.headers.authorization;
//     const refreshToken = req.cookies?.adminRefreshToken;

//     if (!authHeader) {
//       res.status(401).json({ 
//         status: 'error',
//         message: 'No authorization token provided' 
//       });
//       return;
//     }

//     const token = authHeader.split(' ')[1];
    
//     if (!token) {
//       res.status(401).json({ 
//         status: 'error',
//         message: 'Invalid authorization format' 
//       });
//       return;
//     }

//     try {
//       // Cast the decoded token to our JWTPayload type
//       const decoded = verifyToken(token) as JWTPayload;
      
//       if (!decoded.email || decoded.email !== config.admin.email) {
//         res.status(403).json({ 
//           status: 'error',
//           message: 'Not authorized as admin' 
//         });
//         return;
//       }

//       // Now TypeScript knows decoded has the correct shape
//       req.admin = {
//         id: decoded.id,
//         email: decoded.email
//       };
//       next();
      
//     } catch (error: any) {
//       if (error.name === 'TokenExpiredError' && refreshToken) {
//         try {
//           // Cast the decoded refresh token to our JWTPayload type
//           const decoded = verifyRefreshToken(refreshToken) as JWTPayload;
          
//           if (!decoded.email || decoded.email !== config.admin.email) {
//             res.status(403).json({ 
//               status: 'error',
//               message: 'Invalid refresh token' 
//             });
//             return;
//           }

//           const newAccessToken = generateToken({
//             email: decoded.email,
//             id: decoded.id
//           });

//           res.setHeader('New-Access-Token', newAccessToken);
          
//           // Now TypeScript knows decoded has the correct shape
//           req.admin = {
//             id: decoded.id,
//             email: decoded.email
//           };
//           next();

//         } catch (refreshError) {
//           res.status(401).json({
//             status: 'error',
//             message: 'Session expired. Please login again'
//           });
//           return;
//         }
//       } else {
//         res.status(401).json({
//           status: 'error',
//           message: 'Invalid token'
//         });
//         return;
//       }
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal server error during authentication'
//     });
//     return;
//   }
// };