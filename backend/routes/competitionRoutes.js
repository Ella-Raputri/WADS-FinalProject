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
 * /getCompetitionIdByName:
 *   get:
 *     tags:
 *       - Competition
 *     summary: Get competition ID by name
 *     description: Returns the ID of a competition given its name.
 *     parameters:
 *       - in: query
 *         name: compName
 *         required: true
 *         schema:
 *           type: string
 *         example: Math Olympiad
 *         description: Name of the competition
 *     responses:
 *       200:
 *         description: Competition ID retrieved successfully
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
 *         description: Internal server error
 */
compRouter.get('/getCompetitionIdByName', getCompetitionIdByName);

/**
 * @swagger
 * /getCompetitionDetails:
 *   get:
 *     tags:
 *       - Competition
 *     summary: Get competition details by ID
 *     description: Returns the full details of a competition given its ID.
 *     parameters:
 *       - in: query
 *         name: compId
 *         required: true
 *         schema:
 *           type: string
 *         example: 661c7ef2687b4bb0b4967e2d
 *         description: ID of the competition
 *     responses:
 *       200:
 *         description: Competition details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comp:
 *                   $ref: '#/components/schemas/Competition'
 *       500:
 *         description: Internal server error
 */
compRouter.get('/getCompetitionDetails', getCompetitionDetails);

/**
 * @swagger
 * /getAllCompetitions:
 *   get:
 *     tags:
 *       - Competition
 *     summary: Get all competitions
 *     description: Returns a list of all competition types available.
 *     responses:
 *       200:
 *         description: Competitions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Competition'
 *       500:
 *         description: Internal server error
 */
compRouter.get('/getAllCompetitions', getAllCompetitions);

export default compRouter