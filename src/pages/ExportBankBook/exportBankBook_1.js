import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';

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
          <div className="stateImage">
            <img src={location.state.data.success ? SuccessImage : ErrorImage} alt="Success" />
          </div>
          {
            location.state.data.success
              ? (
                <>
                  <h3 className="stateText success">寄出成功</h3>
                  <div className="stateContent">
                    存簿封面及帳戶明細將在 5 分鐘內寄送至留存信箱：
                    { location.state.data.mail }
                  </div>
                </>
              )
              : (
                <>
                  <h3 className="stateText error">寄出失敗</h3>
                  <div className="stateContent">操作逾時</div>
                </>
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
