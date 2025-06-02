import express from 'express';
import { handleGoogleCallback, isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail, verifyOtpReset } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';
import passport from 'passport';

const authRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication-related APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new participant account
 *     description: Registers a participant with full profile details and returns a JWT token cookie on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                   mandarinName:
 *                     type: string
 *                   dob:
 *                     type: string
 *                     format: date
 *                   gender:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   institution:
 *                     type: string
 *                   password:
 *                     type: string
 *                   studentPhotoUrl:
 *                     type: string
 *                     format: uri
 *     responses:
 *       200:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *                 user:
 *                   type: object
 *                   description: The newly registered user object
 *       400:
 *         description: Validation failed or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
authRouter.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Log in a user
 *     description: Authenticates a user using email and password. Returns a JWT token in a cookie if successful.
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
 *                 example: example@email.com
 *               password:
 *                 type: string
 *                 example: yourPassword123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 userData:
 *                   type: object
 *                   description: Logged-in user information
 *       400:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
authRouter.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and clear authentication cookie
 *     tags: [Authentication]
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
 *     tags:
 *       - Authentication
 *     summary: Send OTP to user email for account verification
 *     description: Sends a 6-digit OTP to the user's email if the account is not yet verified.
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification OTP has been sent
 *       400:
 *         description: Missing email or account already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Account already verified
 *       500:
 *         description: Server error while sending OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
authRouter.post('/send-verify-otp', sendVerifyOtp);

/**
 * @swagger
 * /api/auth/verify-account:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify user email with OTP
 *     description: Verifies the user account using a 6-digit OTP previously sent to their email.
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
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified or invalid OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email Verified Successfully
 *                 userData:
 *                   type: object
 *       400:
 *         description: Missing fields, user not found, or OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Expired OTP
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
authRouter.post('/verify-account', verifyEmail);

/**
 * @swagger
 * /api/auth/is-auth:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Authentication]
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
 *     tags:
 *       - Authentication
 *     summary: Send OTP for password reset
 *     description: Sends a 6-digit OTP to the user's email to initiate password reset.
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
 *         description: Reset OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reset OTP has been sent
 *       400:
 *         description: Missing or invalid email, or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
authRouter.post('/send-reset-otp', sendResetOtp);

/**
 * @swagger
 * /api/auth/verify-otp-reset:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify OTP for password reset
 *     description: Verifies the OTP sent to the user's email for resetting the password.
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
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully or is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 example:
 *                   success: true
 *                   message: OTP is valid
 *       400:
 *         description: Missing details, user not found, or OTP expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Expired OTP
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
authRouter.post('/verify-otp-reset', verifyOtpReset);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset user password
 *     description: Allows a user to reset their password after OTP verification.
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
 *                 example: NewPass123
 *     responses:
 *       200:
 *         description: Password has been reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password has been reset successfully
 *       400:
 *         description: Missing fields, user not found, or invalid password format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Password must have at least 8 characters with at least one letter and one number
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
authRouter.post('/reset-password', resetPassword);


/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiates Google OAuth2 login
 *     tags:
 *       - Authentication
 *     description: Redirects the user to Google for authentication using OAuth2.
 *     responses:
 *       302:
 *         description: Redirect to Google's OAuth consent screen.
 */
authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

const url = (process.env.NODE_ENV === 'development')? process.env.CLIENT_DEVELOPMENT_URL : process.env.CLIENT_PRODUCTION_URL;

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth2 callback
 *     tags:
 *       - Authentication
 *     description: Handles Google OAuth2 callback. On success, issues a JWT token and redirects to frontend.
 *     responses:
 *       302:
 *         description: Redirects to frontend with cookie token if successful.
 *       401:
 *         description: Unauthorized - no user data returned from Google.
 */
// Google OAuth callback
authRouter.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${url}/notfound`}),
    handleGoogleCallback
);


export default authRouter