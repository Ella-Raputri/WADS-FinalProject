import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { editUserDetails, getUserData, getUserDataFromId } from '../controller/userController.js';

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
 *     tags: [User]
 *     summary: Get logged-in user's data
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 userData:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     participant:
 *                       type: object
 *                       properties:
 *                         mandarinName:
 *                           type: string
 *                         dob:
 *                           type: string
 *                         gender:
 *                           type: string
 *                         address:
 *                           type: string
 *                         institution:
 *                           type: string
 *                         studentCardPhotoUrl:
 *                           type: string
 *                     admin:
 *                       type: object
 *                       properties:
 *                         compType:
 *                           type: string
 *                     isAccountVerified:
 *                       type: boolean
 *                     id:
 *                       type: string
 *       500:
 *         description: Server error
 */
userRouter.get('/data', userAuth, getUserData);

/**
 * @swagger
 * /api/user/fetchUserDetails:
 *   get:
 *     tags: [User]
 *     summary: Get user data by user ID
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 userData:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     participant:
 *                       type: object
 *                       properties:
 *                         mandarinName:
 *                           type: string
 *                         dob:
 *                           type: string
 *                         gender:
 *                           type: string
 *                         address:
 *                           type: string
 *                         institution:
 *                           type: string
 *                         studentCardPhotoUrl:
 *                           type: string
 *                     admin:
 *                       type: object
 *                       properties:
 *                         compType:
 *                           type: string
 *                     isAccountVerified:
 *                       type: boolean
 *                     id:
 *                       type: string
 *       500:
 *         description: Server error
 */
userRouter.get('/fetchUserDetails', userAuth, getUserDataFromId);

/**
 * @swagger
 * /api/user/editUserDetails:
 *   put:
 *     tags: [User]
 *     summary: Edit user details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, participantDetails]
 *             properties:
 *               userId:
 *                 type: string
 *               participantDetails:
 *                 type: object
 *                 required: [fullName, mandarinName, dob, gender, address, phone, institution, studentPhotoUrl]
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   mandarinName:
 *                     type: string
 *                   dob:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   institution:
 *                     type: string
 *                   studentPhotoUrl:
 *                     type: string
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Missing required fields or invalid input
 *       500:
 *         description: Server error
 */
userRouter.put('/editUserDetails', userAuth, editUserDetails);

export default userRouter;