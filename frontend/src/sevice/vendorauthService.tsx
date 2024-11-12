
import { vendorAxios } from "../Axiosconfig/Axiosconfig";
import { vendorLoginarg, vendorRegisterData, vendorResponseData } from "../features/vendor/vendorType";
import { AxiosResponse } from "axios";


export interface VendorApiService {
  Register: (registerData: vendorRegisterData) => Promise<AxiosResponse<vendorResponseData>>;
  Login: (loginArg: vendorLoginarg) => Promise<AxiosResponse<vendorResponseData>>;
  verifyOtp:(otp:{otp:string})=> Promise<AxiosResponse<vendorResponseData>>
  ResendOtp:()=>Promise<AxiosResponse<vendorResponseData>>
}

export const apiService: VendorApiService = {
  Register: async (registerData: vendorRegisterData): Promise<AxiosResponse<vendorResponseData>> => {
    const response = await vendorAxios.post<vendorResponseData>('/vendor/Register', registerData)
    return response;
  },

  Login: async (loginArg: vendorLoginarg): Promise<AxiosResponse<vendorResponseData>> => {
    const response = await vendorAxios.post<vendorResponseData>('/vendor/Login', loginArg);
    return response;
  },

  verifyOtp: async (otp:{otp : string}):Promise<AxiosResponse<vendorResponseData>> => {
    const response = await vendorAxios.post<vendorResponseData>('/vendor/verifyOtp', otp);
    return response;otp
  },
  ResendOtp:async ():Promise<AxiosResponse<vendorResponseData>>=>{
    const response = await vendorAxios.post<vendorResponseData>('/vendor/resendotp');
    return response
  }
};