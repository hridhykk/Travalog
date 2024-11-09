import { Router } from "express";
import { UserController } from "../controllers/user/UserController";

const router = Router();
const userController = new UserController();


router.post('/verifyLogin',userController.login);
router.post('/Register',userController.register);
router.post('/verifyOtp',userController.verifyOtp);
router.post('/resendOtp',userController.resendOtp);

router.post('/GoogleRegister',userController.googleregister);
router.post('/GoogleLogin',userController.googlelogin);
router.post('/forgotpassword',userController.forgotpassword)
router.post('/resetPassverifyOtp',userController.resetPassverifyOtp);
router.post('/resetPassword',userController.resetPassword);
router.post('/refreshtoken',userController.refreshToken);
router.post('/resendResetpassOtp',userController.resendResetpassOtp);
export default router;