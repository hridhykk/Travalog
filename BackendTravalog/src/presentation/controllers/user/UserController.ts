import { Request,Response,NextFunction } from "express";
import {LoginUserUseCase,GoogleLoginUseCase} from '../../../application/use-case/user/loginuser' ;
import { RegisterUseCase,VerifyOtpUseCase,ResendOTPUseCase,ForgotPasswordUseCase,ResetPassverifyOtp,RestPasswordUseCase,ResendRestpassOtpUseCase } from "../../../application/use-case/user/registeruser";
import { GoogleRegisterUseCase } from "../../../application/use-case/user/googleregisteruser";
import {UserRepository} from '../../../infrastructure/repositories/UserRepository'
import { generateToken,verifyRefreshToken,verifyToken,setTokenCookies } from"../../../utils/jwt";
import { promises } from "dns";
import { request } from "https";
export interface Otp {
  otp: string;
}

export interface Email{
  email:string
}


export class UserController{
  
  private loginusecase:LoginUserUseCase
  private registerusecase:RegisterUseCase
  private googleregisterusecase:GoogleRegisterUseCase
  private googloginusecase:GoogleLoginUseCase
  private verifyOtpUseCase:VerifyOtpUseCase
  private resendOtpUseCase:ResendOTPUseCase
  private forgotpasswordUseCase:ForgotPasswordUseCase
  private resetPassverifyOtpUseCase:ResetPassverifyOtp;
  private resetPasswordUseCase:RestPasswordUseCase;
  private resetResendpassOtpUseCase:ResendRestpassOtpUseCase
  constructor(){
    const userRepository = new UserRepository();
    this.loginusecase = new LoginUserUseCase(userRepository)
    this.registerusecase = new RegisterUseCase(userRepository);
    this.verifyOtpUseCase = new VerifyOtpUseCase(userRepository)
    this.googleregisterusecase = new GoogleRegisterUseCase(userRepository)
    this.googloginusecase = new GoogleLoginUseCase(userRepository);
    this.resendOtpUseCase = new ResendOTPUseCase(userRepository);
    this.forgotpasswordUseCase= new ForgotPasswordUseCase(userRepository);
    this.resetPassverifyOtpUseCase = new ResetPassverifyOtp(userRepository);
    this.resetPasswordUseCase =  new RestPasswordUseCase(userRepository);
    this.resetResendpassOtpUseCase = new ResendRestpassOtpUseCase()
  }





  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      
      
