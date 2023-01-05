import InformationList from 'components/InformationList';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import { dateToString, toCurrency } from 'utilities/Generator';
import { DialogContentWrapper } from '../D00800.style';

const DialogContent = ({ resultData, selectedAccount }) => (
  <DialogContentWrapper>
    <div className="resultContainer">
      <div className="stateContainer">
        {/* TODO 尚無法得知 result 的資料為何，先給 stderrMsg  */}
        <img className="stateImage" src={resultData.stderrMsg ? ErrorImage : SuccessImage} alt="" />
        <div className={`stateContent ${resultData.stderrMsg ? 'fail' : 'success'}`}>
          { resultData.stderrMsg ? '轉帳失敗' : '轉帳成功'}
        </div>
      </div>
      { resultData.stderrMsg && (<div className="msgLabel">{resultData?.stderrMsg}</div>) }
    </div>
    <div className="mainBlock">
      <div className="dataLabel">轉出金額與轉入帳號</div>
      <div className="balance">
        $
        {toCurrency(resultData?.transferAmount)}
      </div>
      <div className="account">{resultData?.accountNo}</div>
    </div>
    <div className="informationListContainer">
      <InformationList title="轉出帳號" content={selectedAccount.accountNo} remark={selectedAccount.alias} />
      {/* TODO 尚無法得知 result 的資料為何，先回傳 rgDay */}
      <InformationList title="時間" content={dateToString(resultData.rgDay)} />
    </div>
  </DialogContentWrapper>
);

export default DialogContent;
