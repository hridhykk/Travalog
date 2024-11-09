import { Request,Response,NextFunction } from "express";
import {LoginAdminUseCase} from '../../../application/use-case/admin/loginAdmin' ;
import { generateToken,verifyRefreshToken,setTokenCookies } from "../../../utils/jwt";




export class AdminController{
  
  private loginadminusecase:LoginAdminUseCase

  constructor(){
 
    this.loginadminusecase = new LoginAdminUseCase()

  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      
      
      const result = await this.loginadminusecase.execute(email, password, res);
      console.log(result)
      
      res.status(result.status === 'success' ? 200 : 404).json({
        status: result.status,
        message: result.message,
        admintoken:result.status === 'success' ? result.admintoken: undefined ,
        adminRefreshToken:result.status ==='success'? result.adminRefreshToken:undefined
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
      const refreshToken = req.cookies.adminRefreshToken || req.body.refreshToken;
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
      // if (payload.email !== config.admin.email) {
      //   res.status(401).json({
      //     status: "failed",
      //     message: "Invalid admin credentials"
      //   });
      //   return;
      // }

      const newAccessToken = generateToken({ id: payload.id });
      const newRefreshToken = refreshToken; 
      setTokenCookies(res, newAccessToken, refreshToken, 'user');
      console.log(newRefreshToken,newAccessToken)
      res.json({
        status: "success",
        message: "Token refreshed successfully",
        token: newAccessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      res.status(404).json({ 
        status: "failed", 
        message: "Invalid refresh token" 
      });
    }
  };
}