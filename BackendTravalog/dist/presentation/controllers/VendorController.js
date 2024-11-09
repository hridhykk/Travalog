"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const loginvendor_1 = require("../../application/use-case/vendor/loginvendor");
const registervendor_1 = require("../../application/use-case/vendor/registervendor");
const VendorRepository_1 = require("../../infrastructure/repositories/VendorRepository");
const jwt_1 = require("../../utils/jwt");
class VendorController {
    constructor() {
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                console.log(req.body);
                const result = await this.loginusecase.execute(email, password, res);
                res.status(result.status === 'success' ? 200 : 401).json({
                    status: result.status,
                    message: result.message,
                    vendor: result.status === 'success' ? result.vendor : undefined,
                    vendortoken: result.status === 'success' ? result.vendortoken : undefined,
                    vendorRefreshToken: result.status === 'success' ? result.vendorRefreshToken : undefined
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
                res.status(result?.status === 'success' ? 200 : 401).json({
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
                const refreshToken = req.cookies.vendorRefreshToken || req.body.refreshToken;
                if (!refreshToken) {
                    res.status(401).json({
                        status: "failed",
                        message: "Refresh token not found"
                    });
                    return;
                }
                const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
                console.log(payload);
                const newAccessToken = (0, jwt_1.generateToken)({ id: payload.id });
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
        const vendorRepository = new VendorRepository_1.VendorRepository();
        this.loginusecase = new loginvendor_1.LoginVendorUseCase(vendorRepository);
        this.registerusecase = new registervendor_1.RegisterUseCase(vendorRepository);
    }
}
exports.VendorController = VendorController;
