import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import prisma from '../../config/db.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export const generatePDF = async (req, res) => {
  try {
    const { idTA } = req.params;

    if (!idTA) {
      return res.status(400).json({ message: 'ID TA diperlukan' });
    }

    const taData = await prisma.tA.findUnique({
      where: { idTA},
      include: {
        Mahasiswa: true, 
        DosenPembimbingTA: {
          include: {
            DosenPembimbing: true,
          },
        },
      },
    });

    if (!taData) {
      return res.status(404).json({ message: 'Data TA tidak ditemukan' });
    }

    const { Mahasiswa, judulTA, DosenPembimbingTA } = taData;
    const [pembimbing1, pembimbing2] = DosenPembimbingTA;

    if (!pembimbing1 || !pembimbing2) {
      return res.status(400).json({ message: 'Data pembimbing tidak lengkap' });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size in points

    // Set header image
    const imageUrl = 'https://drive.google.com/uc?export=download&id=1Kfyz7rp89_iNuhmWAwkyVBOj_TxaWKzd';
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes); // Use embedPng for PNG images
    const { width, height } = image.scale(0.5);
    page.drawImage(image, {
      x: page.getWidth() / 2 - width / 2,
      y: page.getHeight() - height - 50,
      width,
      height,
    });

    // Add text
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.setFont(font);
    page.setFontSize(12);

    // Content
    const content = `
      Kami pembimbing tugas akhir:
      1. ${pembimbing1.DosenPembimbing.nama} (NIP. ${pembimbing1.DosenPembimbing.nip})
      2. ${pembimbing2.DosenPembimbing.nama} (NIP. ${pembimbing2.DosenPembimbing.nip})

      Untuk mahasiswa dengan:
      Nama: ${Mahasiswa.nama}
      NIM: ${Mahasiswa.nim}
      Judul Tugas Akhir: ${judulTA || 'Belum ada'}

      Dengan ini menyatakan bahwa mahasiswa tersebut dapat diajukan untuk mengikuti sidang tugas akhir.
      Oleh karena itu mohon untuk diproses lebih lanjut.

      Padang, ${new Date().toLocaleDateString()}

      Pembimbing I: ${pembimbing1.DosenPembimbing.nama}
      Pembimbing II: ${pembimbing2.DosenPembimbing.nama}
    `;

    const lines = content.split('\n');
    let y = page.getHeight() - height - 70;
    for (let line of lines) {
      page.drawText(line, { x: 50, y });
      y -= 15;
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
