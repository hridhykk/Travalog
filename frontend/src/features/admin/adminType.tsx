
export interface adminResponseData {
  status: string;
  message: string;
  admintoken?: string;
  adminRefreshToken?: string;
}

export interface adminLoginarg{
  email:string;
  password:string;
}

export interface adminAuthState {
  userData: IUser[] | null;
  admintoken: string | null;
  isAuthenticated: boolean;
  vendorData:IVendor[] | null;
}
export interface UserDataResponse {
  status: string;
  message: string;
  users: IUser[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string;
  is_blocked: boolean;
  is_googleuser?: boolean;
  uid?: string;
  photoUrl?: string;
  __v?: number;
}

export interface VendorDataResponse {
  status: string;
  message: string;
  vendors: IVendor[];
}

export interface EditUserResponse {
  status: string;
  message: string;
  user: IUser;
}

export interface BlockUserResponse {
  status: string;
  message: string;
 
}
export interface EditUserArg {
  userId: string;
  is_blocked: boolean;
  name?:string
}

export interface IVendor {
  _id?: string;
  name: string;
  email: string;
  uid?: string;
  mobile?: string;
  password?: string;
  is_blocked?: boolean;
  is_googleuser?: boolean;
  is_Verified?: boolean;

}
export interface EditVendorArg {
  vendorId: string;
  name?: string;
  is_blocked: boolean;
}
export interface EditVendorResponse {
  status: string;
  message: string;
  vendor: IVendor;
};
export interface BlockVendorResponse {
  status: string;
  message: string;
 
}

export interface updatevendorData{
  vendorId:string,
  is_Verified:boolean
}

export interface updateVendorResponse{
  satutus:string;
  message:string;

}