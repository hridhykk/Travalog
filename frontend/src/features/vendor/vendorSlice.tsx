import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { vendorLogin } from './vendorAction';
import { vendorAuthState, vendorResponseData } from './vendorType';



const initialState: vendorAuthState = {
  vendor: localStorage.getItem('vendor') ? JSON.parse(localStorage.getItem('vendor') || '{}') : null,
  vendortoken: localStorage.getItem('vendortoken') || null,
  isAuthenticated: false
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    logout: (state) => {
      state.vendor = null;
      state.vendortoken= null;
      state.isAuthenticated = false;
      localStorage.removeItem('vendor');
      localStorage.removeItem('vendortoken');
      localStorage.removeItem('vendorRefreshToken');

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(vendorLogin.fulfilled, (state, action: PayloadAction<vendorResponseData>) => {
        if (action.payload.status === 'success' && action.payload.vendor && action.payload.vendortoken && action.payload.vendorRefreshToken) {
          state.vendor = action.payload.vendor;
          state.vendortoken = action.payload.vendortoken;
          state.isAuthenticated = true;
          localStorage.setItem('vendor', JSON.stringify(action.payload.vendor));
          localStorage.setItem('vendortoken', action.payload.vendortoken);
          localStorage.setItem('vendorRefreshToken', action.payload.vendorRefreshToken);
        } 
      })
     
  },
});
export const { logout } = vendorSlice.actions;

export default vendorSlice.reducer;
export const selectUser = (state: any) => state.vendor.vendor;
export const selectIsUserAuthenticated = (state:  any) => state.vendor.isAuthenticated;


export type { vendorAuthState };