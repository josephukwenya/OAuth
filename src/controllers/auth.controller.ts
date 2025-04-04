import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { IUser, User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
const authService = new AuthService();

export class AuthController {
  googleAuth: (req: Request, res: Response, next: NextFunction) => void =
    passport.authenticate('google', { scope: ['profile', 'email'] });

  googleAuthCallback: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void = (req, res, next) => {
    passport.authenticate('google', async (err: any, profile: any) => {
      if (err || !profile) {
        return res.status(400).json({ message: 'Authentication failed' });
      }

      try {
        const { user, accessToken, refreshToken } =
          await authService.socialLogin(profile, 'google');

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.json({
          accessToken,
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    })(req, res, next);
  };

  facebookAuth: (req: Request, res: Response, next: NextFunction) => void =
    passport.authenticate('facebook', { scope: ['email'] });

  facebookAuthCallback: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void = (req, res, next) => {
    passport.authenticate('facebook', (err: any, user: IUser) => {
      if (err || !user) {
        res.status(400).json({ message: 'Authentication failed' });
        return;
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({ accessToken });
    })(req, res, next);
  };

  refreshToken: (req: Request, res: Response, next: NextFunction) => void = (
    req,
    res,
    next
  ) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No refresh token' });
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken(decoded);

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Invalid refresh token' });
    }
  };

  logout: (req: Request, res: Response, next: NextFunction) => void = (
    req,
    res,
    next
  ) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
    return;
  };
}
