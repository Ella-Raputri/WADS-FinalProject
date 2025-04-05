import express from 'express';
import { createCompetitionRegistration, deleteCompetitionRegistration, getCompetitionRegistrations } from '../controller/competitionRegistrationController.js';

const competitionRegistrationRouter = express.Router();
competitionRegistrationRouter.get("/", getCompetitionRegistrations);
competitionRegistrationRouter.post("/:userId/:competitionId", createCompetitionRegistration);
competitionRegistrationRouter.delete("/:registrationId", deleteCompetitionRegistration);

export default competitionRegistrationRouter;