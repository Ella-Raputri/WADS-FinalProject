import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getCompetitionIdByName } from '../controller/competitionController.js';

const compRouter = express.Router();

compRouter.get('/getCompetitionIdByName', getCompetitionIdByName);



export default compRouter