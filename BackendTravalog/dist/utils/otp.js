"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
const randomstring_1 = __importDefault(require("randomstring"));
function generateOTP(length = 6) {
    return randomstring_1.default.generate({
        length,
        charset: 'numeric',
    });
}