      const result = await this.loginusecase.execute(email, password, res);
      
      
      res.status( 200 ).json({
        status: result.status,
        message: result.message,
        user: result.status === 'success' ? result.user : undefined,
        token:result.status === 'success' ? result.token: undefined,
        userRefreshToken:result.status ==='success'? result.userRefreshToken :undefined,
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
  };





  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, mobile, password } = req.body;
      const result = await this.registerusecase.execute(name, email, mobile, password,req,res);
      console.log(result, 'result from the registerusecase');
      res.status(result.status === 'success' ? 200 : 400).json({ 
        status: result.status,
        message: result.message 
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
  };





  verifyOtp = async(req:Request,res:Response):Promise<void>=>{
     try{

      
      const { otp } = req.body as Otp;

     const result = await this.verifyOtpUseCase.execute(otp,req,res);
     console.log(result,'otp verified')
     res.status(result.status ==='success'?200:400).json({
      status:result.status,
      message:result.message
     })
     }catch(error){
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
     }
  }





resendOtp = async(req:Request,res:Response):Promise<void>=>{
try{
const result = await this.resendOtpUseCase.execute(req,res);
console.log(result,'from resend otp')
console.log(result, 'resend otp');
      res.status(result.status === 'success' ? 200 : 400).json({ 
        status: result.status,
        message: result.message 
      });
}catch(error){
  res.status(500).json({ 
    status: "error", 
    message: error instanceof Error ? error.message : "An unexpected error occurred" 
  });
}
}




  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken =req.cookies.userRefreshToken || req.body.refreshToken;
      console.log(refreshToken)
      if (!refreshToken) {
        res.status(401).json({ 
          status: "failed", 
          message: "Refresh token not found" 
        });
        return;
      }
  
      const payload = verifyRefreshToken(refreshToken);
      console.log("it is the payload",payload);
      if (!payload || !payload.email) {
        res.status(401).json({
          status: "failed",
          message: "Invalid admin refresh token"
        });
        return;
      }
      const newAccessToken = generateToken({ email: payload.email });
      const newRefreshToken = refreshToken; 
      setTokenCookies(res, newAccessToken, refreshToken, 'user');
  
      res.json({
        status: "success",
        message: "Token refreshed successfully",
        token: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      res.status(401).json({ 
        status: "failed", 
        message: "Invalid refresh token" 
      });
    }
  };




  googleregister = async(req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, uid, photoUrl } = req.body;
      console.log('Received Google registration request:', req.body);
      
      if (!name || !email || !uid) {
        res.status(400).json({
          status: 'failed',
          message: 'Missing required fields'
        });
        return;
      }
  
      const result = await this.googleregisterusecase.execute(
        name,
        email,
        uid,
        photoUrl,
        res
      );
      
      console.log('Google registration result:', result);
      
      res.status(result.status === 'success' ? 200 : 401).json({
        status: result.status,
        message: result.message,
        user: result?.user,
        token: result?.token,
        userRefreshToken: result?.userRefreshToken
      });
  
    } catch (error) {
      console.error('Error in Google registration controller:', error);
      res.status(500).json({ 
        status: 'failed', 
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }



  

  googlelogin = async(req:Request,res:Response):Promise<void>=>{
    try{
const {email} = req.body as Email;
console.log(req.body);
   
if ( !email ) {
  res.status(400).json({
    status: 'failed',
    message: 'Missing required fields'
  });
  return;

}
const result = await this.googloginusecase.execute(email, res);

console.log('Google registration result:', result);
      
      res.status(result.status === 'success' ? 200 : 401).json({
        status: result.status,
        message: result.message,
        user: result?.user,
        token: result?.token,
        userRefreshToken: result?.userRefreshToken
      });
 
    }catch(error){
      console.error('Error in Google registration controller:', error);
      res.status(500).json({ 
        status: 'failed', 
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }


  forgotpassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      console.log(email);
  
      if (!email) {
        res.status(400).json({
          status: "failed",
          message: "Email is required",
        });
        return;
      }
  
      const result = await this.forgotpasswordUseCase.execute(email, req, res);
      console.log(result);
  
      res.status(result.status === 'success' ? 200 : 400).json({
        status: result.status,
        message: result.message,
      });
    } catch (error) {
      console.error('Error in forgot password controller:', error);
      res.status(500).json({
        status: 'failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };


 resetPassverifyOtp = async(req:Request,res:Response):Promise<void>=>{
    try{
     
      const {otp} = req.body as Otp;
      console.log('otp from the frontend',otp);
      const result = await  this.resetPassverifyOtpUseCase.execute(otp,req,res);
      console.log(result);
      res.status(result.status === 'success' ? 200 : 400).json({
        status: result.status,
        message: result.message,
      });
    }catch(error){
      console.error('Error in forgot password controller:', error);
      res.status(500).json({
        status: 'failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }
  


  resetPassword = async(req:Request,res:Response):Promise<void>=>{
    try{

   const userjwt = req.cookies['userjwt'];
   const password = req.body.password;
   const result = await this.resetPasswordUseCase.execute(userjwt,password,req,res);
   console.log(result);
   res.status(result.status === 'success' ? 200 : 400).json({
    status: result.status,
    message: result.message,
  });
    }catch(error){
      console.error('Error in forgot password controller', error);
      res.status(500).json({
        status: 'failed',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  }
  


  resendResetpassOtp = async(req:Request,res:Response):Promise<void>=>{
    try{
    const result = await this.resetResendpassOtpUseCase.execute(req,res);
    console.log(result,'from resend otp')
    
          res.status(result.status === 'success' ? 200 : 400).json({ 
            status: result.status,
            message: result.message 
          });
    }catch(error){
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
    }
    
}

