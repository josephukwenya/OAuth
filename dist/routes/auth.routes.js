"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback);
router.get('/auth/github', authController.githubAuth);
router.get('/auth/github/callback', authController.githubAuthCallback);
router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/callback', authController.facebookAuthCallback);
// New refresh token and logout endpoints
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authController.logout);
exports.default = router;
