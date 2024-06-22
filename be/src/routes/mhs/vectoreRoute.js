import express from 'express';
const router = express.Router();
import { vectorizePdf } from '../../controllers/mhs/VectoreController.js';
import { handleChatMessage,addChatMessage,getChatMessages,deleteChatMessages } from '../../controllers/mhs/chatBotController.js';

router.post('/vectorize-pdf', vectorizePdf);
router.post('/chatBot', handleChatMessage);
router.get('/chatBotStream', handleChatMessage);
router.post('/chatBot/add', addChatMessage);
router.delete('/chatBot/delete/:idMahasiswa', deleteChatMessages);
router.get('/chatBot/:idMahasiswa', getChatMessages);


export default router;