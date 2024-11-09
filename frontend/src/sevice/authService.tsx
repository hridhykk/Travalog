
import { userAxios } from "../Axiosconfig/Axiosconfig";
import { Loginarg, RegisterData, userResponseData,GoogleUserData ,GoogleUserResponse,GoogleloginArg, Otp} from "../features/user/userType";
import { AxiosResponse } from "axios";

interface UserApiService{
  Register:  (registerData: RegisterData)=> Promise<AxiosResponse<userResponseData>>;
  GoogleRegister:  (googleUserData : GoogleUserData )=> Promise<AxiosResponse<GoogleUserResponse>>;
  Login:  (loginArg: Loginarg) =>Promise<AxiosResponse<userResponseData>> ;
  GoogleLogin: (googleLoginArg:GoogleloginArg) =>Promise<AxiosResponse<GoogleUserResponse>>
  verifyOtp:(otp: Otp)=> Promise<AxiosResponse<userResponseData>>
  resendOtp:()=> Promise<AxiosResponse<userResponseData>>;
  forgotpassword:(credentials: { email: string })=>Promise<AxiosResponse<userResponseData>>
  ResetPassOtpverify:(credentials:{otp:string})=>Promise<AxiosResponse<userResponseData>>
  ResendOtpresetpass:()=> Promise<AxiosResponse<userResponseData>>;
  Resetpassword:(credentials:{password:string})=>Promise<AxiosResponse<userResponseData>>
}

export const apiService:UserApiService = {
  Register: async (registerData: RegisterData): Promise<AxiosResponse<userResponseData>> => {
    const response = await userAxios.post<userResponseData>('/user/Register', registerData);
    return response;
  },


   GoogleRegister: async (googleUserData : GoogleUserData ): Promise<AxiosResponse<GoogleUserResponse>> => {
    const response = await userAxios.post<GoogleUserResponse>('/user/GoogleRegister', googleUserData);

    return response;
  },

  verifyOtp: async (otp : Otp ): Promise<AxiosResponse<userResponseData>> => {
    const response = await userAxios.post<GoogleUserResponse>('/user/verifyOtp', otp);
    return response;
  },

resendOtp:async(): Promise<AxiosResponse<userResponseData>>=>{
  const response= await userAxios.post('/user/resendOtp')
return response;
},
  Login: async (loginArg: Loginarg): Promise<AxiosResponse<userResponseData>> => {
    const response = await userAxios.post<userResponseData>('/user/VerifyLogin', loginArg);
    return response;
  },

  GoogleLogin: async(googleLoginArg:GoogleloginArg):Promise<AxiosResponse<GoogleUserResponse>>=>{
   const response = await userAxios.post<GoogleUserResponse>('/user/GoogleLogin',googleLoginArg);
   return response
  },
  forgotpassword:async(credentials: { email: string }):Promise<AxiosResponse<userResponseData>>=>{
const response = await userAxios.post<userResponseData>('/user/forgotpassword',credentials);
return response;
  },
  ResetPassOtpverify:async(credentials:{otp:string}):Promise<AxiosResponse<userResponseData>>=>{
    const response = await userAxios.post<userResponseData>('/user/resetPassverifyOtp',credentials);
    return response
  },
  ResendOtpresetpass:async ():Promise<AxiosResponse<userResponseData>>=>{
    const response = await userAxios.post<userResponseData>('/user/resendResetpassOtp');
    return response
  },
  Resetpassword:async(credentials:{password:string}):Promise<AxiosResponse<userResponseData>>=>{
    const response =  await userAxios.post<userResponseData>('/user/resetPassword',credentials);
    return response;
  }
};

