// src/presentation/routes/adminRoute.ts

import { Router } from "express";
import { AdminController } from "../controllers/admin/AdminController";
import { AdminUserController } from "../controllers/admin/AdminUserController";
import { adminAuthMiddleware } from '../../infrastructure/middleware/Adminmiddleware';

const router = Router();
const adminController = new AdminController();
const adminUserController = new AdminUserController();


router.post('/Login', adminController.login);
router.post('/refreshtoken', adminController.refreshToken);


router.get('/fetchUser',adminAuthMiddleware,adminUserController.fetchUser);
router.put('/editUser',adminAuthMiddleware, adminUserController.editUser);
router.get('/fetchVendor', adminAuthMiddleware,adminUserController.fetchVendor);
router.put('/editVendor', adminAuthMiddleware,adminUserController.editVendor);
router.put('/updateVendor', adminAuthMiddleware,adminUserController.updateVendor);

export default router;