import express from "express";
import { getTotalTicketsInWeek } from "../controller/adminDashboardController.js";
import userAuth from "../middleware/userAuth.js";

const adminDashboardRouter = express.Router();
adminDashboardRouter.get("/totaltickets", userAuth, getTotalTicketsInWeek);

export default adminDashboardRouter;
