"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoginUseCase = exports.LoginUserUseCase = void 0;
const passwordutils_1 = require("../../../utils/passwordutils");
//D:\brocamp\Travalog\BackendTravalog\src\utils\passwordutils.ts
const jwt_1 = require("../../../utils/jwt");
const jwt_2 = require("../../../utils/jwt");
const jwt_3 = require("../../../utils/jwt");
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, password, res) {
        const user = await this.userRepository.FindByEmail(email);
        console.log(user);
        if (!user || user.is_blocked) {
            return {
                status: 'failed', message: "user not excisted"
            };
        }
        if (user.password) {
            const isPasswordValid = await (0, passwordutils_1.comprePassword)(password, user.password);
            if (!isPasswordValid) {
                return {
                    status: 'failed', message: "password not excisted"
                };
            }
        }
        const accessToken = (0, jwt_1.generateToken)({ email: user.email });
        const refreshtoken = (0, jwt_2.refreshToken)({ email: user.email });
        (0, jwt_3.setTokenCookies)(res, accessToken, refreshtoken, 'user');
        return {
            status: 'success', message: "successfully login", user: user, token: accessToken, userRefreshToken: refreshtoken
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
class GoogleLoginUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(email, res) {
        const user = await this.userRepository.FindByEmail(email);
        if (!user || user.is_blocked) {
            return {
                status: 'failed', message: "user not excisted"
            };
        }
        const accessToken = (0, jwt_1.generateToken)({ email: user.email });
        const refreshtoken = (0, jwt_2.refreshToken)({ email: user.email });
        (0, jwt_3.setTokenCookies)(res, accessToken, refreshtoken, 'user');
        return {
            status: 'success', message: "successfully login", user: user, token: accessToken, userRefreshToken: refreshtoken
        };
    }
}
exports.GoogleLoginUseCase = GoogleLoginUseCase;
