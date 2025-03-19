import jwt from 'jsonwebtoken';
import { IUser } from '../models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_EXPIRY = '15m'; // Short-lived access token
const REFRESH_TOKEN_EXPIRY = '7d'; // Long-lived refresh token

export const generateAccessToken = (user: IUser): string => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.REFRESH_SECRET!);
};
