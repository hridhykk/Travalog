"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = sendOTP;
const nodemailer_1 = __importDefault(require("nodemailer"));
const index_1 = require("../config/index");
let transporter;
async function setupMailer() {
    transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: index_1.config.email.user,
            pass: index_1.config.email.password,
        },
    });
}
async function sendOTP(email, otp) {
    console.log('sendotp working now');
    if (!transporter) {
        await setupMailer();
    }
    const mailOptions = {
        from: index_1.config.email.user,
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
}
