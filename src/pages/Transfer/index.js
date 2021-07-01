import { useCheckLocation, usePageInfo } from 'hooks';
import TransferWrapper from './transfer.style';

const Transfer = () => {
  useCheckLocation();
  usePageInfo('/api/transfer');

  return (
    <TransferWrapper>
      Transfer
    </TransferWrapper>
  );
};

export default Transfer;
