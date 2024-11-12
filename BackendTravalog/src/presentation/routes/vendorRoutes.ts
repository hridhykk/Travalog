import { Router } from "express";
import { VendorController } from "../controllers/vendor/VendorController";
import { UserController } from "../controllers/user/UserController";

const router = Router();
const vendorController = new VendorController();


router.post('/Login',vendorController.login)
router.post('/Register',vendorController.register)
router.post('/refreshtoken',vendorController.refreshToken);
router.post('/verifyOtp',vendorController.verifyOtp);
router.post('/resendotp',vendorController.resendOtp);
router.post('/verifyemail',vendorController.verifyemail);
router.post('/resetpass_otpverify',vendorController.resetPassverifyOtp);
router.post('/resend_resetpass_Otp',vendorController.resendResetpassOtp);
router.post('/resetpassword',vendorController.resetPassword)
export default router;