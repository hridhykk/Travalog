"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserController = void 0;
const UserRepository_1 = require("../../../infrastructure/repositories/UserRepository");
const FetchUsersUseCase_1 = require("../../../application/use-case/admin/FetchUsersUseCase");
const VendorRepository_1 = require("../../../infrastructure/repositories/VendorRepository");
class AdminUserController {
    ;
    constructor() {
        this.fetchUser = async (req, res) => {
            try {
                const result = await this.fetchUsersUseCase.execute();
                console.log(result);
                res.status(result.status === 'success' ? 200 : 404).json({
                    status: result.status,
                    message: result.message,
                    users: result.status === 'success' ? result.users : undefined,
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.editUser = async (req, res) => {
            try {
                const { name, is_blocked, userId } = req.body;
                console.log(req.body);
                const result = await this.editUserUseCase.execute(name, userId, is_blocked);
                res.status(200).json({
                    status: result.status,
                    message: result.message,
                    user: result.user
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.fetchVendor = async (req, res) => {
            try {
                const result = await this.fetchVendorsUseCase.execute();
                console.log(result);
                res.status(result.status === 'success' ? 200 : 404).json({
                    status: result.status,
                    message: result.message,
                    vendors: result.status === 'success' ? result.vendors : undefined,
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.editVendor = async (req, res) => {
            try {
                const { name, is_blocked, vendorId } = req.body;
                console.log(req.body.is_blocked, req.body.vendorId);
                const result = await this.editVendorUseCase.execute(name, vendorId, is_blocked);
                console.log(result);
                res.status(200).json({
                    status: result.status,
                    message: result.message,
                    vendor: result.vendor
                });
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        this.updateVendor = async (req, res) => {
            try {
                const { vendorId, is_Verified } = req.body;
                console.log(req.body);
                const result = await this.updatevendorusecase.execute(vendorId, is_Verified);
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({
                    status: "error",
                    message: error instanceof Error ? error.message : "An unexpected error occurred"
                });
            }
        };
        const userRepository = new UserRepository_1.UserRepository();
        const vendorRepository = new VendorRepository_1.VendorRepository();
        this.fetchUsersUseCase = new FetchUsersUseCase_1.FetchUsersUseCase(userRepository);
        this.editUserUseCase = new FetchUsersUseCase_1.EditUserUseCase(userRepository);
        this.fetchVendorsUseCase = new FetchUsersUseCase_1.FetchVendorsUseCase(vendorRepository);
        this.editVendorUseCase = new FetchUsersUseCase_1.EditVendorUseCase(vendorRepository);
        this.updatevendorusecase = new FetchUsersUseCase_1.UpdateVendorUseCase(vendorRepository);
    }
}
exports.AdminUserController = AdminUserController;
