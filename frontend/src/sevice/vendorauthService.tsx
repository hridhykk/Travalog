
import { vendorAxios } from "../Axiosconfig/Axiosconfig";
import { vendorLoginarg, vendorRegisterData, vendorResponseData } from "../features/vendor/vendorType";
import { AxiosResponse } from "axios";


export interface UserApiService {
  Register: (registerData: vendorRegisterData) => Promise<AxiosResponse<vendorResponseData>>;
  Login: (loginArg: vendorLoginarg) => Promise<AxiosResponse<vendorResponseData>>;
}

export const apiService: UserApiService = {
  Register: async (registerData: vendorRegisterData): Promise<AxiosResponse<vendorResponseData>> => {
    const response = await vendorAxios.post<vendorResponseData>('/vendor/Register', registerData)
    return response;
  },

  Login: async (loginArg: vendorLoginarg): Promise<AxiosResponse<vendorResponseData>> => {
    const response = await vendorAxios.post<vendorResponseData>('/vendor/Login', loginArg);
    return response;
  }
};