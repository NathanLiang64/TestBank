import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  PersonAddRounded, CameraAltOutlined, ShareOutlined, PhoneRounded, AutorenewRounded,
} from '@material-ui/icons';
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import { directTo } from 'utilities/mockWebController';
import TransferWrapper from './transfer.style';
import TransferDrawer from '../TransferDrawer';
import { setClickMoreOptions, setOpenDrawer } from './stores/actions';

const Transfer2 = () => {
  const [openTransferDrawer, setOpenTransferDrawer] = useState(false);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const history = useHistory();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const isSuccess = true;

  const {
    money, bankNo, bankName, receivingAccount, date,
    frequency, amount, debitAccount, debitName, remark,
    depositAmount, transferRemaining, transferType,
  } = state;

  const hideAccount = (account) => {
    const hiddenChart = account.substr(0, account.length - 5);
    return account.replace(hiddenChart, '*********');
  };

  const handleClickAddAccount = () => {
    setOpenTransferDrawer(true);
    const account = {
      bankNo,
      bankName,
      acctId: receivingAccount,
    };
    dispatch(setOpenDrawer({ title: '加入常用帳號', content: 'editDesignedAccount', open: true }));
    dispatch(setClickMoreOptions({ ...clickMoreOptions, add: { click: true, target: account } }));
  };

  const renderTransferMainInfo = () => (
    <>
      <section className="transferMainInfo">
        <p>轉出金額與轉入帳號</p>
        <h3 className="transferAmount">{money}</h3>
        <h3>{`${bankName}(${bankNo})`}</h3>
        <h3>{receivingAccount ? `${receivingAccount}` : ''}</h3>
        <button type="button">
          <PersonAddRounded />
          <span onClick={handleClickAddAccount}>加入常用轉帳</span>
        </button>
      </section>
      <hr />
      <section>
        <InformationList title="轉出帳號後五碼" content={hideAccount(debitAccount)} remark={debitName} />
        <InformationList title="時間" content={date} />
        {frequency && amount && <InformationList title="週期" content={frequency} remark={`預計轉帳${amount}次`} />}
      </section>
      <section className="transactionDetailArea">
        <Accordion title="詳細交易" space="bottom">
          <InformationList title="帳戶餘額" content={`$${depositAmount}`} remark={debitName} />
          {transferType === 'now' && <InformationList title="手續費" content="$0" remark={`跨轉優惠:剩餘${transferRemaining}次`} />}
          <InformationList title="備註" content={remark || ''} />
        </Accordion>
      </section>
      <BottomAction>
        <button type="button" onClick={() => window.alert('call 原生截圖')}>
          <CameraAltOutlined />
          畫面截圖
        </button>
        <div className="divider" />
        <button type="button" onClick={() => window.alert('call 原生分享')}>
          <ShareOutlined />
          社群通知
        </button>
      </BottomAction>
    </>
  );

  const errorInfo = () => (
    <>
      <section className="errorInfo">
        <p className="errorCode">錯誤代碼：E341</p>
        <p className="errorText">此處放置 API 回傳之錯誤訊息。</p>
      </section>
      <BottomAction>
        <button type="button" onClick={() => window.alert('通話')}>
          <PhoneRounded />
          聯絡客服
        </button>
        <div className="divider" />
        <button type="button" onClick={() => directTo(history, 'transfer')}>
          <AutorenewRounded />
          重新轉帳
        </button>
      </BottomAction>
    </>
  );

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
      { isSuccess ? renderTransferMainInfo() : errorInfo() }
      { openTransferDrawer && <TransferDrawer /> }
    </TransferWrapper>
  );
};

export default Transfer2;
