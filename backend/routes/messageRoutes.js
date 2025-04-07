import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllCollabAdminMessage, getAllParticipantAdminMessage, sendCollabAdminMessage, sendParticipantAdminMessage, sendParticipantSystemMessage } from '../controller/messageController.js';

const messageRouter = express.Router();

messageRouter.get('/getParticipantAdminMessage',userAuth, getAllParticipantAdminMessage);
messageRouter.post('/sendParticipantAdminMessage',userAuth, sendParticipantAdminMessage);
messageRouter.post('/sendParticipantSystemMessage', userAuth, sendParticipantSystemMessage);
messageRouter.get('/getAdminCollabMessage',userAuth, getAllCollabAdminMessage);
messageRouter.post('/sendAdminCollabMessage',userAuth, sendCollabAdminMessage);

export default messageRouter