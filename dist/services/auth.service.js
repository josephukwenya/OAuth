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
            profileUrl: provider === 'github' ? profile.profileUrl : undefined,
        };
        // Dynamically assign the provider-specific ID
        const providerIdField = `${provider}Id`;
        socialUser[providerIdField] = profile.id;
        // Dynamically assign the provider-specific ID with proper typing
        // if (provider === 'google') {
        //   socialUser.googleId = profile.id;
        // } else if (provider === 'github') {
        //   socialUser.githubId = profile.id;
        // } else if (provider === 'facebook') {
        //   socialUser.facebookId = profile.id;
        // }
        let user = await user_model_1.User.findOne({ providerId: socialUser.providerId });
        if (!user) {
            try {
                user = await user_model_1.User.create(socialUser);
            }
            catch (err) {
                throw err;
            }
        }
        try {
            const accessToken = (0, jwt_1.generateAccessToken)(user);
            const refreshToken = (0, jwt_1.generateRefreshToken)(user);
            return { user, accessToken, refreshToken };
        }
        catch (err) {
            throw err;
        }
    }
    async findUserById(id) {
        const user = await user_model_1.User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
