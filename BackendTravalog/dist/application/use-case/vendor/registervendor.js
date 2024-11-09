"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUseCase = void 0;
const passwordutils_1 = require("../../../utils/passwordutils");
class RegisterUseCase {
    constructor(vendorRepository) {
        this.vendorRepository = vendorRepository;
    }
    async execute(name, email, mobile, password) {
        //const validation = userSchema.parse({name,email,mobile,password})
        const existingUser = await this.vendorRepository.FindByEmail(email);
        if (existingUser) {
            return {
                status: 'false', message: "user already exists."
            };
        }
        const hasedpassword = await (0, passwordutils_1.hashPassword)(password);
        const user = await this.vendorRepository.create({ name, email, password: hasedpassword, mobile });
        if (user) {
            return {
                status: 'success', message: "user Register successfully,Login Now"
            };
        }
    }
}
exports.RegisterUseCase = RegisterUseCase;
