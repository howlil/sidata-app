import express from 'express';
const router = express.Router();
import { vectorizePdf } from '../../controllers/mhs/VectoreController.js';
// import { handleChatbot } from '../../controllers/mhs/chatBotController.js';

router.post('/vectorize-pdf', vectorizePdf);
// router.post('/chatBot', handleChatbot);

export default router;