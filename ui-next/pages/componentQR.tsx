import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

interface ComponentQRProps {
  hash: string;
  secret: string;
}

const ComponentQR : FunctionComponent<ComponentQRProps> = ({ hash, secret }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get(`/api/QR?hash=${hash}&secret=${secret}`);
        //console.log(response.data)
        setQrCodeDataURL(response.data.qrCodeDataURL);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQrCode();
  }, [hash, secret]);

  useEffect(() => {
    const downloadPDF = async () => {
      try {
        const res = await axios.get(`/api/QRPDFPc?hash=${hash}&secret=${secret}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'qr-code.pdf');
        document.body.appendChild(link);
        link.click();
      } catch (err) {
        console.error(err);
      }
    };
  
    if (qrCodeDataURL) {
      downloadPDF();
    }
  }, [qrCodeDataURL, hash, secret]);

  return (
    <>
      {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR code" />}
    </>
  );
};

export default ComponentQR;
