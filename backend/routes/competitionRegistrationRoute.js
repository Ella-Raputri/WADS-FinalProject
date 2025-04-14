import express from 'express';
import { createCompetitionRegistration, deleteCompetitionRegistration, editCompetitionRegistration, getCompetitionRegistrations, getUpcomingCompetitions, getUserRegistrationById, getUserRegistrations } from '../controller/competitionRegistrationController.js';

const competitionRegistrationRouter = express.Router();
competitionRegistrationRouter.get("/getUpcomingCompetitions", getUpcomingCompetitions)
competitionRegistrationRouter.get("/getAll", getCompetitionRegistrations)
competitionRegistrationRouter.get("/getUserRegistrationById/:UserId/:CompetitionId", getUserRegistrationById)
competitionRegistrationRouter.get("/userRegistrations/:UserId", getUserRegistrations);
competitionRegistrationRouter.post("/", createCompetitionRegistration);
competitionRegistrationRouter.delete("/:registrationId", deleteCompetitionRegistration);
competitionRegistrationRouter.put("/:registrationId", editCompetitionRegistration);

export default competitionRegistrationRouter;   