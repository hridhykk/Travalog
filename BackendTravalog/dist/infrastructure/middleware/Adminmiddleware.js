"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const jwt_1 = require("../../utils/jwt");
const adminAuthMiddleware = (req, res, next) => {
    try {
        const adminToken = req.cookies.adminjwt;
        console.log('this is the admin ookie from tje frontend ', adminToken);
        // Check if admin token exists in cookies
        if (!adminToken) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No admin token provided.'
            });
            return; // Add explicit return
        }
        try {
            // Verify the token
            const decoded = (0, jwt_1.verifyToken)(adminToken);
            // Attach the decoded payload to the request for use in subsequent middleware/routes
            //req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired admin token.'
            });
            return; // Add explicit return
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
        return; // Add explicit return
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
