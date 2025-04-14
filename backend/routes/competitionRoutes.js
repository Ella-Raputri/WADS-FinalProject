import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getCompetitionDetails, getCompetitionIdByName } from '../controller/competitionController.js';

const compRouter = express.Router();

compRouter.get('/getCompetitionIdByName', getCompetitionIdByName);
compRouter.get('/getCompetitionDetails', getCompetitionDetails);

export default compRouter