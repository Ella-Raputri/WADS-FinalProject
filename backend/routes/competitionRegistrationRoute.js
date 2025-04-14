import express from 'express';
import { createCompetitionRegistration, deleteCompetitionRegistration, editCompetitionRegistration, getRegisteredCompetitions, getUpcomingCompetitions, getUserRegistrationById} from '../controller/competitionRegistrationController.js';

const competitionRegistrationRouter = express.Router();
competitionRegistrationRouter.get("/getUpcomingCompetitions", getUpcomingCompetitions)
competitionRegistrationRouter.get("/getAll", getRegisteredCompetitions)
competitionRegistrationRouter.get("/getUserRegistrationById/:UserId/:CompetitionId", getUserRegistrationById)
competitionRegistrationRouter.get("/userRegistrations/:UserId", getRegisteredCompetitions);
competitionRegistrationRouter.post("/", createCompetitionRegistration);
competitionRegistrationRouter.delete("/:registrationId", deleteCompetitionRegistration);
competitionRegistrationRouter.put("/:registrationId", editCompetitionRegistration);

export default competitionRegistrationRouter;   