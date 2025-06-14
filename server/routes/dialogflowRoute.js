import express from 'express';
import {  handleChatbotQuery, handleWebhook } from '../controllers/dialogflowController.js';
import { verifyDialogflowRequest } from '../middlewares/dialogflowAuth.js';

const dialogFlowrouter = express.Router();

// Route xử lý webhook từ Dialogflow
dialogFlowrouter.post('/webhook', verifyDialogflowRequest,handleWebhook);

dialogFlowrouter.post('/chat', handleChatbotQuery);

export default dialogFlowrouter;