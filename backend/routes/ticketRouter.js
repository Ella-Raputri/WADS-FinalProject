import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { uploadNewTicket } from '../controller/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/uploadNewTicket',userAuth, uploadNewTicket);



export default ticketRouter