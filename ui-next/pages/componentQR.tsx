import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

const ComponentQR : FunctionComponent<any> = ({ hash, secret }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await axios.get(`/api/QR?hash=${hash}&secret=${secret}`);
        console.log(response.data)
        setQrCodeDataURL(response.data.qrCodeDataURL);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQrCode();
  }, [hash, secret]);

  return (
    <>
      {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR code" />}
    </>
  );
};

export default ComponentQR;
