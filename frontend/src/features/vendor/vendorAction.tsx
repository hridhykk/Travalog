
import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../../validation/Toast";
import {apiService} from '../../sevice/vendorauthService'
import { vendorRegisterData} from "./vendorType";
//import axios from 'axios';


export const vendorRegister = async(vendorRegistrationData:vendorRegisterData):Promise<boolean> =>{
  try{
    alert(vendorRegistrationData.documents)
    const response = await apiService.Register(vendorRegistrationData);;
    if (response.data.status === 'success') {
      showToastMessage('Registration successful!', 'success');
     return true;
   } else if (response.data.status === 'false') {
     showToastMessage(response.data.message || 'Registration user already excist', 'error');
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

// const url = `http://localhost:5000`;

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
      
      if (response.data.status === 'success') {
        showToastMessage('successfully Login','success');
        
        return response.data;

      }else if (response.data.status === 'false') {
        showToastMessage(response.data.message || 'Registration user already excist', 'error');
        return false;
      } else {
        showToastMessage('Unexpected response from server', 'error');
        return false;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
     
      throw error;
    }
  }
);

