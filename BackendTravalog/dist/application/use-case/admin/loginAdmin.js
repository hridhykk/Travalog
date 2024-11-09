"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginAdminUseCase = void 0;
const index_1 = require("../../../config/index");
const jwt_1 = require("../../../utils/jwt");
class LoginAdminUseCase {
    async execute(email, password, res) {
        try {
            if (!index_1.config.admin.email || !index_1.config.admin.password) {
                return {
                    status: 'failed',
                    message: "Admin credentials not configured"
                };
            }
            if (email !== index_1.config.admin.email || password !== index_1.config.admin.password) {
                return {
                    status: 'failed',
                    message: "Invalid admin credentials"
                };
            }
            const token = (0, jwt_1.generateToken)({ email: email });
            const refreshtoken = (0, jwt_1.refreshToken)({ email: email });
            (0, jwt_1.setTokenCookies)(res, token, refreshtoken, 'admin');
            return {
                status: 'success',
                message: "Admin login successful",
                admintoken: token,
                adminRefreshToken: refreshtoken
            };
        }
        catch (error) {
            console.error('Admin login error:', error);
            return {
                status: 'failed',
                message: "An error occurred during admin login"
            };
        }
    }
}
exports.LoginAdminUseCase = LoginAdminUseCase;
