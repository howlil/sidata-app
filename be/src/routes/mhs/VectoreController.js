import dotenv from 'dotenv';
dotenv.config();
import fetchPdfText  from '../../utils/pdfUtil.js';
import { v4 as uuidv4 } from 'uuid';
import {openai} from '../../config/openAi.js';
import { getPineconeClient } from '../../config/pinecone.js';

export const vectorizePdf = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL PDF diperlukan' });
        }

        const text = await fetchPdfText(url);
        const pages = text.split('\n\n'); 
        const newFileId = uuidv4();
        const pageLevelDocs = pages.map((page, index) => ({
            text: page,
            metadata: {
                fileId: newFileId,
                pageNumber: index + 1,
                text : page,
            },
        }));

        const pinecone = getPineconeClient();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

        const combinedData = pageLevelDocs.map((document, index) => {
            return {
                ...document,
                dataset: "pdf",
            };
        });
        console.log(combinedData);

        const embeddingRequests = combinedData.map(doc => openai.embeddings.create({
            model: "text-embedding-3-small",
            input: doc.text,
        }));

        const embeddingsResponses = await Promise.all(embeddingRequests);
        const embeddings = embeddingsResponses.map(response => response.data[0].embedding);

        const upserts = combinedData.map((document, index) => ({
            id: `${newFileId}-${index}`,
            values: embeddings[index],
            metadata: document.metadata,
        }));

        await pineconeIndex.upsert(upserts);

        res.status(200).json({ message: 'PDF berhasil diverktorisasi dan disimpan di Pinecone' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses PDF' });
    }
};