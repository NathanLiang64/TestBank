import { useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBCheckboxLabel,
  FEIBCheckbox,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';
import ConfirmButtons from 'components/ConfirmButtons';

/* Style */
import DeductWrapper from './deduct.style';

import DealContent from './dealContent';

const Deduct1 = () => {
  const history = useHistory();
  const [agree, setAgree] = useState(false);

  const handleCheckBoxChange = (event) => {
    setAgree(event.target.checked);
  };

  const toApplyPage = () => {
    history.push('/deduct2');
  };

  const toFirstPage = () => {
    history.push('/deduct');
  };

  return (
    <DeductWrapper>
      <NoticeArea title="網路銀行線上申請Bankee帳戶自動扣繳遠銀卡帳款約定事項" textAlign="left">
        <DealContent />
      </NoticeArea>
      <div className="checkBoxContainer">
        <FEIBCheckboxLabel
          control={(
            <FEIBCheckbox
              onChange={handleCheckBoxChange}
            />
          )}
          label="本人已詳閱並同意依「遠東商銀信用卡遠銀自動扣繳約定事項」辦理"
        />
      </div>
      <ConfirmButtons
        mainButtonValue="同意"
        mainButtonOnClick={toApplyPage}
        mainButtonDisabled={!agree}
        subButtonValue="不同意"
        subButtonOnClick={toFirstPage}
      />
    </DeductWrapper>
  );
};

export default Deduct1;
