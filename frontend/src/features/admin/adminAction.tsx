import { createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../../validation/Toast";
import { apiService } from '../../sevice/adminService';

export const adminLogin = createAsyncThunk(
  'admin/login',  // Changed action type
  async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiService.Login(credentials);
      if (response.data.status === 'success') {
        showToastMessage('successfully Login', 'success');
        if (response.data.admintoken) {
          localStorage.setItem('admintoken', JSON.stringify(response.data.admintoken));
          localStorage.setItem('adminRefreshToken', JSON.stringify(response.data.adminRefreshToken));
        }
        return response.data;
      } else if (response.data.status === 'false') {
        showToastMessage(response.data.message || 'Registration user already exist', 'error');
        return false;
      } else {
        showToastMessage('Unexpected response from server', 'error');
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const fetchuserData = createAsyncThunk(
  'admin/fetchUserData',  // Changed action type
  async () => {
    try {
      const response = await apiService.userData();
      return response.data;
    } catch (error) {
      showToastMessage('Failed to update user', 'error');
      throw error;
    }
  }
);

export const editUser = createAsyncThunk(
  'admin/editUser',
  async (editData: { userId: string;  is_blocked: boolean }) => {
    try {
      const response = await apiService.editUser(editData);
      if (response.data.status === 'success') {
        showToastMessage('User updated successfully', 'success');
      }
      return response.data;
    } catch (error) {
      showToastMessage('Failed to update user', 'error');
      throw error;
    }
  }
);

export const fetchVendorData = createAsyncThunk(
  'admin/fetchVendorData', 
  async () => {
    try {
      
      const response = await apiService.vendorData();
      return response.data;
    } catch (error) {
      showToastMessage('Failed to fetch vendor data', 'error');
      throw error;
    }
  }
);

export const editVendor = createAsyncThunk(
  'admin/editVendor',
  async (editData: { vendorId: string; name:string,is_blocked: boolean }) => {
    try {
      const response = await apiService.editVendor(editData);
      if (response.data.status === 'success') {
        showToastMessage('User updated successfully', 'success');
      }
      return response.data;
    } catch (error) {
      showToastMessage('Failed to update user', 'error');
      throw error;
    }
  }
);

export const  updateVendorStatus =createAsyncThunk(
  '/admin/updateVendor',
  async(updateData:{vendorId:string,is_Verified:boolean})=>{
    try{
const response = await apiService.updateVendor(updateData);
return response.data;
    }catch(error){

    }
  }
) 