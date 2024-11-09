// src/presentation/routes/adminRoute.ts

import { Router } from "express";
import { AdminController } from "../controllers/admin/AdminController";
import { AdminUserController } from "../controllers/admin/AdminUserController";
//import { adminAuthMiddleware } from '../../infrastructure/middleware/Adminmiddleware';

const router = Router();
const adminController = new AdminController();
const adminUserController = new AdminUserController();


router.post('/Login', adminController.login);
router.post('/refreshtoken', adminController.refreshToken);


router.get('/fetchUser', adminUserController.fetchUser);
router.put('/editUser', adminUserController.editUser);
router.get('/fetchVendor', adminUserController.fetchVendor);
router.put('/editVendor', adminUserController.editVendor);
router.put('/updateVendor', adminUserController.updateVendor);

export default router;