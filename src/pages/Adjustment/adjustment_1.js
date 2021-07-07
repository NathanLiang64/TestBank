import { useState } from 'react';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';
import { AddAPhotoOutlined, AddCircleOutlineOutlined } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import OTPValidate from './otpValidate';
/* Styles */
import AdjustmentWrapper from './adjustment.style';

const Adjustment1 = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNextStep = () => {
    setDrawerOpen(true);
  };

  return (
    <AdjustmentWrapper>
      <NoticeArea title="財力拍照">
        <AddAPhotoOutlined style={{ fontSize: '10rem' }} />
      </NoticeArea>
      <div className="addCertification">
        <AddCircleOutlineOutlined style={{ fontSize: '2rem' }} />
        <span>增加財力證明</span>
      </div>
      <FEIBButton
        className="fixBtnMargin"
        onClick={handleNextStep}
      >
        下一步
      </FEIBButton>
      <BottomDrawer
        title="OTP 驗證碼已寄出"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        content={<OTPValidate />}
      />
    </AdjustmentWrapper>
  );
};

export default Adjustment1;
