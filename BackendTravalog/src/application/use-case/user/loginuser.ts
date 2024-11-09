import { error } from "console";
import { IUserRepository } from "../../../domain/interfaces/repositories/iuserRepository";
import { comprePassword } from "../../../utils/passwordutils";
//D:\brocamp\Travalog\BackendTravalog\src\utils\passwordutils.ts
import { generateToken} from "../../../utils/jwt";
import {refreshToken} from "../../../utils/jwt";
import {setTokenCookies} from "../../../utils/jwt";
import { Response } from "express";
import { GoogleRegisterUseCase } from "./googleregisteruser";

interface LoginResponse {
  status: 'success' | 'failed';
  message: string;
  user?: any; 
  token?: string;
  userRefreshToken?:string
}

export class LoginUserUseCase{
constructor(private userRepository:IUserRepository){

}
async execute(email:string,password:string, res: Response): Promise<LoginResponse>{

  const user = await this.userRepository.FindByEmail(email);
console.log(user)
  if(!user|| user.is_blocked){
   return {
    status:'failed',message:"user not excisted"
  }
  }

  if(user.password){
    const isPasswordValid = await comprePassword(password, user.password);
    if (!isPasswordValid) {
      return {
        status:'failed',message:"password not excisted"
      }
  }
    }
   
    const accessToken =  generateToken({email: user.email});
    const  refreshtoken = refreshToken({email: user.email });

    setTokenCookies(res,accessToken, refreshtoken ,'user');

 return {
    status:'success',message:"successfully login",user:user,token:accessToken, userRefreshToken: refreshtoken
  }
}


}


export class GoogleLoginUseCase {

constructor(private userRepository:IUserRepository){

}

async execute(email:string, res: Response): Promise<LoginResponse>{

  const user = await this.userRepository.FindByEmail(email);

  if(!user|| user.is_blocked){
   return {
    status:'failed',message:"user not excisted"
  }
  }

 
   
    const accessToken =  generateToken({email: user.email});
    const  refreshtoken = refreshToken({email: user.email });

    setTokenCookies(res,accessToken, refreshtoken ,'user');

 return {
    status:'success',message:"successfully login",user:user,token:accessToken, userRefreshToken: refreshtoken
  }
}

}




