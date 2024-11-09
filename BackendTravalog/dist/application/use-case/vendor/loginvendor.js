"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginVendorUseCase = void 0;
const passwordutils_1 = require("../../../utils/passwordutils");
const jwt_1 = require("../../../utils/jwt");
const jwt_2 = require("../../../utils/jwt");
class LoginVendorUseCase {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    async execute(email, password, res) {
        const vendor = await this.vendorRepository.FindByEmail(email);
        console.log(vendor);
        if (!vendor || vendor.is_blocked) {
            return {
                status: 'failed', message: "user not excisted"
            };
        }
        const isPasswordValid = await (0, passwordutils_1.comprePassword)(password, vendor.password);
        if (!isPasswordValid) {
            return {
                status: 'failed', message: "password not excisted"
            };
        }
        const vendortoken = (0, jwt_1.generateToken)({ id: vendor._id });
        const refreshtoken = (0, jwt_1.refreshToken)({ id: vendor._id });
        (0, jwt_2.setTokenCookies)(res, vendortoken, refreshtoken, 'vendor');
        return {
            status: 'success', message: "successfully login", vendor: vendor, vendortoken: vendortoken, vendorRefreshToken: refreshtoken
        };
    }
}
exports.LoginVendorUseCase = LoginVendorUseCase;
