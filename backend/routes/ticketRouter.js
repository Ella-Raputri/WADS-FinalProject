import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllTickets, getAllTicketsByCompetitionType, getUpdatedAtByTicketId, updateTicketStatus, uploadNewTicket } from '../controller/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/uploadNewTicket',userAuth, uploadNewTicket);
ticketRouter.get('/getAllTickets',userAuth, getAllTickets);
ticketRouter.get('/getTicketByCompId', userAuth, getAllTicketsByCompetitionType);
ticketRouter.put('/updateTicketStatus', userAuth, updateTicketStatus);
ticketRouter.get('/getUpdatedAtByTicketId', userAuth, getUpdatedAtByTicketId);

export default ticketRouter