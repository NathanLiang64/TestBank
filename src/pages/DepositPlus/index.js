import { useCheckLocation, usePageInfo } from 'hooks';
import DepositPlusWrapper from './depositPlus.style';

const Deposit = () => {
  useCheckLocation();
  usePageInfo('/api/depositPlus');

  return (
    <DepositPlusWrapper>
      Deposit
    </DepositPlusWrapper>
  );
};

export default Deposit;
