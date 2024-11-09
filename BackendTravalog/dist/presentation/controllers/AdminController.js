"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const loginAdmin_1 = require("../../application/use-case/admin/loginAdmin");
const jwt_1 = require("../../utils/jwt");
class AdminController {
    constructor() {
        this.login = async (req, res, next) => {
            try {
                const { email, password } = req.body;
                console.log(req.body);
                const result = await this.loginadminusecase.execute(email, password, res);
                console.log(result);
                res.status(result.status === 'success' ? 200 : 401).json({
                    status: result.status,
                    message: result.message,
                    admintoken: result.status === 'success' ? result.admintoken : undefined,
                    adminRefreshToken: result.status === 'success' ? result.adminRefreshToken : undefined
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
                const refreshToken = req.cookies.adminRefreshToken || req.body.refreshToken;
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
                // if (payload.email !== config.admin.email) {
                //   res.status(401).json({
                //     status: "failed",
                //     message: "Invalid admin credentials"
                //   });
                //   return;
                // }
                const newAccessToken = (0, jwt_1.generateToken)({ id: payload.id });
                const newRefreshToken = refreshToken;
                (0, jwt_1.setTokenCookies)(res, newAccessToken, refreshToken, 'user');
                console.log(newRefreshToken, newAccessToken);
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
        this.loginadminusecase = new loginAdmin_1.LoginAdminUseCase();
    }
}
exports.AdminController = AdminController;
