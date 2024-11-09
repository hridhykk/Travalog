import express from 'express';
const userRouter = express.Router();
import * as userController from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../utils/multer.js';


userRouter.post('/register', userController.registerUser);
userRouter.post('/verifyLogin', userController.verifyLogin);



userRouter.put('/profileEdit', protect, userController.profileEdit);
userRouter.post('/addImage', protect, upload.single('file'), userController.addImage);
userRouter.post('/logout', userController.verifylogout);
export default userRouter;
