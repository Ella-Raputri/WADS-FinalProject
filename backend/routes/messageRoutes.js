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
 *     tags: [Message]
 *     summary: Get all messages between participant and admin
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID associated with the conversation
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 adminUserChat:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid Ticket ID
 *       500:
 *         description: Internal server error
 */
messageRouter.get('/getParticipantAdminMessage',userAuth, getAllParticipantAdminMessage);

/**
 * @swagger
 * /api/message/sendParticipantAdminMessage:
 *   post:
 *     tags: [Message]
 *     summary: Participant sends a message to admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, request]
 *             properties:
 *               userId:
 *                 type: string
 *               request:
 *                 type: object
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
 *         description: Message created successfully
 *       400:
 *         description: Missing subject or message
 *       500:
 *         description: Server error
 */
messageRouter.post('/sendParticipantAdminMessage',userAuth, sendParticipantAdminMessage);

/**
 * @swagger
 * /api/message/sendParticipantSystemMessage:
 *   post:
 *     tags: [Message]
 *     summary: System sends message to participant
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
 *                   compTypeId:
 *                     type: string
 *                   subject:
 *                     type: string
 *                   message:
 *                     type: string
 *     responses:
 *       200:
 *         description: Message created successfully
 *       500:
 *         description: Server error
 */
messageRouter.post('/sendParticipantSystemMessage', userAuth, sendParticipantSystemMessage);

/**
 * @swagger
 * /api/message/getAdminCollabMessage:
 *   get:
 *     tags: [Message]
 *     summary: Get all messages between admin and collaborator
 *     parameters:
 *       - in: query
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket ID associated with the conversation
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       500:
 *         description: Internal server error
 */
messageRouter.get('/getAdminCollabMessage',userAuth, getAllCollabAdminMessage);

/**
 * @swagger
 * /api/message/sendAdminCollabMessage:
 *   post:
 *     tags: [Message]
 *     summary: Admin sends a message to collaborator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, request]
 *             properties:
 *               userId:
 *                 type: string
 *               request:
 *                 type: object
 *                 properties:
 *                   ticketId:
 *                     type: string
 *                   message:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 *     responses:
 *       200:
 *         description: Message created successfully
 *       400:
 *         description: Missing message content
 *       500:
 *         description: Server error
 */
messageRouter.post('/sendAdminCollabMessage',userAuth, sendCollabAdminMessage);

/**
 * @swagger
 * /api/message/sendChatbotMessage:
 *   post:
 *     tags: [Message]
 *     summary: Send a message to chatbot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               message:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message saved
 *       400:
 *         description: Missing message field
 *       201:
 *         description: Message not saved due to missing userId
 *       500:
 *         description: Server error
 */
messageRouter.post('/sendChatbotMessage', sendChatbotMessage);

/**
 * @swagger
 * /api/message/fetchChatbotMessage:
 *   get:
 *     tags: [Message]
 *     summary: Fetch all messages sent to chatbot by user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Chatbot messages retrieved successfully
 *       500:
 *         description: Server error
 */
messageRouter.get('/fetchChatbotMessage', getAllChatbotMessage);

/**
 * @swagger
 * /api/message/generateChatbotResponse:
 *   post:
 *     tags: [Message]
 *     summary: Generate response from chatbot (via RAG or Gemini)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastMsg:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chatbot response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 sources:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Failed to generate chatbot content
 */
messageRouter.post('/generateChatbotResponse', generateBotRes);

export default messageRouter