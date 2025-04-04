"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET; // Ensure to load your secret key from environment variables
const protectRoute = (req, res, next) => {
    // 1. Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
    // 2. If there is no token, respond with unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        // 3. Verify the token with your secret key
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        // 4. Attach the decoded user ID and other info to the request
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = {
                id: decoded.id, // User ID from the token payload
                email: decoded.email, // Include any other information you want from the token
            };
        }
        else {
            return res
                .status(401)
                .json({ message: 'Unauthorized: Invalid token payload' });
        }
        // 5. Continue to the next middleware or route handler
        next();
    }
    catch (error) {
        // If token is invalid or expired, return 401 Unauthorized
        return res
            .status(401)
            .json({ message: 'Unauthorized: Invalid or expired token' });
    }
};
exports.protectRoute = protectRoute;
