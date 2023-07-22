import { NextApiRequest, NextApiResponse } from 'next';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';
import { Base64 } from 'js-base64';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the secret from the query parameters
    const secret = req.query.secret || '';
    const networkId = req.query.networkId || '5001'; //default is mantle testnet.

    // Construct the URL to encode in the QR code
    //const urlqr = `http://cheque.arkt.me:3000/redeem?secretq=${secret}`;
    const urlqr = `http://cheque.arkt.me:3000/redeem?secretq=${secret}&networkId=${networkId}`;

    // Generate a QR code as a data URL
    const qrCodeDataURL = await QRCode.toDataURL(urlqr);
    const qrCodeData = Uint8Array.from(atob(qrCodeDataURL.split(',')[1]), c => c.charCodeAt(0));

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([200, 200]);

    // Load the QR code image
    const qrCodeImage = await pdfDoc.embedPng(qrCodeData);

    // Calculate the new dimensions
    const newWidth = qrCodeImage.width * 0.6;
    const newHeight = qrCodeImage.height * 0.6;

    // Draw the QR code image on the page
    page.drawText('Scan the QR code:');
    page.drawImage(qrCodeImage, {
      x: 0,
      y: 30,
      width: newWidth,
      height: newHeight,
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Convert the Uint8Array to Base64
    const pdfBase64 = Base64.fromUint8Array(pdfBytes);

    // Construct the URL
    const url =
      'siiprintagent://1.0/print?' +
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
