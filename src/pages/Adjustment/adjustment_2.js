import { useState, useEffect } from 'react';

/* Elements */
import NoticeArea from 'components/NoticeArea';
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBButton,
} from 'components/elements';
import Dialog from 'components/Dialog';
// import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';

/* Styles */
import theme from 'themes/theme';
import AdjustmentWrapper from './adjustment.style';

const CountDown = () => {
  const [countSec, setCountSec] = useState(5 * 60);

  const formatCountSec = (count) => {
    const min = Math.floor(count / 60);
    const sec = count % 60;
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  useEffect(() => {
    const countDown = setInterval(() => {
      if (countSec > 0) {
        // eslint-disable-next-line no-shadow
        setCountSec((countSec) => countSec - 1);
      }
    }, 1000);
    return () => clearInterval(countDown);
  }, [countSec]);

  return (
    <p className="countSec">{ formatCountSec(countSec) }</p>
  );
};

const Adjustment2 = () => {
  const data = {
    phone: '0970***853',
  };
  // const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [otpPassword, setOTPPassword] = useState('');

  const handleOTPPasswordChange = (event) => {
    setOTPPassword(event.target.value);
  };

  const handleAdjustmentApply = () => {
    setShowResultDialog(true);
  };

  // const handleApplyButtonClick = () => {
  //   setShowConfirmDialog(true);
  // };

  // const ConfirmDialog = () => (
  //   <Dialog
  //     isOpen={showConfirmDialog}
  //     onClose={() => setShowConfirmDialog(false)}
  //     content={<p>您確定要申請額度臨條嗎？</p>}
  //     action={(
  //       <ConfirmButtons
  //         mainButtonOnClick={handleAdjustmentApply}
  //         subButtonOnClick={() => setShowConfirmDialog(false)}
  //       />
  //     )}
  //   />
  // );

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <Alert state="success">申請成功</Alert>
          <p>
            您已成功申請額度臨調變更！
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

  return (
    <AdjustmentWrapper>
      <NoticeArea title="簡訊驗證">
        <p>
          行動電話：
          {data.phone}
        </p>
        <p>簡訊 OTP 密碼有效時間尚餘</p>
        <CountDown />
      </NoticeArea>
      <div className="inputContainer">
        <FEIBInputLabel>識別碼</FEIBInputLabel>
        <FEIBInput
          value="4NFT"
          disabled
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
      </div>
      <div className="inputContainer">
        <FEIBInputLabel>OTP 密碼</FEIBInputLabel>
        <FEIBInput
          value={otpPassword}
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          onChange={handleOTPPasswordChange}
        />
        <span className="tailText">重新發送</span>
      </div>
      <FEIBButton
        disabled={!otpPassword}
        onClick={handleAdjustmentApply}
      >
        確認申請
      </FEIBButton>
      {/* <ConfirmDialog /> */}
      <ResultDialog />
    </AdjustmentWrapper>
  );
};

export default Adjustment2;
