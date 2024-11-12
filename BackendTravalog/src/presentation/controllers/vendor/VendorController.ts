import { Request,Response,NextFunction } from "express";
import {LoginVendorUseCase} from '../../../application/use-case/vendor/loginvendor' 
import { RegisterUseCase, VerifyOtpUseCase,ResendOTPUseCase,VerifyEmailUseCase,ResetPassverifyOtp,ResendRestpassOtpUseCase,RestPasswordUseCase} from "../../../application/use-case/vendor/registervendor";
import {VendorRepository} from '../../../infrastructure/repositories/VendorRepository'
import { generateToken,verifyRefreshToken,setTokenCookies } from "../../../utils/jwt";



export class VendorController{
  
    private loginusecase:LoginVendorUseCase
  private registerusecase:RegisterUseCase
  private verifyOtpUseCase:VerifyOtpUseCase
  private resendOtpUseCase:ResendOTPUseCase
  private verifyEmailUseCase:VerifyEmailUseCase
  private resetPassverifyOtpUseCase : ResetPassverifyOtp
  private resetResendpassOtpUseCase: ResendRestpassOtpUseCase;
   private resetPasswordUseCase: RestPasswordUseCase
  constructor(){
    const vendorRepository = new VendorRepository();
    this.loginusecase = new LoginVendorUseCase(vendorRepository)
    this.registerusecase = new RegisterUseCase(vendorRepository);
    this.verifyOtpUseCase = new VerifyOtpUseCase(vendorRepository);
    this.resendOtpUseCase = new ResendOTPUseCase();
    this.verifyEmailUseCase= new VerifyEmailUseCase(vendorRepository);
    this.resetPassverifyOtpUseCase = new ResetPassverifyOtp();
    this.resetResendpassOtpUseCase = new ResendRestpassOtpUseCase();
    this.resetPasswordUseCase= new  RestPasswordUseCase(vendorRepository)
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      console.log(req.body);
      
      
      const result = await this.loginusecase.execute(email, password, res);
      
      
      res.status(result.status === 'success' ? 200 : 401).json({
        status: result.status,
        message: result.message,
        vendor: result.status === 'success' ? result.vendor : undefined,
        vendortoken: result.status === 'success' ? result.vendortoken : undefined,
        vendorRefreshToken:result.status === 'success' ? result.vendorRefreshToken: undefined
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
      const { name, email, mobile, password,address,city,description,document } = req.body;
      const result = await this.registerusecase.execute(req,res,name, email, mobile, password,address,city,description,document);
      console.log(result, 'result from the registerusecase');
      res.status(result?.status === 'success' ? 200 : 401).json({ 
        status: result?.status,
        message: result?.message 
      });
    } catch (error) {
      res.status(500).json({ 
        status: "error", 
        message: error instanceof Error ? error.message : "An unexpected error occurred" 
      });
    }
  };




  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken =req.cookies.vendorRefreshToken || req.body.refreshToken;
     
      if (!refreshToken) {
        res.status(401).json({ 
          status: "failed", 
          message: "Refresh token not found" 
        });
        return;
      }
  
      const payload = verifyRefreshToken(refreshToken);
      console.log(payload);
      const newAccessToken = generateToken({ id: payload.id });
      const newRefreshToken = refreshToken; 
      setTokenCookies(res, newAccessToken, refreshToken, 'vendor');
  
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


  verifyOtp = async(req:Request,res:Response):Promise<void>=>{
    try{

     
     const {otp}  = req.body ;
console.log(otp)
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
    req.session.touch();
  const result = await this.resendOtpUseCase.execute(req,res);
  // console.log(result,'from resend otp')
  console.log(result, 'resend otp');
        res.status(result.status === 'success' ? 200 : 200).json({ 
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


  


 verifyemail = async(req:Request,res:Response):Promise<void>=>{
  try{
   const {email} = req.body
  const result = await this.verifyEmailUseCase.execute(email,req,res);
  // console.log(result,'from resend otp')
  console.log(result, 'resend otp');
        res.status(result.status === 'success' ? 200 : 200).json({ 
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


  resetPassverifyOtp = async(req:Request,res:Response):Promise<void>=>{
    try{
     
      const {otp} = req.body ;
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

    
  resetPassword = async(req:Request,res:Response):Promise<void>=>{
    try{
      const vendorjwt = req.cookies['vendorjwt'];
      const {password} = req.body ;
      console.log('password from the frontend',password);
      const result = await  this.resetPasswordUseCase.execute( vendorjwt,password,req,res);
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

}


