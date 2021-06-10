import { useCheckLocation, usePageInfo } from 'hooks';
import { closeFunc } from 'utilities/BankeePlus';

/* Elements */
import { FEIBCheckbox, FEIBCheckboxLabel } from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
import InfoArea from 'components/InfoArea';

/* Styles */
import OpenWrapper from './open.style';

const Open = () => {
  const toHome = () => {
    closeFunc('home');
  };
  useCheckLocation();
  usePageInfo('/api/open');

  return (
    <OpenWrapper>
      <FEIBCheckboxLabel
        control={(
          <FEIBCheckbox
            className="customPadding"
          />
        )}
        label="同意開通行動銀行服務"
      />
      <div className="btns-container">
        <ConfirmButtons
          mainButtonOnClick={toHome}
        />
      </div>
      <InfoArea>
        提醒您，若您的密碼在網路銀行及Bankee行動銀行達3次錯誤，將無法登錄，請您持身分證至本行各分行或以晶片金融卡至本行ATM、網路ATM辦理解鎖。
      </InfoArea>
    </OpenWrapper>
  );
};

export default Open;
