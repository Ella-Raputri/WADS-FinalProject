import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllCompetitions, getCompetitionDetails, getCompetitionIdByName } from '../controller/competitionController.js';

const compRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Competition
 *   description: Competition related-APIs
 */

/**
 * @swagger
 * /api/competition/getCompetitionIdByName:
 *   get:
 *     summary: Get competition ID by name
 *     tags: [Competition]
 *     parameters:
 *       - in: query
 *         name: compName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the competition
 *     responses:
 *       200:
 *         description: Returns competition ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 id:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */
compRouter.get('/getCompetitionIdByName', getCompetitionIdByName);

/**
 * @swagger
 * /api/competition/getCompetitionDetails:
 *   get:
 *     summary: Get competition details by ID
 *     tags: [Competition]
 *     parameters:
 *       - in: query
 *         name: compId
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition ID
 *     responses:
 *       200:
 *         description: Returns competition details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comp:
 *                   type: object
 *                   description: Competition data from the database
 *       500:
 *         description: Internal Server Error
 */
compRouter.get('/getCompetitionDetails', getCompetitionDetails);

compRouter.get('/getAllCompetitions', getAllCompetitions);

export default compRouter