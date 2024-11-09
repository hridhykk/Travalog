import { IUserRepository } from "../../../domain/interfaces/repositories/iuserRepository";
import { generateToken } from "../../../utils/jwt";
import { refreshToken } from "../../../utils/jwt";
import { setTokenCookies } from "../../../utils/jwt";
import { Response } from "express";

interface LoginResponse {
  status: 'success' | 'failed';
  message: string;
  user?: any;
  token?: string;
  userRefreshToken?: string;
}

export class GoogleRegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    uid: string,
    photoUrl: string,
    res: Response
  ): Promise<LoginResponse> {
    try {
      console.log('Starting Google registration process');
      
      if (!email || !name || !uid) {
        return {
          status: 'failed',
          message: 'Missing required fields'
        };
      }

      const existingUser = await this.userRepository.FindByEmail(email);
   
      if (existingUser) {
    
        
        return {
          status: 'failed',
          message: "user already excisting",
         
        };
      }

      const user = await this.userRepository.create({
        name,
        email,
        uid,
        photoUrl,
        is_googleuser: true,
        is_verified: true, 
        mobile: undefined, 
        password: undefined ,
      });

      console.log('Created new user:', user);

      const accessToken = generateToken({ email: user.email });
      const refreshtoken = refreshToken({ email: user.email });

      setTokenCookies(res,accessToken,refreshtoken, "user");

      return {
        status: 'success',
        message: "Successfully registered with Google",
        user: user,
        token: accessToken,
        userRefreshToken: refreshtoken
      };
      
    } catch (error) {
      console.error('Google registration error:', error);
      return {
        status: 'failed',
        message: error instanceof Error ? error.message : 'An error occurred during registration'
      };
    }
  }
}