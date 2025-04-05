import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, getUserDataFromId } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
userRouter.get('/fetchUserDetails', userAuth, getUserDataFromId);

export default userRouter;