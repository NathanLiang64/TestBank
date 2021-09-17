import { useCheckLocation, usePageInfo } from 'hooks';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

const MobileTransfer = () => {
  useCheckLocation();
  usePageInfo('/api/mobileTransfer');

  return (
    <MobileTransferWrapper>
      123
    </MobileTransferWrapper>
  );
};

export default MobileTransfer;
