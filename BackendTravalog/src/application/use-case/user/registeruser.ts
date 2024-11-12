import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface Session {
    user?: {
      name: string;
      email: string;
      mobile?: string;
      password?: string;
    };
    vendor?: {
      _id?: string;
      name: string;
      email: string;
      mobile?: string;
      address: string;
      city: string;
      description: string;
      documents?: string;
      password: string;
      
    };
    otp?: {
      value: string;
      generated: string;
    };
    VendorOtp?:{
      value:string;
      generated:string
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & Partial<SessionData>;
    }
  }
}

import { Request, Response } from 'express';
import { IUserRepository } from "../../../domain/interfaces/repositories/iuserRepository";
import { userSchema } from "../../../domain/validators/userValidator";
import { hashPassword } from "../../../utils/passwordutils"
import { generateOTP } from '../../../utils/otp';
import { sendOTP } from '../../../utils/mailer';
import { request } from 'https';
import { generateToken,verifyToken} from "../../../utils/jwt";
import {setTokenCookies} from "../../../utils/jwt";
import {refreshToken} from "../../../utils/jwt";

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    name: string,
    email: string,
    mobile: string,
    password: string,
    req: Request,
    res: Response
  ): Promise<{ status: string; message: string }> {
    //const validation = userSchema.parse({ name, email, mobile, password });

    const existingUser = await this.userRepository.FindByEmail(email);
    if (existingUser) {
      return { status: 'failed', message: 'User already exists.' };
    }

    const otp = generateOTP();
    console.log(otp);

    req.session.user = { name, email, mobile, password: await hashPassword(password) };
    req.session.otp = { value: otp, generated: new Date().toISOString() };

    //await sendOTP(email, otp);
    return {
      status: 'success',
      message: 'OTP sent. Please verify.'
    };
  }
}

export class VerifyOtpUseCase {
  private readonly OTP_EXPIRATION_SECONDS = 30;

  constructor(private userRepository: IUserRepository) {}

  async execute(otp: string, req: Request, res: Response): Promise<{ status: string; message: string }> {
    const { user, otp: sessionOtp } = req.session;

    if (!user || !sessionOtp) {
      return { status: 'failed', message: 'No OTP verification in progress.' };
    }

    if (sessionOtp.value !== otp) {
      return { status: 'failed', message: 'Invalid OTP.' };
    }

    const otpGeneratedAt = new Date(sessionOtp.generated);
    const now = new Date();
    const timeDifferenceSeconds = (now.getTime() - otpGeneratedAt.getTime()) / 1000;

    if (timeDifferenceSeconds > this.OTP_EXPIRATION_SECONDS) {
      
      delete req.session.otp;
      return {
        status: 'failed',
        message: `OTP has expired. Please request a new one. OTP is valid for ${this.OTP_EXPIRATION_SECONDS} seconds only.`
      };
    }

    const createdUser = await this.userRepository.create(user);

 
    delete req.session.user;
    delete req.session.otp;

    return { status: 'success', message: 'User registered successfully' };
  }
}

export class ResendOTPUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(req: Request, res: Response): Promise<{ status: string; message: string }> {
    const user = req.session.user;
    if (!user || !user.email) {
      return { status: 'failed', message: 'User not found in session.' };
    }

    const email = user.email;
    const newOtp = generateOTP();
    console.log(newOtp);

   
    delete req.session.otp;
    req.session.otp = { value: newOtp, generated: new Date().toISOString() };

    //await sendOTP(email, newOtp);

    return { 
      status: 'success', 
      message: 'New OTP sent. Please verify within 30 seconds.' 
    };
  }
}


export class ForgotPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string,req:Request,res:Response): Promise<{ status: string; message: string }> {
    const existingUser = await this.userRepository.FindByEmail(email);

    if (existingUser) {
      
      const otp = generateOTP();
      console.log(otp);
       //await sendOTP(email, otp);
       req.session.user = {
        name: existingUser.name,
        email: existingUser.email,
        mobile: existingUser.mobile,
        password: existingUser.password
      };

      req.session.otp = { value: otp, generated: new Date().toISOString() };
      return {
        status: 'success',
        message: 'OTP sent. Please check your email.'
      };
      
    }else{

      return { status: 'failed', message: 'User not found.' };
    }

  }
}


export   class ResetPassverifyOtp{
  private readonly OTP_EXPIRATION_SECONDS = 30;

  constructor(private userRepository: IUserRepository) {}

  async execute(otp: string, req: Request, res: Response): Promise<{ status: string; message: string }> {
    const {  otp: sessionOtp } = req.session;
  console.log('session otp',sessionOtp?.value)
    if ( !sessionOtp) {
      return { status: 'failed', message: 'No OTP verification in progress.' };
    }

    if (sessionOtp.value !== otp) {
      return { status: 'failed', message: 'Invalid OTP.' };
    }

    const otpGeneratedAt = new Date(sessionOtp.generated);
    const now = new Date();
    const timeDifferenceSeconds = (now.getTime() - otpGeneratedAt.getTime()) / 1000;

    if (timeDifferenceSeconds > this.OTP_EXPIRATION_SECONDS) {
      
      delete req.session.otp;
      return {
        status: 'failed',
        message: `OTP has expired. Please request a new one. OTP is valid for ${this.OTP_EXPIRATION_SECONDS} seconds only.`
      };
    }
     
    const accessToken =  generateToken({otp:sessionOtp.value});
    const  refreshtoken = refreshToken({otp:sessionOtp.value });
    setTokenCookies(res,accessToken, refreshtoken ,'user');

    return { status: 'success', message: 'User  verified Successfully' };
}
}


export class ResendRestpassOtpUseCase{
constructor(){}
async execute(req: Request, res: Response): Promise<{ status: string; message: string }> {
  const user = req.session.user;
  if (!user || !user.email) {
    return { status: 'failed', message: 'User not found in session.' };
  }

  const email = user.email;
  const newOtp = generateOTP();
  console.log(newOtp);

 
  delete req.session.otp;
  req.session.otp = { value: newOtp, generated: new Date().toISOString() };

  //await sendOTP(email, newOtp);
  const {  otp: sessionOtp } = req.session;
  const accessToken =  generateToken({otp:sessionOtp.value});
    const  refreshtoken = refreshToken({otp:sessionOtp.value });
    setTokenCookies(res,accessToken, refreshtoken ,'user');

  return { 
    status: 'success', 
    message: 'New OTP sent. Please verify within 30 seconds.' 
  };
}

}

export class RestPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    userjwt: string,
    password: string,
    req: Request,
    res: Response
  ): Promise<{ status: string; message: string }> {
    try {
      const { user, otp: sessionOtp } = req.session;

      if (!user || !sessionOtp) {
        return {
          status: 'failed', 
          message: 'No OTP verification in progress.'
        };
      }

      const payload = verifyToken(userjwt);

      if (payload.otp !== sessionOtp.value) { 
        return {
          status: 'failed',
          message: 'Invalid OTP.'
        };
      }

      const hashedPassword = await hashPassword(password);
      const updatedUser = await this.userRepository.updatePasswordByEmail(
        user.email,
        hashedPassword
      );

      if (!updatedUser) {
        return {
          status: 'failed',
          message: 'Failed to update password.'
        };
      }

      delete req.session.user;
      delete req.session.otp;

      return {
        status: 'success',
        message: 'Password reset successfully.'
      };
    } catch (error) {
      console.error(error);
      return {
        status: 'failed',
        message: 'An unexpected error occurred.'
      };
    }
  }
}