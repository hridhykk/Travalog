
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { showToastMessage } from '../validation/Toast';

type UserType = 'user' | 'admin' | 'vendor';


interface TokenConfig {
  tokenKey: string;
  refreshTokenKey: string;
  baseURL: string;
}


const userConfigs: Record<UserType, TokenConfig> = {
  user: {
    tokenKey: 'token',
    refreshTokenKey: 'userRefreshToken',
    baseURL: 'http://localhost:5000'
  },
  admin: {
    tokenKey: 'admintoken',
    refreshTokenKey: 'adminRefreshToken',
    baseURL: 'http://localhost:5000'
  },
  vendor: {
    tokenKey: 'vendortoken',
    refreshTokenKey: 'vendorRefreshToken',
    baseURL: 'http://localhost:5000'
  }
};


const createAxiosInstance = (userType: UserType): AxiosInstance => {
  const config = userConfigs[userType];
  
  const instance: AxiosInstance = axios.create({
    baseURL: config.baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(userConfigs[userType].tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest: any = error.config;

     
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem(userConfigs[userType].refreshTokenKey);
          if (!refreshToken) {
        
            throw new Error('No refresh token available');
          }
          
          const response = await instance.post(`/${userType}/refreshtoken`, {
            refreshToken: JSON.parse(refreshToken)
          });
         
          if (response.data.token) {
            localStorage.setItem(
              userConfigs[userType].tokenKey,
              JSON.stringify(response.data.token)
            );
            
            if (response.data.refreshToken) {
              localStorage.setItem(
                userConfigs[userType].refreshTokenKey,
                JSON.stringify(response.data.refreshToken)
              );
            }

            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return instance(originalRequest);
          }
        } catch (refreshError) {
         
          localStorage.removeItem(userConfigs[userType].tokenKey);
          //localStorage.removeItem(userConfigs[userType].refreshTokenKey);
          //localStorage.removeItem(`${userType}Data`);
          
         
          window.location.href = `/${userType}`;
          return Promise.reject(refreshError);
        }
      }

   
      switch (error.response?.status) {
        case 400:
          //showToastMessage(error.response.data.message || 'Bad request', 'error');
          break;
        case 404:
          showToastMessage('Resource not found', 'error');
          break;
        case 500:
          showToastMessage('Server error, please try again later', 'error');
          break;
        default:
          showToastMessage('An unexpected error occurred', 'error');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};


export const userAxios = createAxiosInstance('user');
export const adminAxios = createAxiosInstance('admin');
export const vendorAxios = createAxiosInstance('vendor');

// Helper function to get the appropriate axios instance
export const getAxiosInstance = (userType: UserType): AxiosInstance => {
  switch (userType) {
    case 'admin':
      return adminAxios;
    case 'vendor':
      return vendorAxios;
    default:
      return userAxios;
  }
};