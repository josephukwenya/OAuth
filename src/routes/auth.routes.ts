import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback);

router.get('/auth/github', authController.githubAuth);
router.get('/auth/github/callback', authController.githubAuthCallback);

router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/callback', authController.facebookAuthCallback);

// New refresh token and logout endpoints
router.post('/auth/refresh', authController.refreshToken);
router.post('/auth/logout', authController.logout);

export default router;
