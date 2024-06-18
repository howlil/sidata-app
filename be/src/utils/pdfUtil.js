// const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
// const axios = require('axios');
// const { Blob } = require('buffer');

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import axios from 'axios'
import { Blob } from "buffer";


const fetchPdfText = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const loader = new PDFLoader(blob);
    const docs = await loader.load();
    const text = docs.map(doc => doc.pageContent).join('\n\n');  
    return text
}


export default fetchPdfText