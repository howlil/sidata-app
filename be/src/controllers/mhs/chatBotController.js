import prisma from "../../config/db.js";
import {openai} from "../../config/openAi.js";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { getPineconeClient } from "../../config/pinecone.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

export const handleChatMessage = async (req, res) => {
  try {
    const { idMahasiswa, text, role } = req.body;

    if (!idMahasiswa || !text || !role) {
      return res.status(400).json({ error: "idMahasiswa, text, dan role diperlukan" });
    }

    const pinecone = getPineconeClient();
    const isUserMessage = role === "user";

    await prisma.message.create({
      data: {
        idMahasiswa,
        text,
        isUserMessage,
        timestamp: new Date(),
      },
    });

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      batchSize: 1536,
      modelName: "text-embedding-ada-002",
    });

    const vector = await embeddings.embedQuery(text);

    const index = pinecone.Index(process.env.PINECONE_INDEX);
    const queryResponse = await index.query({
      topK: 5,
      vector: vector,
      includeMetadata: true,
    });

    const contextText = queryResponse.matches
      .map(
        (match, index) =>
          `Halaman ${match.metadata.pageNumber}: ${match.metadata.text}`
      )
      .join("\n\n");
    const  completion  = await openai.chat.completions.create(
      {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: text },
        {
          role: "system",
          content: `
            sidata adalah asisten AI terbaru berbahasa Indonesia yang mirip manusia dengan fokus seputar pendaftaran tugas akhir mahasiswa.
            AI berkarakteristik pengetahuan mendalam, keakuratan tinggi jawaban, kecerdasan dalam analisis, dan mampu berkomunikasi yang jelas.
            AI bersikap ramah, sopan, serta menyediakan jawaban yang jelas untuk dipahami oleh user.
            AI berkekuatan akses besar ilmu pengetahuan dan mampu menjawab hampir setiap pertanyaan tentang berbagai topik dengan jawaban ekstrim akurat, relevan, dan komprehensif.
            AWAL BLOK KONTEKS
            ${contextText}
            AKHIR BLOK KONTEKS
            AI mempertimbangkan setiap BLOK KONTEKS yang diberikan dalam percakapan.
            Jika konteks tidak menyediakan jawaban untuk pertanyaan, AI akan menyatakan, "Maaf, bisakah Anda jelaskan pertanyaan lebih detail?".
            AI menjawab pertanyaan dengan ringkas dan kurang dari 200 karakter untuk efisiensi dan efektivitas dengan selalu menjawab secara lengkap.
            AI tidak akan meminta maaf atas jawaban sebelumnya, tetapi menunjukkan bahwa informasi baru telah diperoleh.
            AI tidak akan menciptakan informasi yang tidak secara langsung berasal dari konteks.
            AI akan menjawab pertanyaan dalam format Markdown yakni dengan judul dan daftar yang jelas.
          `,
        },

      ],
      temperature: 0.7,
      max_tokens: 3000,
      stream: true,
      
    },
    {responsType: "stream"}
  );
    let fulltext=""
    for await (const chunk of completion) {
      let text =chunk.choices[0]?.delta?.content || "";
      fulltext+=text;
      console.clear()
      // console.log("Completion text:", fulltext);
    }
    
    // res.write(fulltext);
    const stream = OpenAIStream(completion, {
      
      onData: (chunk) => {
        console.log('chunk: ', chunk);
        
        // this converts the buffer to a string
        const payloads = chunk.toString().split('\n\n');

        console.log('payloads: ', payloads);

        for (const payload of payloads) {
          // if string includes '[DONE]'
          if (payload.includes('[DONE]')) {
            res.end(); // Close the connection and return
            return;
          }
          if (payload.startsWith('data:')) {
            // remove 'data: ' and parse the corresponding object
            const data = JSON.parse(payload.replace('data: ', ''));
            try {
              const text = data.choices[0].delta?.content;
              if (text) {
                console.log('text: ', text);
                // send value of text to the client
                res.write(`${text}`);
              }
            } catch (error) {
              console.log(`Error with JSON.parse and ${payload}.\n${error}`);
            }
          }
        }
      },
    });
    return stream;
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses pesan" });
  }
};
