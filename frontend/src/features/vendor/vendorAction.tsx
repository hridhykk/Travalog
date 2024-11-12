
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../../validation/Toast";
import {apiService} from '../../sevice/vendorauthService'
import { vendorRegisterData} from "./vendorType";
import axios from 'axios';
import { vendorAxios } from "../../Axiosconfig/Axiosconfig";
//import { toast } from "react-toastify"; 
const url = `http://localhost:5000`;



const handleApiError = (error: any): never => {
  if (error.response?.data) {
   
    const errorMessage = error.response.data.message || 'An unexpected error occurred';
    showToastMessage(errorMessage, 'error');
    throw new Error(errorMessage);
  } else if (error.request) {
   
    const errorMessage = 'Network error. Please check your connection.';
    showToastMessage(errorMessage, 'error');
    throw new Error(errorMessage);
  } else {
  
    const errorMessage = error.message || 'An unexpected error occurred';
    showToastMessage(errorMessage, 'error');
    throw new Error(errorMessage);
  }
};





export const vendorRegister = async(vendorRegistrationData:vendorRegisterData):Promise<boolean> =>{
  try{
    alert(vendorRegistrationData.documents)
    const response = await apiService.Register(vendorRegistrationData);;
    const { status, message } = response.data;

     if (status === 'success') {
      showToastMessage(message , 'success');
     return true;
   } else if (status === 'false') {
     showToastMessage(message || 'Registration user already excist', 'error');
     return false;
   } else {
     showToastMessage('Unexpected response from server', 'error');
     return false;
   }
  }catch(error){
    console.error('Error during registration:', error);
    showToastMessage('Registration failed. Please try again later.', 'error');
    return false;
  }


};

// Define the response type to match your backend
// interface VendorResponse {
//   status: string;
//   message: string;
// }

 

// export const vendorRegister = async (vendorRegistrationData: vendorRegisterData): Promise<boolean> => {
//   try {
    // const formData = new FormData();
    
    // const { documents, ...otherData } = vendorRegistrationData;
    
    // // Add all other fields to FormData
    // Object.entries(otherData).forEach(([key, value]) => {
    //   if (value !== undefined && value !== null) {  // Only add defined values
    //     formData.append(key, value.toString());  // Convert to string
    //   }
    // });
    
    // // Add documents if they exist
    // if (documents && Array.isArray(documents)) {
    //   documents.forEach((file, index) => {
    //     formData.append(`documents`, file);  // Use consistent field name
    //   });
    // }

    // // Log formData contents for debugging
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]); 
    // }

//     const response = await axios.post<VendorResponse>(
//       `${url}/vendor/Register`, 
//       vendorRegistrationData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     );

//     if (response.data.status === 'success') {
//       showToastMessage(response.data.message, 'success');
//       return true;
//     }
    
//     showToastMessage(response.data.message || 'Registration failed', 'error');
//     return false;

//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.response?.data?.message || 'Registration failed. Please try again later.';
//       showToastMessage(errorMessage, 'error');
//     } else {
//       showToastMessage('Registration failed. Please try again later.', 'error');
//     }
//     console.error('Error during registration:', error);
//     return false;
//   }
// };


export const vendorLogin = createAsyncThunk(
  'vendor/Login',
  async (credentials: { email: string; password: string }) => {
    try {
      
      const response = await apiService.Login(credentials);
      const {status,message } = response.data
      if (status === 'success') {
        if(message){
          
          showToastMessage(message,'success');
        
 
        }
       
        return response.data;

      }else if (response.data.status === 'false') {
        showToastMessage(response.data.message || 'Registration user already excist', 'error');
        return false;
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


// interface ApiErrorResponse {
//   status: string;
//   message: string;
// }






export const VendorverifyOTP = async (otp: {otp:string}): Promise<{success:boolean;message:string}> => {
  try {
  
    const response = await apiService.verifyOtp(otp);
    
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


export const vendorResendOtp = async():Promise<{success:boolean,message:string}>=>{
  try{
    const response = await apiService.ResendOtp()
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










export const VendorResetpass = async(password:{password:string}):Promise<{success:boolean,message:string}>=>{
  try{
    const response = await vendorAxios.post<{ status: string, message: string }>(
      `${url}/vendor/resetpass`,
      password,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  const {status,message} = response.data;
  if(status==='success'){
    showToastMessage(message,'success')
return{
  success:true,
  message:message
}
  }else{
    showToastMessage(message,'error');
    return{
      success:false,
      message:message
    }
  }
  }catch(error:any){
    return handleApiError(error)
  }
}

