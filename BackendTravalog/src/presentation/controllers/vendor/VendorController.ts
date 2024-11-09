import { Request,Response,NextFunction } from "express";
import {LoginVendorUseCase} from '../../../application/use-case/vendor/loginvendor' 
import { RegisterUseCase } from "../../../application/use-case/vendor/registervendor";
import {VendorRepository} from '../../../infrastructure/repositories/VendorRepository'
import { generateToken,verifyRefreshToken,setTokenCookies } from "../../../utils/jwt";



export class VendorController{
  
    private loginusecase:LoginVendorUseCase
  private registerusecase:RegisterUseCase
  constructor(){
    const vendorRepository = new VendorRepository();
    this.loginusecase = new LoginVendorUseCase(vendorRepository)
    this.registerusecase = new RegisterUseCase(vendorRepository)
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
      const { name, email, mobile, password } = req.body;
      const result = await this.registerusecase.execute(name, email, mobile, password);
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
}