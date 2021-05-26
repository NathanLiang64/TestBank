import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';
import { AddAPhotoOutlined, AddCircleOutlineOutlined } from '@material-ui/icons';

/* Styles */
import AdjustmentWrapper from './adjustment.style';

const Adjustment1 = () => {
  const history = useHistory();
  const handleNextStep = () => {
    history.push('/adjustment2');
  };

  return (
    <AdjustmentWrapper>
      <div className="customArea">
        <NoticeArea title="財力拍照">
          <AddAPhotoOutlined style={{ fontSize: '10rem' }} />
        </NoticeArea>
        <div className="addCertification">
          <AddCircleOutlineOutlined style={{ fontSize: '2rem' }} />
          <span>增加財力證明</span>
        </div>
        <FEIBButton onClick={handleNextStep}>下一步</FEIBButton>
      </div>
    </AdjustmentWrapper>
  );
};

export default Adjustment1;
