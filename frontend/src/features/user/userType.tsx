export interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
}
export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface Otp{
  otp:string
}


export interface Email{
  email:string
}

interface User {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  is_blocked?: boolean;
  is_googleuser?: boolean;
  uid?:string;
  photoUrl?:string;
}
export interface userResponseData {
  status: string;
  message: string;
  user?: User;
  token?: string;
 userRefreshToken?:string
}

export interface Loginarg{
  email:string;
  password:string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean | false;
}

export interface GoogleUserData {
 
  name: string | null;
  email: string | null;
  uid: string;
  photoUrl?: string | null;
  
}
export interface GoogleUser {
  _id: string;
  name: string;
  email: string;
  uid: string;
  photoUrl?: string;
  is_blocked?: boolean;
  is_googleuser?: boolean;
}

export interface GoogleUserResponse {
  status: 'success' | 'failed';
  message: string;
  user?:  GoogleUser;
  token?: string;
  userRefreshToken?: string;
}

export interface GoogleloginArg{
  email:string
}
