
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../../validation/Toast";
import {apiService} from '../../sevice/authService'
import { RegisterData,GoogleUserData,RegistrationResponse,ResendOtpResponse} from "./userType";
import { Otp} from "./userType";

//import { toast } from "react-toastify";


// interface ApiErrorResponse {
//   status: string;
//   message: string;
// }

// Helper function to handle API errors
const handleApiError = (error: any): never => {
  if (error.response?.data) {
    // If we have a response from the server
    const errorMessage = error.response.data.message || 'An unexpected error occurred';
    showToastMessage(errorMessage, 'error');
    throw new Error(errorMessage);
  } else if (error.request) {
    // Network error
    const errorMessage = 'Network error. Please check your connection.';
    showToastMessage(errorMessage, 'error');
    throw new Error(errorMessage);
  } else {
    // Other errors
    const errorMessage = error.message || 'An unexpected error occurred';
    showToastMessage(errorMessage, 'error');
    throw new Error(errorMessage);
  }
};


export const userRegister = async(RegistrationData:RegisterData):Promise<RegistrationResponse> =>{
  try{
    const response = await apiService.Register(RegistrationData);
    const { status, message } = response.data;
    if (status === 'success') {
     
      showToastMessage(message, 'success');
  
      return {
        success: true,
        message: response.data.message
      };
   }  else if(status ==='failed') {
    showToastMessage(message, 'error');
    return {
      success: false,
      message: response.data.message
    };
   }else{
    showToastMessage(response.data.message, 'error');
    return {
      success: false,
      message: response.data.message
    };
   }
  }catch (error: any) {
    return handleApiError(error);
  }


};




export const userverifyOTP = async (data:{otp: string}): Promise<RegistrationResponse> => {
    try {
      
      const response = await apiService.verifyOtp(data);
      
      if (!response.data) {
        throw new Error('No response data received');
      }

      const { status, message } = response.data;
    
    alert(message)
      if (status === 'success') {
        
        showToastMessage('OTP verified successfully', 'success');
        return {
          success: true,
          message: message
        };
      } else {
        showToastMessage(message || 'OTP verification failed', 'error');
        return {
          success: false,
          message: message
        };
      }
    } catch (error: any) {
      return handleApiError(error);
    }
  }


export const userresendOtp = async():Promise<ResendOtpResponse>=>{
  try{
 const response =  await apiService.resendOtp();
 const { status, message } = response.data;
 if(status==='success'){
  showToastMessage('OTP verified successfully', 'success');
  return {
    success: true,
    message: message
  };
 }
  else {
    showToastMessage(response.data.message,'error')
    return{
      success: false,
      message: message
    }
  }
  }catch (error: any) {
    return handleApiError(error);
  }
}



export const usergoogleRegister = createAsyncThunk(
  'user/googleRegister',
  async (googleuserData: GoogleUserData) => {
    try {
      const response = await apiService.GoogleRegister(googleuserData);
      if (response.data.status === 'success') {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data.token));
          localStorage.setItem('userRefreshToken', JSON.stringify(response.data.userRefreshToken));
        }
        showToastMessage('Registration successful!', 'success');
        return response.data;
      } else if (response.data.message === 'user already excisting') {
        showToastMessage(response.data.message || 'Registration user already exists', 'error');
        
        throw new Error(response.data.message || 'Registration failed');
      } else {
        showToastMessage('Unexpected response from server', 'error');
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      showToastMessage('Registration failed. Please try again later.', 'error');
      throw error;
    }
  }
);




export const userLogin = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    try {
      alert(credentials)
      const response = await apiService.Login(credentials);
      
      if (response.data.status === 'success') {
        showToastMessage('successfully Login','success');
        // if (response.data.refreshToken) {
        //   localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        // }
        return response.data;
      }else if (response.data.status === 'failed') {
        showToastMessage(response.data.message , 'error');
        return ;
      } else {
        showToastMessage('Unexpected response from server', 'error');
        return false;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error: any) {
      return handleApiError(error);
    }
  
  }
);


export const usergoogleLogin =  createAsyncThunk(
  '/user/googlelogin',
  async(credentials:{email:string})=>{
    try{
const response = await apiService.GoogleLogin(credentials);
return response.data;

    }catch(error){
      throw error;
    }
  }
)

export interface Email{
  email:string
}


export const userforgotPassword = async (credentials: { email: string }): Promise<RegistrationResponse> => {
  try {
    alert(credentials)
    const response = await apiService.forgotpassword(credentials);
    const { status, message } = response.data;
    if (status === 'success') {
      showToastMessage(message, 'success');
     
        return {
          success: true,
          message: message
        };
      
     
    } else {
      showToastMessage(message, 'error');
      return {
        success: false,
        message: message
      };
    }
  } catch (error: any) {
    return handleApiError(error);
  }
};


export const userResetPassOtpverify= async(credentials:{otp:string}):Promise<{success:boolean;message:string}>=>{
  try{
    const response = await apiService.ResetPassOtpverify(credentials);
    const { status, message } = response.data;
    if(status==='success'){
      showToastMessage(message,'success')
      return {
        success: true,
        message: message
      };
    }else{
      showToastMessage(message, 'error');
      return {
        success: false,
        message: message
      };
    }
    
}catch (error: any) {
  return handleApiError(error);
}
}

export const userResendOtpresetpass= async():Promise<{success:boolean,message:string}>=>{
  try{
const response = await apiService.ResendOtpresetpass();
const { status, message } = response.data;
    if(status==='success'){
      showToastMessage(message,'success')
      return {
        success: true,
        message: message
      };
    }else{
      showToastMessage(message, 'error');
      return {
        success: false,
        message: message
      };
    }
  }catch (error: any) {
  return handleApiError(error);
}
}

export const userResetpassword = async(credentials:{password:string}):Promise<{success:boolean,message:string}>=>{
  try{
    const response = await apiService.Resetpassword(credentials);
    const { status, message } = response.data;
    if(status==='success'){
      showToastMessage(message,'success')
      return {
        success: true,
        message: message
      };
    }else{
      showToastMessage(message, 'error');
      return {
        success: false,
        message: message
      };
    }

  }catch (error: any) {
    return handleApiError(error);
  }
  

}