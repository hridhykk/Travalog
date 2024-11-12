"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorController = void 0;
const loginvendor_1 = require("../../../application/use-case/vendor/loginvendor");
const registervendor_1 = require("../../../application/use-case/vendor/registervendor");
const VendorRepository_1 = require("../../../infrastructure/repositories/VendorRepository");
const jwt_1 = require("../../../utils/jwt");
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
                const { name, email, mobile, password, address, city, description, document } = req.body;
                const result = await this.registerusecase.execute(req, res, name, email, mobile, password, address, city, description, document);
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
                (0, jwt_1.setTokenCookies)(res, newAccessToken, refreshToken, 'vendor');
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
        this.verifyOtp = async (req, res) => {
            try {
                const { otp } = req.body;
                console.log(otp);
                const result = await this.verifyOtpUseCase.execute(otp, req, res);
                console.log(result, 'otp verified');
                res.status(result.status === 'success' ? 200 : 400).json({
                    status: result.status,
                    message: result.message
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.resendOtp = async (req, res) => {
            try {
                req.session.touch();
                const result = await this.resendOtpUseCase.execute(req, res);
                // console.log(result,'from resend otp')
                console.log(result, 'resend otp');
                res.status(result.status === 'success' ? 200 : 200).json({
                    status: result.status,
                    message: result.message
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.verifyemail = async (req, res) => {
            try {
                const { email } = req.body;
                const result = await this.verifyEmailUseCase.execute(email, req, res);
                // console.log(result,'from resend otp')
                console.log(result, 'resend otp');
                res.status(result.status === 'success' ? 200 : 200).json({
                    status: result.status,
                    message: result.message
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.resetPassverifyOtp = async (req, res) => {
            try {
                const { otp } = req.body;
                console.log('otp from the frontend', otp);
                const result = await this.resetPassverifyOtpUseCase.execute(otp, req, res);
                console.log(result);
                res.status(result.status === 'success' ? 200 : 400).json({
                    status: result.status,
                    message: result.message,
                });
            }
            catch (error) {
                console.error('Error in forgot password controller:', error);
                res.status(500).json({
                    status: 'failed',
                    message: error instanceof Error ? error.message : 'An unexpected error occurred',
                });
            }
        };
        this.resendResetpassOtp = async (req, res) => {
            try {
                const result = await this.resetResendpassOtpUseCase.execute(req, res);
                console.log(result, 'from resend otp');
                res.status(result.status === 'success' ? 200 : 400).json({
                    status: result.status,
                    message: result.message
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const vendorjwt = req.cookies['vendorjwt'];
                const { password } = req.body;
                console.log('password from the frontend', password);
                const result = await this.resetPasswordUseCase.execute(vendorjwt, password, req, res);
                console.log(result);
                res.status(result.status === 'success' ? 200 : 400).json({
                    status: result.status,
                    message: result.message,
                });
            }
            catch (error) {
                console.error('Error in forgot password controller:', error);
                res.status(500).json({
                    status: 'failed',
                    message: error instanceof Error ? error.message : 'An unexpected error occurred',
                });
            }
        };
        const vendorRepository = new VendorRepository_1.VendorRepository();
        this.loginusecase = new loginvendor_1.LoginVendorUseCase(vendorRepository);
        this.registerusecase = new registervendor_1.RegisterUseCase(vendorRepository);
        this.verifyOtpUseCase = new registervendor_1.VerifyOtpUseCase(vendorRepository);
        this.resendOtpUseCase = new registervendor_1.ResendOTPUseCase();
        this.verifyEmailUseCase = new registervendor_1.VerifyEmailUseCase(vendorRepository);
        this.resetPassverifyOtpUseCase = new registervendor_1.ResetPassverifyOtp();
        this.resetResendpassOtpUseCase = new registervendor_1.ResendRestpassOtpUseCase();
        this.resetPasswordUseCase = new registervendor_1.RestPasswordUseCase(vendorRepository);
    }
}
exports.VendorController = VendorController;
