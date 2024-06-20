import express from 'express';
const router = express.Router();
import { vectorizePdf } from '../../controllers/mhs/VectoreController.js';
import { handleChatMessage } from '../../controllers/mhs/chatBotController.js';

router.post('/vectorize-pdf', vectorizePdf);
router.post('/chatBot', handleChatMessage);
router.get('/chatBotStream', handleChatMessage);

export default router;