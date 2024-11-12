import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt';

export const adminAuthMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {  // Explicitly specify return type as void
  try {
    const adminToken = req.cookies.adminjwt;
    console.log('this is the admin ookie from tje frontend ',adminToken)
    // Check if admin token exists in cookies
    if (!adminToken) {
      res.status(401).json({ 
        success: false, 
        message: 'Access denied. No admin token provided.' 
      });
      return;  // Add explicit return
    }

    try {
      // Verify the token
      const decoded = verifyToken(adminToken);
      
      // Attach the decoded payload to the request for use in subsequent middleware/routes
      //req.user = decoded;
      
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired admin token.' 
      });
      return;  // Add explicit return
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;  // Add explicit return
  }
};