"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTokenCookies = exports.verifyRefreshToken = exports.verifyToken = exports.refreshToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, index_1.config.jwt.secret, {
        expiresIn: index_1.config.jwt.expiresIn
    });
};
exports.generateToken = generateToken;
const refreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, index_1.config.jwt.Refreshsecret, {
        expiresIn: '7d'
    });
};
exports.refreshToken = refreshToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, index_1.config.jwt.secret);
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, index_1.config.jwt.Refreshsecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
const setTokenCookies = (res, accessToken, refreshToken, userType = 'user') => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };
    res.cookie(`${userType}jwt`, accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
    });
    res.cookie(`${userType}RefreshToken`, refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.setTokenCookies = setTokenCookies;
