"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRepository = void 0;
const vendorModel_1 = require("../models/vendorModel");
class VendorRepository {
    async FindByEmail(email) {
        return vendorModel_1.VendorModel.findOne({ email });
    }
    async create(user) {
        return vendorModel_1.VendorModel.create(user);
    }
    async findAllVendors() {
        return vendorModel_1.VendorModel.find().lean();
    }
    async updateVendor(vendorId, userData) {
        try {
            const updatedUser = await vendorModel_1.VendorModel.findOneAndUpdate({ _id: vendorId }, {
                $set: {
                    name: userData.name,
                    is_blocked: userData.is_blocked
                }
            }, {
                new: true,
                runValidators: true
            });
            if (!updatedUser) {
                throw new Error("User not found");
            }
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    }
    async updateVendorVerification(vendorId, is_Verified) {
        try {
            const updatedVendor = await vendorModel_1.VendorModel.findOneAndUpdate({ _id: vendorId }, {
                $set: {
                    is_Verified: is_Verified
                }
            }, {
                new: true,
                runValidators: true
            });
            if (!updatedVendor) {
                return {
                    status: "error",
                    message: "Vendor not found"
                };
            }
            return {
                status: "success",
                message: "Vendor verification updated successfully",
                vendor: updatedVendor
            };
        }
        catch (error) {
            return {
                status: "error",
                message: error instanceof Error ? error.message : "An unexpected error occurred"
            };
        }
    }
    async updatePasswordByEmail(email, newPassword) {
        try {
            const updatedUser = await vendorModel_1.VendorModel.findOneAndUpdate({ email }, {
                $set: {
                    password: newPassword
                }
            }, {
                new: true,
                runValidators: true
            });
            if (!updatedUser) {
                throw new Error("User not found");
            }
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.VendorRepository = VendorRepository;
