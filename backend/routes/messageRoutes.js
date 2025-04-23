import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { generateBotRes, getAllChatbotMessage, getAllCollabAdminMessage, getAllParticipantAdminMessage, sendChatbotMessage, sendCollabAdminMessage, sendParticipantAdminMessage, sendParticipantSystemMessage } from '../controller/messageController.js';

const messageRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message related APIs
 */

/**
 * @swagger
 * /api/message/getParticipantAdminMessage:
 *   get:
 *     summary: Get messages between a participant and admin by ticketId
 *     tags: [Message]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID to fetch related messages
 *     responses:
 *       200:
 *         description: List of messages
 *       400:
 *         description: Invalid Ticket ID
 *       500:
 *         description: Server error
 */
messageRouter.get('/getParticipantAdminMessage',userAuth, getAllParticipantAdminMessage);

/**
 * @swagger
 * /api/message/sendParticipantAdminMessage:
 *   post:
 *     summary: Send a message from a participant to admin
 *     tags: [Message]
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
 *               - request
 *             properties:
 *               userId:
 *                 type: string
 *               request:
 *                 type: object
 *                 required:
 *                   - ticketId
 *                   - compTypeId
 *                   - subject
 *                   - message
 *                 properties:
 *                   ticketId:
 *                     type: string
 *                   compTypeId:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   message:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 */
messageRouter.post('/sendParticipantAdminMessage',userAuth, sendParticipantAdminMessage);

/**
 * @swagger
 * /api/message/sendParticipantSystemMessage:
 *   post:
 *     summary: Send a system message to a participant
 *     tags: [Message]
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
 *                   - compTypeId
 *                   - subject
 *                   - message
 *                 properties:
 *                   ticketId:
 *                     type: string
 *                   compTypeId:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   message:
 *                     type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 */
messageRouter.post('/sendParticipantSystemMessage', userAuth, sendParticipantSystemMessage);

/**
 * @swagger
 * /api/message/getAdminCollabMessage:
 *   get:
 *     summary: Get collaboration messages for a ticket
 *     tags: [Message]
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
 *         description: List of collaboration messages
 *       500:
 *         description: Server error
 */
messageRouter.get('/getAdminCollabMessage',userAuth, getAllCollabAdminMessage);

/**
 * @swagger
 * /api/message/sendAdminCollabMessage:
 *   post:
 *     summary: Send a message from admin to another collaborator
 *     tags: [Message]
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
 *               - request
 *             properties:
 *               userId:
 *                 type: string
 *               request:
 *                 type: object
 *                 required:
 *                   - ticketId
 *                   - message
 *                 properties:
 *                   ticketId:
 *                     type: string
 *                   message:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 */
messageRouter.post('/sendAdminCollabMessage',userAuth, sendCollabAdminMessage);

messageRouter.post('/sendChatbotMessage', sendChatbotMessage);

messageRouter.get('/fetchChatbotMessage', getAllChatbotMessage);

messageRouter.post('/generateChatbotResponse', generateBotRes);

export default messageRouter