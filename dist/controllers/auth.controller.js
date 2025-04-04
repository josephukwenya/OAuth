"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const passport_1 = __importDefault(require("passport"));
const jwt_1 = require("../utils/jwt");
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    constructor() {
        this.googleAuth = passport_1.default.authenticate('google', { scope: ['profile', 'email'] });
        this.googleAuthCallback = (req, res, next) => {
            passport_1.default.authenticate('google', async (err, profile) => {
                if (err || !profile) {
                    return res.status(400).json({ message: 'Authentication failed' });
                }
                try {
                    const { user, accessToken, refreshToken } = await authService.socialLogin(profile, 'google');
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
                }
                catch (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Internal server error' });
                }
            })(req, res, next);
        };
        this.facebookAuth = passport_1.default.authenticate('facebook', { scope: ['email'] });
        this.facebookAuthCallback = (req, res, next) => {
            passport_1.default.authenticate('facebook', (err, user) => {
                if (err || !user) {
                    res.status(400).json({ message: 'Authentication failed' });
                    return;
                }
                const accessToken = (0, jwt_1.generateAccessToken)(user);
                const refreshToken = (0, jwt_1.generateRefreshToken)(user);
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                });
                return res.json({ accessToken });
            })(req, res, next);
        };
        this.refreshToken = (req, res, next) => {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res
                    .status(401)
                    .json({ message: 'Unauthorized: No refresh token' });
            }
            try {
                const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
                const newAccessToken = (0, jwt_1.generateAccessToken)(decoded);
                return res.json({ accessToken: newAccessToken });
            }
            catch (error) {
                return res
                    .status(403)
                    .json({ message: 'Forbidden: Invalid refresh token' });
            }
        };
        this.logout = (req, res, next) => {
            res.clearCookie('refreshToken');
            res.json({ message: 'Logged out successfully' });
            return;
        };
    }
}
exports.AuthController = AuthController;
