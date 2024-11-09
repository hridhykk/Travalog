"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleRegisterUseCase = void 0;
const jwt_1 = require("../../../utils/jwt");
const jwt_2 = require("../../../utils/jwt");
const jwt_3 = require("../../../utils/jwt");
class GoogleRegisterUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(name, email, uid, photoUrl, res) {
        try {
            console.log('Starting Google registration process');
            if (!email || !name || !uid) {
                return {
                    status: 'failed',
                    message: 'Missing required fields'
                };
            }
            const existingUser = await this.userRepository.FindByEmail(email);
            if (existingUser) {
                return {
                    status: 'failed',
                    message: "user already excisting",
                };
            }
            const user = await this.userRepository.create({
                name,
                email,
                uid,
                photoUrl,
                is_googleuser: true,
                is_verified: true,
                mobile: undefined,
                password: undefined,
            });
            console.log('Created new user:', user);
            const accessToken = (0, jwt_1.generateToken)({ email: user.email });
            const refreshtoken = (0, jwt_2.refreshToken)({ email: user.email });
            (0, jwt_3.setTokenCookies)(res, accessToken, refreshtoken, "user");
            return {
                status: 'success',
                message: "Successfully registered with Google",
                user: user,
                token: accessToken,
                userRefreshToken: refreshtoken
            };
        }
        catch (error) {
            console.error('Google registration error:', error);
            return {
                status: 'failed',
                message: error instanceof Error ? error.message : 'An error occurred during registration'
            };
        }
    }
}
exports.GoogleRegisterUseCase = GoogleRegisterUseCase;
