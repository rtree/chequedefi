import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';
import { Base64 } from 'js-base64';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the input string from the query parameters
    const inputString = req.query.inputString || 'https://twitter.com/rtree/';

    // Generate a QR code as a data URL
    const qrCodeDataURL = await QRCode.toDataURL(inputString[0]);
    const qrCodeData = Uint8Array.from(atob(qrCodeDataURL.split(',')[1]), c => c.charCodeAt(0));

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([200, 200]);

    // Load the QR code image
    const qrCodeImage = await pdfDoc.embedPng(qrCodeData);

    // Draw the QR code image on the page
    page.drawText('Scan the QR code to visit:');
    page.drawImage(qrCodeImage, {
      x: 0,
      y: 30,
      width: qrCodeImage.width,
      height: qrCodeImage.height,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert the Uint8Array to Base64
    const pdfBase64 = Base64.fromUint8Array(pdfBytes);

    // Construct the URL
    const url =
      'siiprintagent://1.0/print?' +
      'CallbackSuccess=' +
      encodeURIComponent('https://example.com/success') +
      '&' +
      'CallbackFail=' +
      encodeURIComponent('https://example.com/fail') +
      '&' +
      'Format=pdf' +
      '&' +
      'Data=' +
      encodeURIComponent(pdfBase64) +
      '&' +
      'SelectOnError=yes' +
      '&' +
      'CutType=full' +
      '&' +
      'CutFeed=yes' +
      '&' +
      'FitToWidth=no' +
      '&' +
      'PaperWidth=58';

    // Return the URL
    res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating the PDF.' });
  }
}
