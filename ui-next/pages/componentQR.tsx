import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

interface ComponentQRProps {
  hash: string;
  secret: string;
}

const ComponentQR : FunctionComponent<ComponentQRProps> = ({ hash, secret }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [pdfMobileUrl, setPdfMobileUrl] = useState('');
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const fetchQrCodeAndPdfMobile = async () => {
      try {
        const [qrResponse, pdfMobileResponse] = await Promise.all([
          axios.get(`/api/QR?hash=${hash}&secret=${secret}`),
          axios.get(`/api/QRPDFmobile?hash=${hash}&secret=${secret}`)
        ]);

        console.log(qrResponse.data);
        console.log(pdfMobileResponse.data);

        setQrCodeDataURL(qrResponse.data.qrCodeDataURL);
        setPdfMobileUrl(pdfMobileResponse.data.url);
        if (!hasNavigated) {
          window.location.href = pdfMobileResponse.data.url;
          setHasNavigated(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQrCodeAndPdfMobile();
  }, [hash, secret]);

  return (
    <>
      {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR code" />}
      {pdfMobileUrl && <p>{pdfMobileUrl}</p>}
    </>
  );
};

export default ComponentQR;
