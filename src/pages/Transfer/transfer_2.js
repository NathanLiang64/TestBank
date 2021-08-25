import { useState } from 'react';
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import { PersonAddRounded, CameraAltOutlined, ShareOutlined } from '@material-ui/icons';
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import { dateFormatter, timeFormatter } from 'utilities/Generator';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import TransferWrapper from './transfer.style';
import TransferDrawer from '../TransferDrawer';
import { setOpenDrawer } from './stores/actions';

const Transfer2 = () => {
  const [openTransferDrawer, setOpenTransferDrawer] = useState(false);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const isSuccess = true;

  const {
    bankCode, receivingAccount, remark, transactionCycle, transactionDate, transactionFrequency, transferAmount,
  } = state;

  const switchFrequency = (frequency) => {
    switch (frequency) {
      case 'weekly':
        return '每週';
      case 'monthly':
        return '每個月';
      default:
        return '';
    }
  };

  const handleClickAddAccount = () => {
    setOpenTransferDrawer(true);
    // TODO: 加入常用帳號要用編輯預約轉帳的介面
    dispatch(setOpenDrawer({ title: '加入常用帳號', content: 'addFrequentlyUsedAccount', open: true }));
  };

  return (
    <TransferWrapper className="transferResultPage">
      <div className="stateArea">
        <div className="stateImage">
          <img src={isSuccess ? SuccessImage : ErrorImage} alt="Success" />
        </div>
        <h3 className={`stateText ${isSuccess ? 'success' : 'error'}`}>
          {isSuccess ? '轉帳成功' : '轉帳失敗'}
        </h3>
      </div>

      <section className="transferMainInfo">
        <p>轉出金額與轉入帳號</p>
        <h3 className="transferAmount">{transferAmount ? `$${transferAmount}` : ''}</h3>
        <h3>{bankCode.bankNo ? `${bankCode.bankName}(${bankCode.bankNo})` : ''}</h3>
        <h3>{receivingAccount ? `${receivingAccount}` : ''}</h3>
        <button type="button">
          <PersonAddRounded />
          <span onClick={handleClickAddAccount}>加入常用轉帳</span>
        </button>
      </section>
      <hr />
      <section>
        <InformationList title="轉出帳號" content="04300499001234" remark="保時捷車友會" />
        <InformationList
          title="時間"
          content={transactionDate ? `${dateFormatter(transactionDate)} ${timeFormatter(transactionDate)}` : ''}
        />
        {transactionFrequency && transactionCycle && (
          <InformationList
            title="週期"
            content={`${switchFrequency(transactionFrequency)}${transactionDate.getDate()}號`}
            remark={`預計轉帳${transactionCycle}次`}
          />
        )}
        <InformationList title="手續費" content="$0" />
        <InformationList title="備註" content={remark || ''} />
      </section>
      <section className="transactionDetailArea">
        <Accordion title="詳細交易" space="bottom">
          <p>詳細交易內容</p>
        </Accordion>
      </section>

      <BottomAction>
        <button type="button">
          <CameraAltOutlined />
          畫面截圖
        </button>
        <div className="divider" />
        <button type="button">
          <ShareOutlined />
          社群通知
        </button>
      </BottomAction>
      { openTransferDrawer && <TransferDrawer /> }
    </TransferWrapper>
  );
};

export default Transfer2;
