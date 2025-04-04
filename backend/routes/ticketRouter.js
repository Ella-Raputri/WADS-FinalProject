import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllTickets, uploadNewTicket } from '../controller/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/uploadNewTicket',userAuth, uploadNewTicket);
ticketRouter.get('/getAllTickets',userAuth, getAllTickets);


export default ticketRouter