/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';
import { AddAPhotoOutlined, AddCircleOutlineOutlined } from '@material-ui/icons';

/* Styles */
import AdjustmentWrapper from './adjustment.style';

const Adjustment1 = () => (
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
    >
      下一步
    </FEIBButton>
  </AdjustmentWrapper>
);

export default Adjustment1;
