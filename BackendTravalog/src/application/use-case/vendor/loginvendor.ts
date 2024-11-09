import { error } from "console";
import { IVendorRepository } from "../../../domain/interfaces/repositories/iVendorRepository";
import { comprePassword } from "../../../utils/passwordutils";
import { generateToken,  refreshToken } from "../../../utils/jwt";
import { setTokenCookies } from "../../../utils/jwt";

import { Response } from "express";

interface vendorLoginResponse{
  status: 'success' | 'failed';
  message: string;
  vendor?:any;
  vendortoken?: string;
  vendorRefreshToken?:string

}



export class LoginVendorUseCase{
constructor(private vendorRepository:IVendorRepository){

}
async execute(email:string,password:string, res: Response): Promise<vendorLoginResponse>{

  const vendor = await this.vendorRepository.FindByEmail(email);
  console.log(vendor)
  if(!vendor|| vendor.is_blocked){
   return {
    status:'failed',message:"user not excisted"
  }
  }
  

  const isPasswordValid = await comprePassword(password, vendor.password);
    if (!isPasswordValid) {
      return {
        status:'failed',message:"password not excisted"
      }
      
    }
    
    const vendortoken =  generateToken({ id: vendor._id });
    const refreshtoken =  refreshToken({ id: vendor._id });
    setTokenCookies(res,vendortoken, refreshtoken,'vendor');

 return {
    status:'success',message:"successfully login",vendor:vendor,vendortoken:vendortoken,vendorRefreshToken:refreshtoken
  }
}
}