"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const loginuser_1 = require("../../application/use-case/user/loginuser");
const registeruser_1 = require("../../application/use-case/user/registeruser");
const googleregisteruser_1 = require("../../application/use-case/user/googleregisteruser");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const jwt_1 = require("../../utils/jwt");
class UserController {
    constructor() {
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                console.log(req.body);
                const result = await this.loginusecase.execute(email, password, res);
                res.status(result.status === 'success' ? 200 : 401).json({
                    status: result.status,
                    message: result.message,
                    user: result.status === 'success' ? result.user : undefined,
                    token: result.status === 'success' ? result.token : undefined,
                    userRefreshToken: result.status === 'success' ? result.userRefreshToken : undefined,
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.register = async (req, res) => {
            try {
                const { name, email, mobile, password } = req.body;
                const result = await this.registerusecase.execute(name, email, mobile, password);
                console.log(result, 'result from the registerusecase');
                res.status(result?.status === 'success' ? 200 : 400).json({
                    status: result?.status,
                    message: result?.message
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.refreshToken = async (req, res) => {
            try {
                const refreshToken = req.cookies.userRefreshToken || req.body.refreshToken;
                console.log(refreshToken);
                if (!refreshToken) {
                    res.status(401).json({
                        status: "failed",
                        message: "Refresh token not found"
                    });
                    return;
                }
                const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
                console.log("it is the payload", payload);
                if (!payload || !payload.email) {
                    res.status(401).json({
                        status: "failed",
                        message: "Invalid admin refresh token"
                    });
                    return;
                }
                const newAccessToken = (0, jwt_1.generateToken)({ email: payload.email });
                const newRefreshToken = refreshToken;
                (0, jwt_1.setTokenCookies)(res, newAccessToken, refreshToken, 'user');
                res.json({
                    status: "success",
                    message: "Token refreshed successfully",
                    token: newAccessToken,
                    refreshToken: newRefreshToken
                });
            }
            catch (error) {
                res.status(401).json({
                    status: "failed",
                    message: "Invalid refresh token"
                });
            }
        };
        this.googleregister = async (req, res) => {
            try {
                const { name, email, uid, photoUrl } = req.body;
                console.log('Received Google registration request:', req.body);
                if (!name || !email || !uid) {
                    res.status(400).json({
                        status: 'failed',
                        message: 'Missing required fields'
                    });
                    return;
                }
                const result = await this.googleregisterusecase.execute(name, email, uid, photoUrl, res);
                console.log('Google registration result:', result);
                res.status(result.status === 'success' ? 200 : 401).json({
                    status: result.status,
                    message: result.message,
                    user: result?.user,
                    token: result?.token,
                    userRefreshToken: result?.userRefreshToken
                });
            }
            catch (error) {
                console.error('Error in Google registration controller:', error);
                res.status(500).json({
                    status: 'failed',
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                });
            }
        };
        this.googlelogin = async (req, res) => {
            try {
                const { email } = req.body;
                console.log(req.body);
                if (!email) {
                    res.status(400).json({
                        status: 'failed',
                        message: 'Missing required fields'
                    });
                    return;
                }
                const result = await this.googloginusecase.execute(email, res);
                console.log('Google registration result:', result);
                res.status(result.status === 'success' ? 200 : 401).json({
                    status: result.status,
                    message: result.message,
                    user: result?.user,
                    token: result?.token,
                    userRefreshToken: result?.userRefreshToken
                });
            }
            catch (error) {
                console.error('Error in Google registration controller:', error);
                res.status(500).json({
                    status: 'failed',
                    message: error instanceof Error ? error.message : 'An unexpected error occurred'
                });
            }
        };
        const userRepository = new UserRepository_1.UserRepository();
        this.loginusecase = new loginuser_1.LoginUserUseCase(userRepository);
        this.registerusecase = new registeruser_1.RegisterUseCase(userRepository);
        this.googleregisterusecase = new googleregisteruser_1.GoogleRegisterUseCase(userRepository);
        this.googloginusecase = new loginuser_1.GoogleLoginUseCase(userRepository);
    }
}
exports.UserController = UserController;
