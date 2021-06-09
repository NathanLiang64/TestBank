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
        label="同意開啟行動銀行服務"
      />
      <div className="btns-container">
        <ConfirmButtons
          mainButtonOnClick={toHome}
        />
      </div>
      <InfoArea>
        同意開通除了可以使用Bankee App 外，亦可同步使用遠銀行動銀行服務
      </InfoArea>
    </OpenWrapper>
  );
};

export default Open;
