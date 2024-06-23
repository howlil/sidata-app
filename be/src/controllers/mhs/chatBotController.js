import prisma from "../../config/db.js";
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
      .map((match) => `Halaman ${match.metadata.pageNumber}: ${match.metadata.text}`)
      .join("\n\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'user', content: text },
          {
            role: 'system',
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
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result;
    let buffer = '';
    let fullText = '';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    while (!(result = await reader.read()).done) {
      const chunk = decoder.decode(result.value, { stream: true });
      buffer += chunk;

      const payloads = buffer.split('\n\n');
      buffer = payloads.pop(); 

      for (const payload of payloads) {

        if (payload.startsWith('data:')) {
          const data = payload.replace('data: ', '');
          try {
            const parsedData = JSON.parse(data);
            const text = parsedData.choices[0].delta?.content || '';
            fullText += text;
          } catch (error) {
            console.log(`Error with JSON.parse and ${data}.\n${error}`);
          }
        }
      }
    }

    if (buffer) {
      try {
        const data = buffer.replace('data: ', '');
        const parsedData = JSON.parse(data);
        const text = parsedData.choices[0].delta?.content || '';
        fullText += text;
      } catch (error) {
        console.log(`Error with JSON.parse and ${buffer}.\n${error}`);
      }
    }

    if (fullText) {
      res.write(`${fullText}`);
      console.log(`${fullText}`);
    }

    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat memproses pesan" });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { idMahasiswa } = req.params;

    if (!idMahasiswa) {
      return res.status(400).json({ error: "idMahasiswa diperlukan" });
    }

    const messages = await prisma.message.findMany({
      where: {
        idMahasiswa,
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat mengambil pesan" });
  }
};

export const deleteChatMessages = async (req, res) => {
  try {
    const { idMahasiswa } = req.params;

    if (!idMahasiswa) {
      return res.status(400).json({ error: "idMahasiswa diperlukan" });
    }

    await prisma.message.deleteMany({
      where: {
        idMahasiswa,
      },
    });

    res.status(200).json({ message: "Pesan berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat menghapus pesan" });
  }
};

export const addChatMessage = async (req, res) => {
  try {
    const { idMahasiswa, text, role } = req.body;

    if (!idMahasiswa || !text || !role) {
      return res.status(400).json({ error: "idMahasiswa, text, dan role diperlukan" });
    }

    await prisma.message.create({
      data: {
        idMahasiswa,
        text,
        isUserMessage: role === "bot",
        timestamp: new Date(),
      },
    });

    res.status(200).json({ message: "Pesan berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan saat menambahkan pesan" });
  }
};
