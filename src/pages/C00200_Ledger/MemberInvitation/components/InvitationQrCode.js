import QRCode from 'react-qr-code';

export default ({ url = '' }) => (
  <QRCode
    size={256}
    style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
    value={url}
    viewBox="0 0 256 256"
  />
);
