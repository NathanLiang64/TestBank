import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';

/* Styles */
import ExportBankBookWrapper from './exportBankBook.style';

const ExportBankBook1 = ({ location }) => {
  const history = useHistory();

  const toProfile = () => {
    history.push('/more');
  };

  useCheckLocation();
  usePageInfo('/api/exportBankBook');

  return (
    <ExportBankBookWrapper>
      <form>
        <div className="stateArea">
          <SuccessFailureAnimations isSuccess={location.state.data.success} successTitle="寄出成功" errorTitle="寄出失敗" />
          {
            location.state.data.success
              ? (
                <div className="stateContent">
                  存簿封面及帳戶明細將在 5 分鐘內寄送至留存信箱：
                  { location.state.data.mail }
                </div>
              )
              : (
                <div className="stateContent">操作逾時</div>
              )
          }
        </div>
        <FEIBButton onClick={toProfile}>
          確認
        </FEIBButton>
      </form>
    </ExportBankBookWrapper>
  );
};

export default ExportBankBook1;
