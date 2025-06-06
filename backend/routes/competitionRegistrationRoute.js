import express from 'express';
import { createCompetitionRegistration, deleteCompetitionRegistration, editCompetitionRegistration, getCompetitionRegistrations, getRegisteredCompetitions, getUpcomingCompetitions, getUserRegistrationById} from '../controller/competitionRegistrationController.js';
import userAuth from '../middleware/userAuth.js'

const competitionRegistrationRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: CompetitionRegistration
 *   description: Competition registration-related APIs
 */

/**
 * @swagger
 * /api/competitionRegistration/getUpcomingCompetitions:
 *   get:
 *     summary: Get all upcoming competitions
 *     tags: [CompetitionRegistration]
 *     responses:
 *       200:
 *         description: List of upcoming competitions
 *       500:
 *         description: Internal Server Error
 */
competitionRegistrationRouter.get("/getUpcomingCompetitions", getUpcomingCompetitions)

/**
 * @swagger
 * /api/competitionRegistration/getUserRegistrationById/{UserId}/{CompetitionId}:
 *   get:
 *     summary: Get a user's registration info by UserId and CompetitionId
 *     tags: [CompetitionRegistration]
 *     parameters:
 *       - in: path
 *         name: UserId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: CompetitionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition Type ID
 *     responses:
 *       200:
 *         description: User's registration info
 *       500:
 *         description: Internal Server Error
 */
competitionRegistrationRouter.get("/getUserRegistrationById/:UserId/:CompetitionId", getUserRegistrationById)

/**
 * @swagger
 * /api/competitionRegistration/userRegistrations/{UserId}:
 *   get:
 *     summary: Get all competitions registered by a user
 *     tags: [CompetitionRegistration]
 *     parameters:
 *       - in: path
 *         name: UserId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's registered competitions
 *       500:
 *         description: Internal Server Error
 */
competitionRegistrationRouter.get("/userRegistrations", userAuth, getRegisteredCompetitions);

/**
 * @swagger
 * /api/competitionRegistration/registerCompetition:
 *   post:
 *     summary: Register for a competition
 *     tags: [CompetitionRegistration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - UserId
 *               - CompetitionId
 *             properties:
 *               UserId:
 *                 type: string
 *               CompetitionId:
 *                 type: string
 *               PaymentProofUrl:
 *                 type: string
 *               TwibbonProofUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *       500:
 *         description: Internal Server Error
 */
competitionRegistrationRouter.post("/registerCompetition", createCompetitionRegistration);

/**
 * @swagger
 * /api/competitionRegistration/{registrationId}:
 *   delete:
 *     summary: Delete a competition registration
 *     tags: [CompetitionRegistration]
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Registration deleted successfully
 *       500:
 *         description: Internal Server Error
 */
competitionRegistrationRouter.delete("/:registrationId", deleteCompetitionRegistration);

/**
 * @swagger
 * /api/competitionRegistration/{registrationId}:
 *   put:
 *     summary: Update registration status and admin comment
 *     tags: [CompetitionRegistration]
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               adminComment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration updated successfully
 *       500:
 *         description: Internal Server Error
 */
competitionRegistrationRouter.put("/:registrationId", editCompetitionRegistration);

/**
 * @swagger
 * /api/competitionRegistration/{compTypeId}:
 *   get:
 *     summary: Get all competition registrations by competition type ID
 *     tags: [CompetitionRegistration]
 *     parameters:
 *       - in: path
 *         name: compTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the competition type
 *     responses:
 *       200:
 *         description: Successfully retrieved competition registrations
 *       500:
 *         description: Internal Server Error
 */
competitionRegistrationRouter.get("/:compTypeId", getCompetitionRegistrations);

export default competitionRegistrationRouter;   