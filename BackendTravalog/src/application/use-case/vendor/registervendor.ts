

import { Request, Response } from 'express';
import { IVendorRepository } from "../../../domain/interfaces/repositories/iVendorRepository";
import { generateToken,verifyToken} from "../../../utils/jwt";
import {setTokenCookies} from "../../../utils/jwt";
import {refreshToken} from "../../../utils/jwt";
import { hashPassword } from "../../../utils/passwordutils";
import { generateOTP } from '../../../utils/otp';
import { Session, SessionData } from 'express-session';






export class RegisterUseCase{
  constructor(private vendorRepository:IVendorRepository){

  }
  async execute(req: Request,res:Response,name:string,email:string,mobile:string,password:string,address:string,city:string,description:string,documents?:string): Promise<{ status: string; message: string }>{
 
    const existingUser = await this.vendorRepository.FindByEmail(email);
    
    if (existingUser) {
     return {
      status:'false', message :"vendor already exists."
    } }

    const otp = generateOTP();
    console.log(otp);
    
    req.session.vendor = { name, email, mobile, password: await hashPassword(password) ,address,city,description,documents};
    req.session.VendorOtp = { value: otp, generated: new Date().toISOString() };
   
      return {
        status:'success', message : 'OTP sent. Please verify.'
       }
    
  }
}


export class VerifyOtpUseCase {
  private readonly OTP_EXPIRATION_SECONDS = 30;

  constructor(private vendorRepository: IVendorRepository) {}

  async execute(otp: string, req: Request, res: Response): Promise<{ status: string; message: string }> {
    const { vendor, VendorOtp: sessionOtp } = req.session;
console.log(vendor,'vendor in the session');
console.log('session vendor otp ',sessionOtp)
    if (!vendor || !sessionOtp) {
      return { status: 'failed', message: 'No OTP verification in progress.' };
    }

    if (sessionOtp.value !== otp) {
      return { status: 'failed', message: 'Invalid OTP.' };
    }

    const otpGeneratedAt = new Date(sessionOtp.generated);
    const now = new Date();
    const timeDifferenceSeconds = (now.getTime() - otpGeneratedAt.getTime()) / 1000;

    if (timeDifferenceSeconds > this.OTP_EXPIRATION_SECONDS) {
      
      delete req.session.VendorOtp;
      return {
        status: 'failed',
        message: `OTP has expired. Please request a new one. OTP is valid for ${this.OTP_EXPIRATION_SECONDS} seconds only.`
      };
    }

    const createdVendor = await this.vendorRepository.create(vendor);

 
    delete req.session.vendor;
    delete req.session.VendorOtp;

    return { status: 'success', message: 'Vendor registered successfully' };
  }
}





export class ResendOTPUseCase {
  constructor() {}

  async execute(req: Request, res: Response): Promise<{ status: string; message: string }> {
    try {
      const { vendor: vendorData, VendorOtp: sessionOtp } = req.session;

      if (!vendorData || !vendorData.email) {
        return { status: 'failed', message: 'Vendor not found in session.' };
      }

      const email = vendorData.email;
      const newOtp = generateOTP();
      console.log('Generated OTP:', newOtp);

      // Update OTP in session
      req.session.VendorOtp = { value: newOtp, generated: new Date().toISOString() };

      // Optional: Implement OTP sending logic, e.g., via email
      // await sendOTP(email, newOtp);

      return { 
        status: 'success', 
        message: 'New OTP sent. Please verify within 30 seconds.' 
      };
    } catch (error: any) {
      console.log('Error in ResendOTPUseCase:', error.message);
      return {
        status: 'error',
        message: 'An unexpected error occurred while resending OTP.'
      };
    }
  }
}






export class VerifyEmailUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(email: string,req:Request,res:Response): Promise<{ status: string; message: string }> {
    const existingUser = await this.vendorRepository.FindByEmail(email);

    if (existingUser) {
      
      const otp = generateOTP();
      console.log(otp);
       //await sendOTP(email, otp);
       req.session.vendor = {
        name: existingUser.name,
        email: existingUser.email,
        mobile: existingUser.mobile,
        password: existingUser.password,
        address:existingUser.address,
        city:existingUser.city,
        description:existingUser.description,
        documents:existingUser.documents
      };

      req.session.VendorOtp = { value: otp, generated: new Date().toISOString() };
      return {
        status: 'success',
        message: 'OTP sent. Please check your email.'
      };
      
    }else{

      return { status: 'failed', message: 'Vendor not found.' };
    }

  }
}


export   class ResetPassverifyOtp{
  private readonly OTP_EXPIRATION_SECONDS = 30;

  constructor() {}

  async execute(otp: string, req: Request, res: Response): Promise<{ status: string; message: string }> {
    const {  VendorOtp: sessionOtp } = req.session;

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
    setTokenCookies(res,accessToken, refreshtoken ,'vendor');

    return { status: 'success', message: 'Vendor  verified Successfully' };
}
}


export class ResendRestpassOtpUseCase{
constructor(){}
async execute(req: Request, res: Response): Promise<{ status: string; message: string }> {
  const vendor = req.session.vendor;

  if (!vendor || !vendor.email) {
    return { status: 'failed', message: 'Vendor not found in session.' };
  }

  const email = vendor.email;
  const newOtp = generateOTP();
  console.log(newOtp);

 
  delete req.session.otp;
  req.session.VendorOtp = { value: newOtp, generated: new Date().toISOString() };

  //await sendOTP(email, newOtp);
  const {  VendorOtp: sessionOtp } = req.session;
  const accessToken =  generateToken({otp:sessionOtp.value});
    const  refreshtoken = refreshToken({otp:sessionOtp.value });
    setTokenCookies(res,accessToken, refreshtoken ,'vendor');

  return { 
    status: 'success', 
    message: 'New OTP sent. Please verify within 30 seconds.' 
  };
}

}

export class RestPasswordUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(
    vendorjwt: string,
    password: string,
    req: Request,
    res: Response
  ): Promise<{ status: string; message: string }> {
    try {
      const { vendor,VendorOtp: sessionOtp } = req.session;

      if (!vendor || !sessionOtp) {
        return {
          status: 'failed', 
          message: 'No OTP verification in progress.'
        };
      }

      const payload = verifyToken(vendorjwt);

      if (payload.otp !== sessionOtp.value) { 
        return {
          status: 'failed',
          message: 'Invalid OTP.'
        };
      }

      const hashedPassword = await hashPassword(password);
      const updatedVendor = await this.vendorRepository.updatePasswordByEmail(
        vendor.email,
        hashedPassword
      );

      if (!updatedVendor) {
        return {
          status: 'failed',
          message: 'Failed to update password.'
        };
      }

      delete req.session.vendor;
      delete req.session.VendorOtp;

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

