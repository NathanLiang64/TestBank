import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';

/* Styles */
import PwdModifyWrapper from './pwdModify.style';

const PwdModify1 = () => {
  const history = useHistory();
  const isSuccess = false;

  const toProfile = () => {
    history.push('/profile');
  };

  useCheckLocation();
  usePageInfo('/api/pwdModify');

  return (
    <PwdModifyWrapper>
      <div className="stateArea">
        <div className="stateImage">
          <img src={isSuccess ? SuccessImage : ErrorImage} alt="Success" />
        </div>
        {
          isSuccess
            ? (
              <>
                <h3 className="stateText success">變更成功</h3>
                <div className="stateContent">
                  <p>
                    您的網銀密碼已變更成功囉！
                  </p>
                  <p>
                    下次請使用新設定之密碼進行登入，謝謝。
                  </p>
                </div>
              </>
            )
            : (
              <>
                <h3 className="stateText error">變更失敗</h3>
                <div className="stateContent">變更網銀密碼失敗！</div>
              </>
            )
        }
      </div>
      <FEIBButton onClick={toProfile}>
        確定
      </FEIBButton>
    </PwdModifyWrapper>
  );
};

export default PwdModify1;
