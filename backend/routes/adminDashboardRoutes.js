import express from "express";
import { getFirstRespTime, getFullResolveTime, getTotalParticipants, getTotalTicketsInWeek } from "../controller/adminDashboardController.js";
import userAuth from "../middleware/userAuth.js";

const adminDashboardRouter = express.Router();
adminDashboardRouter.get("/totaltickets", userAuth, getTotalTicketsInWeek);
adminDashboardRouter.get("/totalparticipants", userAuth, getTotalParticipants);
adminDashboardRouter.get("/firstresponsetime", userAuth, getFirstRespTime);
adminDashboardRouter.get("/fullresolvetime", userAuth, getFullResolveTime);

export default adminDashboardRouter;
