import InformationList from 'components/InformationList';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import DialogContentWrapper from './dialogContent.style';

const DialogContent = ({ data, selectedAccount }) => (
  <DialogContentWrapper>
    <div className="resultContainer">
      <div className="stateContainer">
        <img className="stateImage" src={data.stderrMsg === '轉帳成功' ? SuccessImage : ErrorImage} alt="" />
        <div className={`stateContent ${data.stderrMsg === '轉帳成功' ? 'success' : 'fail'}`}>
          { data.stderrMsg === '轉帳成功' ? '轉帳成功' : '轉帳失敗'}
        </div>
      </div>
      { !data.stderrMsg === '轉帳成功' && (<div className="msgLabel">{data?.stderrMsg}</div>) }
    </div>
    <div className="mainBlock">
      <div className="dataLabel">轉出金額與轉入帳號</div>
      <div className="balance">{data?.amount}</div>
      <div className="account">{data?.inActNo}</div>
    </div>
    <div className="informationListContainer">
      <InformationList title="轉出帳號" content={selectedAccount.accountId} remark={selectedAccount.showName} />
      <InformationList title="時間" content={data.trnsDate} />
    </div>
  </DialogContentWrapper>
);

export default DialogContent;
