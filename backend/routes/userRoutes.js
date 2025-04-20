import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, getUserDataFromId } from '../controller/userController.js';

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-related APIs
 */

/**
 * @swagger
 * /api/user/data:
 *   get:
 *     summary: Get logged-in user data
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
userRouter.get('/data', userAuth, getUserData);

/**
 * @swagger
 * /api/user/fetchUserDetails:
 *   get:
 *     summary: Get user details by ID 
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user 
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
userRouter.get('/fetchUserDetails', userAuth, getUserDataFromId);

export default userRouter;