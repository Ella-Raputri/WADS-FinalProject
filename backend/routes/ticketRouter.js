import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllTickets, getAllTicketsByCompetitionType, getUpdatedAtByTicketId, updateRateTicket, updateTicketStatus, uploadNewTicket } from '../controller/ticketController.js';

const ticketRouter = express.Router();

ticketRouter.post('/uploadNewTicket',userAuth, uploadNewTicket);
ticketRouter.get('/getAllTickets',userAuth, getAllTickets);
ticketRouter.get('/getTicketByCompId', userAuth, getAllTicketsByCompetitionType);
ticketRouter.put('/updateTicketStatus', userAuth, updateTicketStatus);
ticketRouter.get('/getUpdatedAtByTicketId', userAuth, getUpdatedAtByTicketId);
ticketRouter.post('/rateTicket', userAuth, updateRateTicket);

export default ticketRouter