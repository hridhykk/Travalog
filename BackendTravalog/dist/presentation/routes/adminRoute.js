"use strict";
// src/presentation/routes/adminRoute.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/admin/AdminController");
const AdminUserController_1 = require("../controllers/admin/AdminUserController");
const Adminmiddleware_1 = require("../../infrastructure/middleware/Adminmiddleware");
const router = (0, express_1.Router)();
const adminController = new AdminController_1.AdminController();
const adminUserController = new AdminUserController_1.AdminUserController();
router.post('/Login', adminController.login);
router.post('/refreshtoken', adminController.refreshToken);
router.get('/fetchUser', Adminmiddleware_1.adminAuthMiddleware, adminUserController.fetchUser);
router.put('/editUser', Adminmiddleware_1.adminAuthMiddleware, adminUserController.editUser);
router.get('/fetchVendor', Adminmiddleware_1.adminAuthMiddleware, adminUserController.fetchVendor);
router.put('/editVendor', Adminmiddleware_1.adminAuthMiddleware, adminUserController.editVendor);
router.put('/updateVendor', Adminmiddleware_1.adminAuthMiddleware, adminUserController.updateVendor);
exports.default = router;
