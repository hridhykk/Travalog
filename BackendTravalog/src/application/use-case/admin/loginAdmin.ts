import { Response } from "express";
import { config } from "../../../config/index";
import { generateToken, setTokenCookies,refreshToken } from "../../../utils/jwt";

interface AdminLoginResponse {
  status: 'success' | 'failed';
  message: string;
  admintoken?: string;
  adminRefreshToken?:string
 
}

export class LoginAdminUseCase {
  async execute(email: string, password: string, res: Response): Promise<AdminLoginResponse> {
    try {
     
      if (!config.admin.email || !config.admin.password) {
        return {
          status: 'failed',
          message: "Admin credentials not configured"
        };
      }

      if (email !== config.admin.email || password !== config.admin.password) {
        return {
          status: 'failed',
          message: "Invalid admin credentials"
        };
      }

      
      const token = generateToken({email:email});
      const refreshtoken = refreshToken({email:email})
     
      setTokenCookies(res, token,refreshtoken,'admin');

      return {
        status: 'success',
        message: "Admin login successful",
        admintoken: token,
        adminRefreshToken:refreshtoken
        
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        status: 'failed',
        message: "An error occurred during admin login"
      };
    }
  }
}


