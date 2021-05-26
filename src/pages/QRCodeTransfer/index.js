import { useCheckLocation, usePageInfo } from 'hooks';
import QRCodeTransferWrapper from './QRCodeTransfer.style';

const QRCodeTransfer = () => {
  useCheckLocation();
  usePageInfo('/api/QRCodeTransfer');

  return (
    <QRCodeTransferWrapper>
      <p>1. 掃描或分享 QRCode 就能轉帳囉</p>
      <p>2. QRCode</p>
      <p>3. 收款帳號 043XXXXXXXXXXXX</p>
      <p>4. 分享 QRCode 按鈕</p>
      <p>5. 我要收款按鈕</p>
      <p>6. 我要付款按鈕</p>
    </QRCodeTransferWrapper>
  );
};

export default QRCodeTransfer;
