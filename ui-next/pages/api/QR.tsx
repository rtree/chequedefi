import { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the secret from the query parameters
    const secret    = req.query.secret || '';
    const networkId = req.query.networkId || '5001'; //default is mantle testnet.

    // Construct the URL to encode in the QR code
    const url = `http://cheque.arkt.me:3000/redeem?secretq=${secret}&networkId=${networkId}`;

    // Generate a QR code as a data URL
    const qrCodeDataURL = await QRCode.toDataURL(url);

    // Return the QR code data URL
    //console.log("QR.tsx: " + qrCodeDataURL);
    res.status(200).json({ qrCodeDataURL });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while generating the QR code.' });
  }
}