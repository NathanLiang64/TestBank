import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import { LossReissueResultWrapper } from './lossReissue.style';

const LossReissue2 = () => {
  const state = useSelector(({ lossReissue }) => lossReissue.state);
  const actionText = useSelector(({ lossReissue }) => lossReissue.actionText);
  const isResultSuccess = useSelector(({ lossReissue }) => lossReissue.isResultSuccess);
  const { push } = useHistory();

  const renderSuccessResult = () => (
    <>
      <div className="accountArea">
        <h2 className="bank">遠東商銀(805)</h2>
        <h2 className="account">04300499006456</h2>
      </div>
      <span className="divider" />
      <div className="list">
        <InformationList title="金融卡狀態" content={state} />
      </div>
    </>
  );

  const renderFailResult = () => (
    <div className="accountArea">
      <p className="errorCode">錯誤代碼：E341</p>
      <p className="errorText">此處放置 API 回傳之錯誤訊息。</p>
    </div>
  );

  useCheckLocation();
  usePageInfo('/api/lossReissue');

  return (
    <LossReissueResultWrapper>
      <div className="stateArea">
        <div className="stateImage">
          <img src={isResultSuccess ? SuccessImage : ErrorImage} alt="Success" />
        </div>
        {
          isResultSuccess
            ? <h3 className="stateText success">{`${actionText}成功`}</h3>
            : <h3 className="stateText error">{`${actionText}失敗`}</h3>
        }
      </div>
      { isResultSuccess ? renderSuccessResult() : renderFailResult() }
      <FEIBButton onClick={() => push('/')}>確認</FEIBButton>
    </LossReissueResultWrapper>
  );
};

export default LossReissue2;
