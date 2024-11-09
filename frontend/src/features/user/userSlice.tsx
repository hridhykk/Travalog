import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userLogin, usergoogleRegister ,usergoogleLogin } from './userAction';
import { AuthState, userResponseData, GoogleUserResponse } from './userType';

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null,
  token: localStorage.getItem('usertoken') || null,
  isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('usertoken');
      localStorage.removeItem('userRefreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.token = null;
      })
      .addCase(userLogin.fulfilled, (state, action: PayloadAction<userResponseData>) => {
        if (action.payload.status === 'success' && action.payload.user && action.payload.token && action.payload.userRefreshToken) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('usertoken', action.payload.token);
          localStorage.setItem('userRefreshToken', action.payload.userRefreshToken);
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(userLogin.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(usergoogleRegister.pending, (state) => {
        state.token = null;
      })
      .addCase(usergoogleRegister.fulfilled, (state, action: PayloadAction<GoogleUserResponse>) => {
        if (action.payload.status === 'success' && action.payload.user && action.payload.token && action.payload.userRefreshToken) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('usertoken', action.payload.token);
          localStorage.setItem('userRefreshToken', action.payload.userRefreshToken);
        } 
          
      })
      .addCase(usergoogleRegister.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(usergoogleLogin .pending, (state) => {
        state.token = null;
      })
      .addCase(usergoogleLogin .fulfilled, (state, action: PayloadAction<GoogleUserResponse>) => {
        if (action.payload.status === 'success' && action.payload.user && action.payload.token && action.payload.userRefreshToken) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          localStorage.setItem('usertoken', action.payload.token);
          localStorage.setItem('userRefreshToken', action.payload.userRefreshToken);
        } 
      })
      .addCase(usergoogleLogin .rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
export const selectUser = (state: any) => state.user.user;
export const selectIsUserAuthenticated = (state: any) => state.user.isAuthenticated;