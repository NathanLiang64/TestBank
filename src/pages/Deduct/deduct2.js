import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBButton,
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
} from 'components/elements';
import Accordion from 'components/Accordion';

/* Style */
import DeductWrapper from './deduct.style';

import AccordionContent from './accordionContent';

const Deduct2 = () => {
  const history = useHistory();
  const toConfirmPage = () => {
    history.push('/deduct3');
  };

  useCheckLocation();
  usePageInfo('/api/deduct');

  return (
    <DeductWrapper>
      <p className="titleLabel">申請自動扣繳異動資料</p>
      <div className="inputContainer">
        <FEIBInputLabel>扣款帳號</FEIBInputLabel>
        <FEIBInput value="04300499022366" disabled />
      </div>
      <div className="inputContainer">
        <FEIBInputLabel>扣款方式</FEIBInputLabel>
        <FEIBSelect
          id="way"
          name="way"
          value="1"
          placeholder="請選擇扣款方式"
        >
          <FEIBOption value="1">最低應繳金額</FEIBOption>
          <FEIBOption value="2">應繳總金額</FEIBOption>
        </FEIBSelect>
      </div>
      <Accordion space="both" open>
        <AccordionContent />
      </Accordion>
      <FEIBButton onClick={toConfirmPage}>確認</FEIBButton>
    </DeductWrapper>
  );
};

export default Deduct2;
