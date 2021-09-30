import InformationList from 'components/InformationList';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import DialogContentWrapper from './dialogContent.style';

const DialogContent = ({ data }) => (
  <DialogContentWrapper>
    <div className="resultContainer">
      <div className="stateContainer">
        <img className="stateImage" src={data.success ? SuccessImage : ErrorImage} alt="" />
        <div className={`stateContent ${data.success ? 'success' : 'fail'}`}>
          { data.success ? '轉帳成功' : '轉帳失敗'}
        </div>
      </div>
      { !data.success && (<div className="msgLabel">{data.stderrMsg}</div>) }
    </div>
    <div className="mainBlock">
      <div className="dataLabel">轉出金額與轉入帳號</div>
      <div className="balance">{data.amount}</div>
      <div className="account">遠東商銀(805)</div>
      <div className="account">043000990000</div>
    </div>
    <div className="informationListContainer">
      <InformationList title="轉出帳號" content="0430099001234" remark="保時捷車友會" />
      <InformationList title="時間" content={data.trnsDate} />
    </div>
  </DialogContentWrapper>
);

export default DialogContent;
