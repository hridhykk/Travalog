"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestPasswordUseCase = exports.ResendRestpassOtpUseCase = exports.ResetPassverifyOtp = exports.ForgotPasswordUseCase = exports.ResendOTPUseCase = exports.VerifyOtpUseCase = exports.RegisterUseCase = void 0;
const passwordutils_1 = require("../../../utils/passwordutils");
const otp_1 = require("../../../utils/otp");
const jwt_1 = require("../../../utils/jwt");
const jwt_2 = require("../../../utils/jwt");
const jwt_3 = require("../../../utils/jwt");
class RegisterUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(name, email, mobile, password, req, res) {
        //const validation = userSchema.parse({ name, email, mobile, password });
        const existingUser = await this.userRepository.FindByEmail(email);
        if (existingUser) {
            return { status: 'failed', message: 'User already exists.' };
        }
        const otp = (0, otp_1.generateOTP)();
        console.log(otp);
        req.session.user = { name, email, mobile, password: await (0, passwordutils_1.hashPassword)(password) };
        req.session.otp = { value: otp, generated: new Date().toISOString() };
        //await sendOTP(email, otp);
        return {
            status: 'success',
            message: 'OTP sent. Please verify.'
        };
    }
}
exports.RegisterUseCase = RegisterUseCase;
class VerifyOtpUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.OTP_EXPIRATION_SECONDS = 30;
    }
    async execute(otp, req, res) {
        const { user, otp: sessionOtp } = req.session;
        if (!user || !sessionOtp) {
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
        const createdUser = await this.userRepository.create(user);
        delete req.session.user;
        delete req.session.otp;
        return { status: 'success', message: 'User registered successfully' };
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
class ResendOTPUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(req, res) {
        const user = req.session.user;
        if (!user || !user.email) {
            return { status: 'failed', message: 'User not found in session.' };
        }
        const email = user.email;
        const newOtp = (0, otp_1.generateOTP)();
        console.log(newOtp);
        delete req.session.otp;
        req.session.otp = { value: newOtp, generated: new Date().toISOString() };
        //await sendOTP(email, newOtp);
        return {
            status: 'success',
            message: 'New OTP sent. Please verify within 30 seconds.'
        };
    }
}
exports.ResendOTPUseCase = ResendOTPUseCase;
class ForgotPasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, req, res) {
        const existingUser = await this.userRepository.FindByEmail(email);
        if (existingUser) {
            const otp = (0, otp_1.generateOTP)();
            console.log(otp);
            //await sendOTP(email, otp);
            req.session.user = {
                name: existingUser.name,
                email: existingUser.email,
                mobile: existingUser.mobile,
                password: existingUser.password
            };
            req.session.otp = { value: otp, generated: new Date().toISOString() };
            return {
                status: 'success',
                message: 'OTP sent. Please check your email.'
            };
        }
        else {
            return { status: 'failed', message: 'User not found.' };
        }
    }
}
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
class ResetPassverifyOtp {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.OTP_EXPIRATION_SECONDS = 30;
    }
    async execute(otp, req, res) {
        const { otp: sessionOtp } = req.session;
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
        (0, jwt_2.setTokenCookies)(res, accessToken, refreshtoken, 'user');
        return { status: 'success', message: 'User  verified Successfully' };
    }
}
exports.ResetPassverifyOtp = ResetPassverifyOtp;
class ResendRestpassOtpUseCase {
    constructor() { }
    async execute(req, res) {
        const user = req.session.user;
        if (!user || !user.email) {
            return { status: 'failed', message: 'User not found in session.' };
        }
        const email = user.email;
        const newOtp = (0, otp_1.generateOTP)();
        console.log(newOtp);
        delete req.session.otp;
        req.session.otp = { value: newOtp, generated: new Date().toISOString() };
        //await sendOTP(email, newOtp);
        const { otp: sessionOtp } = req.session;
        const accessToken = (0, jwt_1.generateToken)({ otp: sessionOtp.value });
        const refreshtoken = (0, jwt_3.refreshToken)({ otp: sessionOtp.value });
        (0, jwt_2.setTokenCookies)(res, accessToken, refreshtoken, 'user');
        return {
            status: 'success',
            message: 'New OTP sent. Please verify within 30 seconds.'
        };
    }
}
exports.ResendRestpassOtpUseCase = ResendRestpassOtpUseCase;
class RestPasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userjwt, password, req, res) {
        try {
            const { user, otp: sessionOtp } = req.session;
            if (!user || !sessionOtp) {
                return {
                    status: 'failed',
                    message: 'No OTP verification in progress.'
                };
            }
            const payload = (0, jwt_1.verifyToken)(userjwt);
            if (payload.otp !== sessionOtp.value) {
                return {
                    status: 'failed',
                    message: 'Invalid OTP.'
                };
            }
            const hashedPassword = await (0, passwordutils_1.hashPassword)(password);
            const updatedUser = await this.userRepository.updatePasswordByEmail(user.email, hashedPassword);
            if (!updatedUser) {
                return {
                    status: 'failed',
                    message: 'Failed to update password.'
                };
            }
            delete req.session.user;
            delete req.session.otp;
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
