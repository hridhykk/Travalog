"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userModel_1 = require("../models/userModel");
class UserRepository {
    async FindByEmail(email) {
        return userModel_1.UserModel.findOne({ email });
    }
    async create(user) {
        return userModel_1.UserModel.create(user);
    }
    async findAllUsers() {
        return userModel_1.UserModel.find().lean(); // Using lean() for better performance
    }
    async updateUser(userId, userData) {
        try {
            const updatedUser = await userModel_1.UserModel.findOneAndUpdate({ _id: userId }, {
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
    async updatePasswordByEmail(email, newPassword) {
        try {
            const updatedUser = await userModel_1.UserModel.findOneAndUpdate({ email }, {
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
exports.UserRepository = UserRepository;
