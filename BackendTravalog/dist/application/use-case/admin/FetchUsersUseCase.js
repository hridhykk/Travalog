"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVendorUseCase = exports.EditVendorUseCase = exports.FetchVendorsUseCase = exports.EditUserUseCase = exports.FetchUsersUseCase = void 0;
class FetchUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        try {
            const users = await this.userRepository.findAllUsers();
            return {
                status: "success",
                message: "Users fetched successfully",
                users: users
            };
        }
        catch (error) {
            throw {
                status: "error",
                message: "Failed to fetch users",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }
}
exports.FetchUsersUseCase = FetchUsersUseCase;
class EditUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(name, userId, is_blocked) {
        try {
            const updatedUser = await this.userRepository.updateUser(userId, {
                name,
                is_blocked
            });
            if (!updatedUser) {
                return {
                    status: "error",
                    message: "User not found"
                };
            }
            return {
                status: "success",
                message: "User updated successfully",
                user: updatedUser,
            };
        }
        catch (error) {
            throw {
                status: "error",
                message: "Failed to update user",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }
}
exports.EditUserUseCase = EditUserUseCase;
class FetchVendorsUseCase {
    constructor(vednorRepsository) {
        this.vednorRepsository = vednorRepsository;
    }
    async execute() {
        try {
            const Vendors = await this.vednorRepsository.findAllVendors();
            return {
                status: "success",
                message: "Users fetched successfully",
                vendors: Vendors
            };
        }
        catch (error) {
            throw {
                status: "error",
                message: "Failed to fetch users",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }
}
exports.FetchVendorsUseCase = FetchVendorsUseCase;
class EditVendorUseCase {
    constructor(vednorRepsository) {
        this.vednorRepsository = vednorRepsository;
    }
    async execute(name, vendorId, is_blocked) {
        try {
            const updatedUser = await this.vednorRepsository.updateVendor(vendorId, {
                name,
                is_blocked
            });
            if (!updatedUser) {
                return {
                    status: "error",
                    message: "User not found"
                };
            }
            return {
                status: "success",
                message: "User updated successfully",
                vendor: updatedUser,
            };
        }
        catch (error) {
            throw {
                status: "error",
                message: "Failed to update user",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }
}
exports.EditVendorUseCase = EditVendorUseCase;
class UpdateVendorUseCase {
    constructor(vednorRepository) {
        this.vednorRepository = vednorRepository;
    }
    async execute(vendorId, is_verified) {
        try {
            const result = await this.vednorRepository.updateVendorVerification(vendorId, is_verified);
            return result;
        }
        catch (error) {
            throw {
                status: "error",
                message: "Failed to update vendor verification",
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }
}
exports.UpdateVendorUseCase = UpdateVendorUseCase;
