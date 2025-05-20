import express from "express";
import { getAgentTickets, getFirstRespTime, getFullResolveTime, getRatingMetrics, getReceivedResolvedBar, getTicketbyEmergency, getTicketbyStatus, getTotalParticipants, getTotalTicketsInWeek } from "../controller/adminDashboardController.js";
import userAuth from "../middleware/userAuth.js";

const adminDashboardRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: AdminDashboard
 *   description: Admin dashboard metrics-related APIs
 */

/**
 * @swagger
 * /api/admindashboard/totaltickets:
 *   get:
 *     summary: Get total tickets in the past week
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Total tickets returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/totaltickets", userAuth, getTotalTicketsInWeek);

/**
 * @swagger
 * /api/admindashboard/totalparticipants:
 *   get:
 *     summary: Get total number of participants
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Total participants returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/totalparticipants", userAuth, getTotalParticipants);

/**
 * @swagger
 * /api/admindashboard/firstresponsetime:
 *   get:
 *     summary: Get average first response time
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: First response time returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/firstresponsetime", userAuth, getFirstRespTime);

/**
 * @swagger
 * /api/admindashboard/fullresolvetime:
 *   get:
 *     summary: Get average full ticket resolution time
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Full resolution time returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/fullresolvetime", userAuth, getFullResolveTime);

/**
 * @swagger
 * /api/admindashboard/receiveresolvebar:
 *   get:
 *     summary: Get received vs resolved tickets data for bar chart
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Chart data returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/receiveresolvebar", userAuth, getReceivedResolvedBar);

/**
 * @swagger
 * /api/admindashboard/ticketbyemergency:
 *   get:
 *     summary: Get ticket breakdown by emergency level
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Emergency level breakdown returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/ticketbyemergency", userAuth, getTicketbyEmergency);

/**
 * @swagger
 * /api/admindashboard/ticketbystatus:
 *   get:
 *     summary: Get ticket breakdown by status
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Status breakdown returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/ticketbystatus", userAuth, getTicketbyStatus);

/**
 * @swagger
 * /api/admindashboard/agenttickets:
 *   get:
 *     summary: Get number of tickets handled per agent
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Agent ticket data returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/agenttickets", userAuth, getAgentTickets);

/**
 * @swagger
 * /api/admindashboard/ratingmetrics:
 *   get:
 *     summary: Get average rating percentage metrics
 *     tags: [AdminDashboard]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/date'
 *       - $ref: '#/components/parameters/compTypeId'
 *     responses:
 *       200:
 *         description: Average rating returned
 *       400:
 *         description: Invalid compTypeId format
 *       500:
 *         description: Internal Server Error
 */
adminDashboardRouter.get("/ratingmetrics", userAuth, getRatingMetrics);

export default adminDashboardRouter;
