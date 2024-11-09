// adminService.ts
import { adminAxios } from "../Axiosconfig/Axiosconfig";
import { 
  adminLoginarg, 
  adminResponseData, 
  UserDataResponse,
  EditUserArg,
  EditUserResponse,
  BlockUserResponse,
  EditVendorArg,
  //BlockVendorResponse,
  EditVendorResponse ,
  updateVendorResponse,
  updatevendorData
} from "../features/admin/adminType";
import { AxiosResponse } from "axios";

export interface adminApiService {
  Login: (LoginArg: adminLoginarg) => Promise<AxiosResponse<adminResponseData>>;
  userData: () => Promise<AxiosResponse<UserDataResponse>>;
  editUser: (editData: EditUserArg) => Promise<AxiosResponse<EditUserResponse>>;
  blockUser: (userId: string) => Promise<AxiosResponse<BlockUserResponse>>;
   vendorData: () => Promise<AxiosResponse<UserDataResponse>>;
   editVendor: (editData:EditVendorArg) => Promise<AxiosResponse<EditVendorResponse>>;
   updateVendor: (updateData: updatevendorData) => Promise<AxiosResponse<updateVendorResponse>>;
 
}



export const apiService: adminApiService = {
  Login: async (LoginArg: adminLoginarg): Promise<AxiosResponse<adminResponseData>> => {
    const response = await adminAxios.post<adminResponseData>('/admin/Login', LoginArg);
    return response;
  },

  userData: async (): Promise<AxiosResponse<UserDataResponse>> => {
   
    const response = await adminAxios.get<UserDataResponse>('/admin/fetchUser');
    return response;
  },

  editUser: async (editData: EditUserArg): Promise<AxiosResponse<EditUserResponse>> => {
    const response = await adminAxios.put<EditUserResponse>('/admin/editUser', editData);
    return response;
  },

  blockUser: async (userId: string): Promise<AxiosResponse<BlockUserResponse>> => {
    const response = await adminAxios.put<BlockUserResponse>(`/admin/blockUser/${userId}`);
    return response;
  },

  vendorData: async (): Promise<AxiosResponse<UserDataResponse>> => {
   
    const response = await adminAxios.get<UserDataResponse>('/admin/fetchVendor');
    return response;
  },

  editVendor: async (editData:EditVendorArg): Promise<AxiosResponse<EditVendorResponse >> => {
    alert('hello')
    alert(editData.is_blocked)
    const response = await adminAxios.put<EditVendorResponse >('/admin/editVendor', editData);
    return response;
  },
  updateVendor: async(updateData: updatevendorData):Promise<AxiosResponse<updateVendorResponse>>=>{
  const response = await adminAxios.put<updateVendorResponse>('/admin/updateVendor',updateData);
return response;
  }
  
};