import express from 'express'
const adminRouter = express.Router()
import * as adminController from '../controller/adminController.js'
import { Adminprotect } from '../middleware/adminMiddleware.js';
adminRouter.post('/adminLogin',adminController.adminLogin);

adminRouter.get('/fetchData',Adminprotect,adminController.fetchData);

adminRouter.put('/editUser', Adminprotect,adminController.editUser);

adminRouter.post('/deleteUser',Adminprotect,adminController.deleteUser);
adminRouter.post('/logout', adminController.verifylogout);
export default adminRouter