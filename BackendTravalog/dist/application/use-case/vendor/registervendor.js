"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestPasswordUseCase = exports.ResendRestpassOtpUseCase = exports.ResetPassverifyOtp = exports.VerifyEmailUseCase = exports.ResendOTPUseCase = exports.VerifyOtpUseCase = exports.RegisterUseCase = void 0;
const jwt_1 = require("../../../utils/jwt");
const jwt_2 = require("../../../utils/jwt");
const jwt_3 = require("../../../utils/jwt");
const passwordutils_1 = require("../../../utils/passwordutils");
const otp_1 = require("../../../utils/otp");
class RegisterUseCase {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    async execute(req, res, name, email, mobile, password, address, city, description, documents) {
        const existingUser = await this.vendorRepository.FindByEmail(email);
        if (existingUser) {
            return {
                status: 'false', message: "vendor already exists."
            };
        }
        const otp = (0, otp_1.generateOTP)();
        console.log(otp);
        req.session.vendor = { name, email, mobile, password: await (0, passwordutils_1.hashPassword)(password), address, city, description, documents };
        req.session.VendorOtp = { value: otp, generated: new Date().toISOString() };
        return {
            status: 'success', message: 'OTP sent. Please verify.'
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
class VerifyOtpUseCase {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
        this.OTP_EXPIRATION_SECONDS = 30;
    }
    async execute(otp, req, res) {
        const { vendor, VendorOtp: sessionOtp } = req.session;
        console.log(vendor, 'vendor in the session');
        console.log('session vendor otp ', sessionOtp);
        if (!vendor || !sessionOtp) {
            return { status: 'failed', message: 'No OTP verification in progress.' };
        }
        if (sessionOtp.value !== otp) {
            return { status: 'failed', message: 'Invalid OTP.' };
        }
        const otpGeneratedAt = new Date(sessionOtp.generated);
        const now = new Date();
        const timeDifferenceSeconds = (now.getTime() - otpGeneratedAt.getTime()) / 1000;
        if (timeDifferenceSeconds > this.OTP_EXPIRATION_SECONDS) {
            delete req.session.VendorOtp;
            return {
                status: 'failed',
                message: `OTP has expired. Please request a new one. OTP is valid for ${this.OTP_EXPIRATION_SECONDS} seconds only.`
            };
        }
        const createdVendor = await this.vendorRepository.create(vendor);
        delete req.session.vendor;
        delete req.session.VendorOtp;
        return { status: 'success', message: 'Vendor registered successfully' };
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
class ResendOTPUseCase {
    constructor() { }
    async execute(req, res) {
        try {
            const { vendor: vendorData, VendorOtp: sessionOtp } = req.session;
            if (!vendorData || !vendorData.email) {
                return { status: 'failed', message: 'Vendor not found in session.' };
            }
            const email = vendorData.email;
            const newOtp = (0, otp_1.generateOTP)();
            console.log('Generated OTP:', newOtp);
            // Update OTP in session
            req.session.VendorOtp = { value: newOtp, generated: new Date().toISOString() };
            // Optional: Implement OTP sending logic, e.g., via email
            // await sendOTP(email, newOtp);
            return {
                status: 'success',
                message: 'New OTP sent. Please verify within 30 seconds.'
            };
        }
        catch (error) {
            console.log('Error in ResendOTPUseCase:', error.message);
            return {
                status: 'error',
                message: 'An unexpected error occurred while resending OTP.'
            };
        }
    }
}
exports.ResendOTPUseCase = ResendOTPUseCase;
class VerifyEmailUseCase {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    async execute(email, req, res) {
        const existingUser = await this.vendorRepository.FindByEmail(email);
        if (existingUser) {
            const otp = (0, otp_1.generateOTP)();
            console.log(otp);
            //await sendOTP(email, otp);
            req.session.vendor = {
                name: existingUser.name,
                email: existingUser.email,
                mobile: existingUser.mobile,
                password: existingUser.password,
                address: existingUser.address,
                city: existingUser.city,
                description: existingUser.description,
                documents: existingUser.documents
            };
            req.session.VendorOtp = { value: otp, generated: new Date().toISOString() };
            return {
                status: 'success',
                message: 'OTP sent. Please check your email.'
            };
        }
        else {
            return { status: 'failed', message: 'Vendor not found.' };
        }
    }
}
exports.VerifyEmailUseCase = VerifyEmailUseCase;
class ResetPassverifyOtp {
    constructor() {
        this.OTP_EXPIRATION_SECONDS = 30;
    }
    async execute(otp, req, res) {
        const { VendorOtp: sessionOtp } = req.session;
        console.log('session otp', sessionOtp?.value);
        if (!sessionOtp) {
            return { status: 'failed', message: 'No OTP verification in progress.' };
        }
        if (sessionOtp.value !== otp) {
            return { status: 'failed', message: 'Invalid OTP.' };
        }
        const otpGeneratedAt = new Date(sessionOtp.generated);
        const now = new Date();
        const timeDifferenceSeconds = (now.getTime() - otpGeneratedAt.getTime()) / 1000;
        if (timeDifferenceSeconds > this.OTP_EXPIRATION_SECONDS) {
            delete req.session.otp;
            return {
                status: 'failed',
                message: `OTP has expired. Please request a new one. OTP is valid for ${this.OTP_EXPIRATION_SECONDS} seconds only.`
            };
        }
        const accessToken = (0, jwt_1.generateToken)({ otp: sessionOtp.value });
        const refreshtoken = (0, jwt_3.refreshToken)({ otp: sessionOtp.value });
        (0, jwt_2.setTokenCookies)(res, accessToken, refreshtoken, 'vendor');
        return { status: 'success', message: 'Vendor  verified Successfully' };
    }
}
exports.ResetPassverifyOtp = ResetPassverifyOtp;
class ResendRestpassOtpUseCase {
    constructor() { }
    async execute(req, res) {
        const vendor = req.session.vendor;
        if (!vendor || !vendor.email) {
            return { status: 'failed', message: 'Vendor not found in session.' };
        }
        const email = vendor.email;
        const newOtp = (0, otp_1.generateOTP)();
        console.log(newOtp);
        delete req.session.otp;
        req.session.VendorOtp = { value: newOtp, generated: new Date().toISOString() };
        //await sendOTP(email, newOtp);
        const { VendorOtp: sessionOtp } = req.session;
        const accessToken = (0, jwt_1.generateToken)({ otp: sessionOtp.value });
        const refreshtoken = (0, jwt_3.refreshToken)({ otp: sessionOtp.value });
        (0, jwt_2.setTokenCookies)(res, accessToken, refreshtoken, 'vendor');
        return {
            status: 'success',
            message: 'New OTP sent. Please verify within 30 seconds.'
        };
    }
}
exports.ResendRestpassOtpUseCase = ResendRestpassOtpUseCase;
class RestPasswordUseCase {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    async execute(vendorjwt, password, req, res) {
        try {
            const { vendor, VendorOtp: sessionOtp } = req.session;
            if (!vendor || !sessionOtp) {
                return {
                    status: 'failed',
                    message: 'No OTP verification in progress.'
                };
            }
            const payload = (0, jwt_1.verifyToken)(vendorjwt);
            if (payload.otp !== sessionOtp.value) {
                return {
                    status: 'failed',
                    message: 'Invalid OTP.'
                };
            }
            const hashedPassword = await (0, passwordutils_1.hashPassword)(password);
            const updatedVendor = await this.vendorRepository.updatePasswordByEmail(vendor.email, hashedPassword);
            if (!updatedVendor) {
                return {
                    status: 'failed',
                    message: 'Failed to update password.'
                };
            }
            delete req.session.vendor;
            delete req.session.VendorOtp;
            return {
                status: 'success',
                message: 'Password reset successfully.'
            };
        }
        catch (error) {
            console.error(error);
            return {
                status: 'failed',
                message: 'An unexpected error occurred.'
            };
        }
    }
}
exports.RestPasswordUseCase = RestPasswordUseCase;
