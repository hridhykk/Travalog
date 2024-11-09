import { Router } from "express";
import { VendorController } from "../controllers/vendor/VendorController";

const router = Router();
const vendorController = new VendorController();


router.post('/Login',vendorController.login)
router.post('/Register',vendorController.register)
router.post('/refreshtoken',vendorController.refreshToken)
export default router;