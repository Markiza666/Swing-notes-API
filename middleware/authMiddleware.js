import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 * securitySchemes:
 * bearerAuth:
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 */

/**
 * Middleware function to authenticate requests using JWT.
 * It expects a JWT in the 'Authorization' header in the format 'Bearer <token>'.
 * If the token is valid, it decodes the user information and attaches it to the request object.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const authenticateToken = (req, res, next) => {
    // Check for the Authorization header
    const authHeader = req.headers['authorization'];

    // If Authorization header is missing, token is null
    // If it exists, split it to get the token part (e.g., "Bearer YOUR_TOKEN" -> "YOUR_TOKEN")
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ message: 'Token is not valid.' });
        }

        req.user = user;  // Attach the decoded user information to the request object
        
        // Log the authenticated user ID for debugging
        console.log("Authenticated user ID (from token):", req.user.id);
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            console.error("ERROR: req.user.id is NOT a valid ObjectId:", req.user.id);
        } else {
            console.log("req.user.id IS a valid ObjectId.");
        }

        next();
    });
};

export default authenticateToken;