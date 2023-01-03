import InformationList from 'components/InformationList';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import { dateToString, toCurrency } from 'utilities/Generator';
import { DialogContentWrapper } from '../D00800.style';

const DialogContent = ({ data, selectedAccount }) => (
  <DialogContentWrapper>
    <div className="resultContainer">
      <div className="stateContainer">
        {/* TODO 尚無法得知 result 的資料為何，先給 stderrMsg  */}
        <img className="stateImage" src={data.stderrMsg ? ErrorImage : SuccessImage} alt="" />
        <div className={`stateContent ${data.stderrMsg ? 'fail' : 'success'}`}>
          { data.stderrMsg ? '轉帳失敗' : '轉帳成功'}
        </div>
      </div>
      { data.stderrMsg && (<div className="msgLabel">{data?.stderrMsg}</div>) }
    </div>
    <div className="mainBlock">
      <div className="dataLabel">轉出金額與轉入帳號</div>
      <div className="balance">
        $
        {toCurrency(data?.transferAmount)}
      </div>
      <div className="account">{data?.accountNo}</div>
    </div>
    <div className="informationListContainer">
      <InformationList title="轉出帳號" content={selectedAccount.acctId} remark={selectedAccount.acctName} />
      {/* TODO 尚無法得知 result 的資料為何，先回傳 rgDay */}
      <InformationList title="時間" content={dateToString(data.rgDay)} />
    </div>
  </DialogContentWrapper>
);

export default DialogContent;
