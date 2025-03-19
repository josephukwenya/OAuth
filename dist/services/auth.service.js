"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async socialLogin(profile, provider) {
        const socialUser = {
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            provider,
        };
        let user = await user_model_1.User.findOne({ providerId: socialUser.providerId });
        if (!user) {
            user = await user_model_1.User.create(socialUser);
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user);
        return { user, accessToken, refreshToken };
    }
    async findUserById(id) {
        return user_model_1.User.findById(id);
    }
}
exports.AuthService = AuthService;
