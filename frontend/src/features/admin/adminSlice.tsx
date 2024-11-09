import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  adminLogin, 
  fetchuserData, 
  editUser, 
  fetchVendorData 
} from './adminAction';
import { 
  adminAuthState, 
  UserDataResponse, 
  EditUserResponse, 
  VendorDataResponse, 
  adminResponseData 
} from './adminType';

const initialState: adminAuthState = {
  userData: null,
  vendorData: null,
  admintoken: localStorage.getItem('admintoken') || null,
  isAuthenticated: false
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      state.admintoken = null;
      state.isAuthenticated = false;
      state.userData = null;
      state.vendorData = null;
      localStorage.removeItem('admintoken');
      localStorage.removeItem('adminRefreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<adminResponseData>) => {
        if (action.payload.status === 'success' && action.payload.admintoken) {
          state.admintoken = action.payload.admintoken;
          state.isAuthenticated = true;
        
          if (action.payload.adminRefreshToken) {
            localStorage.setItem('adminRefreshToken', action.payload.adminRefreshToken);
          }
        }
      })
      .addCase(fetchuserData.fulfilled, (state, action: PayloadAction<UserDataResponse>) => {
        if (action.payload.status === 'success') {
          state.userData = action.payload.users;
        }
      })
      .addCase(editUser.fulfilled, (state, action: PayloadAction<EditUserResponse>) => {
        if (state.userData && action.payload.status === 'success') {
          const updatedUserIndex = state.userData.findIndex(user => user._id === action.payload.user._id);
          if (updatedUserIndex !== -1) {
            state.userData[updatedUserIndex] = action.payload.user;
          }
        }
      })
      .addCase(fetchVendorData.fulfilled, (state, action: PayloadAction<VendorDataResponse>) => {
        if (action.payload.status === 'success') {
          state.vendorData = action.payload.vendors;
        }
      })
      .addCase(fetchVendorData.rejected, (state) => {
        state.vendorData = null;
      })
      .addCase(fetchuserData.rejected, (state) => {
        state.userData = null;
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;