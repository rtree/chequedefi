import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the hash and secret from the query parameters
    const hash   = req.query.hash || '';
    const secret = req.query.secret || '';

    // Construct the URL to encode in the QR code
    const url = `http://cheque.arkt.me:3000/redeem?hashq=${hash}&secretq=${secret}`;

    // Generate a QR code as a data URL
    const qrCodeDataURL = await QRCode.toDataURL(url);
    const qrCodeData = Uint8Array.from(atob(qrCodeDataURL.split(',')[1]), c => c.charCodeAt(0));

    // Create a new PDF document with a width of 58mm (approximately 164 points)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([10, 10]);

    // Load the QR code image
    const qrCodeImage = await pdfDoc.embedPng(qrCodeData);

    // Calculate the new dimensions to fit within the width of 58mm
    const scale = 164 / Math.max(qrCodeImage.width, qrCodeImage.height);
    const newWidth = qrCodeImage.width * scale;
    const newHeight = qrCodeImage.height * scale;

    // Draw the QR code image on the page
    page.drawText('Scan the QR code to visit:');
    page.drawImage(qrCodeImage, {
      x: page.getWidth() / 2 - newWidth / 2,
      y: page.getHeight() / 2 - newHeight / 2,
      width: newWidth,
      height: newHeight,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Set the response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=qr-code.pdf');

    // Send the PDF data as a stream
    res.status(200).send(Buffer.from(pdfBytes.buffer));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating the PDF.' });
  }
}
