import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';

/* Styles */
import ChangeUserNameWrapper from './changeUserName.style';

const ChangeUserName1 = () => {
  const history = useHistory();
  const isSuccess = true;

  const toProfile = () => {
    history.push('/profile');
  };

  useCheckLocation();
  usePageInfo('/api/changeUserName');

  return (
    <ChangeUserNameWrapper>
      <div className="stateArea">
        <div className="stateImage">
          <img src={isSuccess ? SuccessImage : ErrorImage} alt="Success" />
        </div>
        {
          isSuccess
            ? (
              <>
                <h3 className="stateText success">變更成功</h3>
                <div className="stateContent">您已成功變更使用者代號！</div>
              </>
            )
            : (
              <>
                <h3 className="stateText error">變更失敗</h3>
                <div className="stateContent">變更使用者代號失敗！</div>
              </>
            )
        }
      </div>
      <FEIBButton onClick={toProfile}>
        確定
      </FEIBButton>
    </ChangeUserNameWrapper>
  );
};

export default ChangeUserName1;
