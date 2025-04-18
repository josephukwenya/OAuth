"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_facebook_1 = require("passport-facebook");
const passport_github2_1 = require("passport-github2");
const auth_service_1 = require("../services/auth.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authService = new auth_service_1.AuthService();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    // Just pass the profile to the controller
    try {
        return done(null, profile);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
    scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
    // Just pass the profile to the controller
    try {
        return done(null, profile);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'picture.type(large)'],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        return done(null, profile);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const user = await authService.findUserById(id);
    done(null, user);
});
