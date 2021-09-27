import InformationList from 'components/InformationList';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import DialogContentWrapper from './dialogContent.style';

const DialogContent = () => {
  const isSuccess = true;
  return (
    <DialogContentWrapper>
      <div className="resultContainer">
        <div className="stateContainer">
          <img className="stateImage" src={isSuccess ? SuccessImage : ErrorImage} alt="" />
          <div className={`stateContent ${isSuccess ? 'success' : 'fail'}`}>
            { isSuccess ? '轉帳成功' : '轉帳失敗'}
          </div>
        </div>
        { !isSuccess && (<div className="msgLabel">餘額不足</div>) }
      </div>
      <div className="mainBlock">
        <div className="dataLabel">轉出金額與轉入帳號</div>
        <div className="balance">$300</div>
        <div className="account">遠東商銀(805)</div>
        <div className="account">043000990000</div>
      </div>
      <div className="informationListContainer">
        <InformationList title="轉出帳號" content="0430099001234" remark="保時捷車友會" />
        <InformationList title="時間" content="2021/03/05" />
      </div>
    </DialogContentWrapper>
  );
};

export default DialogContent;
