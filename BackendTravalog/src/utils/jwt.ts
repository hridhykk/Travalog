import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import type { Response as ExpressResponse } from 'express-serve-static-core';
import type { CookieOptions } from 'express-serve-static-core';

interface JWTPayload {
  id?: string;
  email?: string;
  [key: string]: any;
};


export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

export const refreshToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.Refreshsecret, {
    expiresIn: '7d'
  });
};
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.Refreshsecret) as JWTPayload;
};


export const setTokenCookies = (
  res: ExpressResponse, 
  accessToken: string, 
  refreshToken: string,
  userType: 'user' | 'admin' | 'vendor'= 'user'
): void => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };


  res.cookie(`${userType}jwt`, accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, 
  });

 
  res.cookie(`${userType}RefreshToken`, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};
