import express from "express";
import { getAgentTickets, getFirstRespTime, getFullResolveTime, getReceivedResolvedBar, getTicketbyEmergency, getTicketbyStatus, getTotalParticipants, getTotalTicketsInWeek } from "../controller/adminDashboardController.js";
import userAuth from "../middleware/userAuth.js";

const adminDashboardRouter = express.Router();
adminDashboardRouter.get("/totaltickets", userAuth, getTotalTicketsInWeek);
adminDashboardRouter.get("/totalparticipants", userAuth, getTotalParticipants);
adminDashboardRouter.get("/firstresponsetime", userAuth, getFirstRespTime);
adminDashboardRouter.get("/fullresolvetime", userAuth, getFullResolveTime);

adminDashboardRouter.get("/receiveresolvebar", userAuth, getReceivedResolvedBar);
adminDashboardRouter.get("/ticketbyemergency", userAuth, getTicketbyEmergency);
adminDashboardRouter.get("/ticketbystatus", userAuth, getTicketbyStatus);

adminDashboardRouter.get("/agenttickets", userAuth, getAgentTickets);

export default adminDashboardRouter;
