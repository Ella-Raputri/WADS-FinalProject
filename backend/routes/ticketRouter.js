import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { fetchTicketRating, getAllTickets, getAllTicketsByCompetitionType, getUpdatedAtByTicketId, updateRateTicket, updateTicketStatus, uploadNewTicket } from '../controller/ticketController.js';

const ticketRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: Ticket related APIs
 */

/**
 * @swagger
 * /api/ticket/uploadNewTicket:
 *   post:
 *     summary: Upload a new support ticket
 *     tags: [Ticket]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - newTicketDetails
 *             properties:
 *               userId:
 *                 type: string
 *               newTicketDetails:
 *                 type: object
 *                 required:
 *                   - subject
 *                   - description
 *                   - compTypeId
 *                 properties:
 *                   subject:
 *                     type: string
 *                   description:
 *                     type: string
 *                   priorityType:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   compTypeId:
 *                     type: string
 *     responses:
 *       200:
 *         description: Ticket created successfully
 *       500:
 *         description: Server error
 */
ticketRouter.post('/uploadNewTicket',userAuth, uploadNewTicket);

/**
 * @swagger
 * /api/ticket/getAllTickets:
 *   get:
 *     summary: Get all tickets for the authenticated user
 *     tags: [Ticket]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user tickets
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getAllTickets',userAuth, getAllTickets);

/**
 * @swagger
 * /api/ticket/getTicketByCompId:
 *   get:
 *     summary: Get all tickets by competition type
 *     tags: [Ticket]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: compId
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition type ID
 *     responses:
 *       200:
 *         description: List of tickets for a competition type
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getTicketByCompId', userAuth, getAllTicketsByCompetitionType);

/**
 * @swagger
 * /api/ticket/updateTicketStatus:
 *   put:
 *     summary: Update ticket status
 *     tags: [Ticket]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - request
 *             properties:
 *               request:
 *                 type: object
 *                 required:
 *                   - ticketId
 *                   - status
 *                 properties:
 *                   ticketId:
 *                     type: string
 *                   status:
 *                     type: string
 *     responses:
 *       200:
 *         description: Ticket status updated
 *       500:
 *         description: Server error
 */
ticketRouter.put('/updateTicketStatus', userAuth, updateTicketStatus);

/**
 * @swagger
 * /api/ticket/getUpdatedAtByTicketId:
 *   get:
 *     summary: Get the latest updatedAt timestamp of a ticket
 *     tags: [Ticket]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Latest update timestamp
 *       400:
 *         description: Invalid ticketId
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getUpdatedAtByTicketId', userAuth, getUpdatedAtByTicketId);

/**
 * @swagger
 * /api/ticket/rateTicket:
 *   post:
 *     summary: Rate a ticket's resolution
 *     tags: [Ticket]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - ticketId
 *               - adminId
 *               - rating
 *             properties:
 *               userId:
 *                 type: string
 *               ticketId:
 *                 type: string
 *               adminId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating submitted
 *       500:
 *         description: Server error
 */
ticketRouter.post('/rateTicket', userAuth, updateRateTicket);

/**
 * @swagger
 * /api/ticket/getRatingTicket:
 *   get:
 *     summary: Get rating for a specific ticket
 *     tags: [Ticket]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating fetched successfully
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getRatingTicket', userAuth, fetchTicketRating);

export default ticketRouter