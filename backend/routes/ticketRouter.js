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
 *     tags: [Ticket]
 *     summary: Upload a new support ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, newTicketDetails]
 *             properties:
 *               userId:
 *                 type: string
 *               newTicketDetails:
 *                 type: object
 *                 required: [subject, description]
 *                 properties:
 *                   subject:
 *                     type: string
 *                   priorityType:
 *                     type: string
 *                   description:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *                   compTypeId:
 *                     type: string
 *     responses:
 *       200:
 *         description: Ticket created successfully
 *       400:
 *         description: Missing subject or description
 *       500:
 *         description: Server error
 */
ticketRouter.post('/uploadNewTicket',userAuth, uploadNewTicket);

/**
 * @swagger
 * /api/ticket/getAllTickets:
 *   get:
 *     tags: [Ticket]
 *     summary: Get all tickets for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getAllTickets',userAuth, getAllTickets);

/**
 * @swagger
 * /api/ticket/getTicketByCompId:
 *   get:
 *     tags: [Ticket]
 *     summary: Get all tickets by competition type
 *     parameters:
 *       - in: query
 *         name: compId
 *         required: true
 *         schema:
 *           type: string
 *         description: Competition type ID
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getTicketByCompId', userAuth, getAllTicketsByCompetitionType);

/**
 * @swagger
 * /api/ticket/updateTicketStatus:
 *   put:
 *     tags: [Ticket]
 *     summary: Update ticket status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [request]
 *             properties:
 *               request:
 *                 type: object
 *                 properties:
 *                   ticketId:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [Open, Closed, Resolved]
 *     responses:
 *       200:
 *         description: Ticket status updated successfully
 *       500:
 *         description: Server error
 */
ticketRouter.put('/updateTicketStatus', userAuth, updateTicketStatus);

/**
 * @swagger
 * /api/ticket/getUpdatedAtByTicketId:
 *   get:
 *     tags: [Ticket]
 *     summary: Get the last updated time of a ticket
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Latest update time returned
 *       400:
 *         description: Invalid or missing ticketId
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getUpdatedAtByTicketId', userAuth, getUpdatedAtByTicketId);

/**
 * @swagger
 * /api/ticket/rateTicket:
 *   post:
 *     tags: [Ticket]
 *     summary: Submit a rating for a ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, ticketId, adminId, rating]
 *             properties:
 *               userId:
 *                 type: string
 *               ticketId:
 *                 type: string
 *               adminId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *       400:
 *         description: Rating not provided
 *       500:
 *         description: Server error
 */
ticketRouter.post('/rateTicket', userAuth, updateRateTicket);

/**
 * @swagger
 * /api/ticket/getRatingTicket:
 *   get:
 *     tags: [Ticket]
 *     summary: Fetch rating for a specific ticket
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Rating fetched successfully
 *       500:
 *         description: Server error
 */
ticketRouter.get('/getRatingTicket', userAuth, fetchTicketRating);

export default ticketRouter