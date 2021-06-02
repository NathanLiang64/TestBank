import { useCheckLocation, usePageInfo } from 'hooks';
import DepositInquiryWrapper from './depositInquiry.style';

const DepositInquiry = () => {
  useCheckLocation();
  usePageInfo('/api/depositInquiry');

  return (
    <DepositInquiryWrapper>
      Deposit Inquiry
    </DepositInquiryWrapper>
  );
};

export default DepositInquiry;
