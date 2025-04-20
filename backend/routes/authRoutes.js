import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyOtpReset } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication-related APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new participant account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantDetails
 *             properties:
 *               participantDetails:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - mandarinName
 *                   - dob
 *                   - gender
 *                   - address
 *                   - phone
 *                   - email
 *                   - institution
 *                   - password
 *                   - studentPhotoUrl
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: John Doe
 *                   mandarinName:
 *                     type: string
 *                     example: 杜约翰
 *                   dob:
 *                     type: string
 *                     format: date
 *                     example: 2002-08-15
 *                   gender:
 *                     type: string
 *                     example: Male
 *                   address:
 *                     type: string
 *                     example: 123 Beijing Street, China
 *                   phone:
 *                     type: string
 *                     example: "+6213512345678"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: johndoe@example.com
 *                   institution:
 *                     type: string
 *                     example: Tsinghua University
 *                   password:
 *                     type: string
 *                     format: password
 *                     example: P@ssw0rd!
 *                   studentPhotoUrl:
 *                     type: string
 *                     example: https://example.com/photo.jpg
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Missing or invalid fields
 */
authRouter.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourPassword123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
authRouter.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and clear authentication cookie
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Internal Server Error
 */
authRouter.post('/logout', logout);

/**
 * @swagger
 * /api/auth/send-verify-otp:
 *   post:
 *     summary: Send verification OTP to user's email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       500:
 *         description: Internal Server Error
 */
authRouter.post('/send-verify-otp', sendVerifyOtp);

/**
 * @swagger
 * /api/auth/verify-account:
 *   post:
 *     summary: Verify user account using email and OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Account verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
authRouter.post('/verify-account', verifyEmail);

/**
 * @swagger
 * /api/auth/is-auth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Internal Server Error
 */
authRouter.get('/is-auth', userAuth, isAuthenticated);

/**
 * @swagger
 * /api/auth/send-reset-otp:
 *   post:
 *     summary: Send OTP to email for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 *       500:
 *         description: Internal Server Error
 */
authRouter.post('/send-reset-otp', sendResetOtp);

/**
 * @swagger
 * /api/auth/verify-otp-reset:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: 654321
 *     responses:
 *       200:
 *         description: OTP verified for password reset
 *       500:
 *         description: Internal Server Error
 */
authRouter.post('/verify-otp-reset', verifyOtpReset);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewSecurePassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       500:
 *         description: Internal Server Error
 */
authRouter.post('/reset-password', resetPassword);


export default authRouter