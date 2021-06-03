import { useSelector } from 'react-redux';
import Alert from 'components/Alert';
import LossReissueWrapper from './lossReissue.style';

const LossReissue2 = () => {
  const state = useSelector(({ lossReissue }) => lossReissue.state);
  const actionText = useSelector(({ lossReissue }) => lossReissue.actionText);
  const isResultSuccess = useSelector(({ lossReissue }) => lossReissue.isResultSuccess);

  const renderSuccessResult = () => (
    <>
      <Alert state="success">{`已完成${actionText}申請`}</Alert>
      <table>
        <tbody>
          <tr>
            <td>帳號</td>
            <td>04300499006456</td>
          </tr>
          <tr>
            <td>金融卡狀態</td>
            <td>{state}</td>
          </tr>
        </tbody>
      </table>
    </>
  );

  const renderFailResult = () => (
    <>
      <Alert>{`${actionText}申請失敗，請重新申請`}</Alert>
      <p>申請失敗原因，應由 api 回傳</p>
    </>
  );

  return (
    <LossReissueWrapper inDialog>
      { isResultSuccess ? renderSuccessResult() : renderFailResult() }
    </LossReissueWrapper>
  );
};

export default LossReissue2;
