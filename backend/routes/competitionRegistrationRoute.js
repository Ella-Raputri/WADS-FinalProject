import express from 'express';
import { createCompetitionRegistration, deleteCompetitionRegistration, editCompetitionRegistration, getCompetitionRegistrations } from '../controller/competitionRegistrationController.js';

const competitionRegistrationRouter = express.Router();
competitionRegistrationRouter.get("/", getCompetitionRegistrations);
competitionRegistrationRouter.post("/", createCompetitionRegistration);
competitionRegistrationRouter.delete("/:registrationId", deleteCompetitionRegistration);
competitionRegistrationRouter.put("/:registrationId", editCompetitionRegistration);

export default competitionRegistrationRouter;   
