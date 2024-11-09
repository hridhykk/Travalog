export interface vendorRegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  address:string;
  city:string;
  description:string;
  documents:File[];
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  is_blocked: boolean;
}
export interface vendorResponseData {
  status: string;
  message: string;
  vendor?: Vendor;
  vendortoken?: string;
  vendorRefreshToken?: string;
}

export interface vendorLoginarg{
  email:string;
  password:string;
}

export interface vendorAuthState {
  vendor: Vendor| null;
  vendortoken: string | null;
  isAuthenticated: boolean | false;
}