import express from 'express';
const router = express.Router();
import { generatePDF } from '../../controllers/admin/GenerateDoc.js';

router.get('/generatePdf/:idTA', generatePDF);

export default router;