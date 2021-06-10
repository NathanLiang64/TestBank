import { useState } from 'react';
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
import Dialog from 'components/Dialog';
import Alert from 'components/Alert';

/* Style */
import DeductWrapper from './deduct.style';

import AccordionContent from './accordionContent';

const Deduct3 = () => {
  const [showResultDialog, setShowResultDialog] = useState(false);

  const sendApply = () => {
    setShowResultDialog(true);
  };

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <Alert state="success">申請成功</Alert>
          <p>
            您已成功申請自動扣繳！
          </p>
        </>
      )}
      action={(
        <FEIBButton onClick={() => setShowResultDialog(false)}>
          確定
        </FEIBButton>
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/deduct');

  return (
    <DeductWrapper>
      <p className="titleLabel">申請自動扣繳異動確認資料</p>
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
          disabled
        >
          <FEIBOption value="1">最低應繳金額</FEIBOption>
          <FEIBOption value="2">應繳總金額</FEIBOption>
        </FEIBSelect>
      </div>
      <Accordion space="both">
        <AccordionContent />
      </Accordion>
      <FEIBButton onClick={sendApply}>確認</FEIBButton>
      <ResultDialog />
    </DeductWrapper>
  );
};

export default Deduct3;
