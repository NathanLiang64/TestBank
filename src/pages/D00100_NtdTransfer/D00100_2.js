import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import SnackModal from 'components/SnackModal';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import {
  AddMemberIcon, CameraIcon, PhoneIcon, ShareIcon, TransactionIcon,
} from 'assets/images/icons';
import { directTo } from 'utilities/mockWebController';
import theme from 'themes/theme';
import TransferWrapper from './D00100.style';
import { setClickMoreOptions, setOpenDrawer } from './stores/actions';
// import TransferDrawer from '../TransferDrawer';

const Transfer2 = () => {
  // const [openTransferDrawer, setOpenTransferDrawer] = useState(false);
  const [isSnapshotSuccess, setIsSnapshotSuccess] = useState(false);
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
    // setOpenTransferDrawer(true);
    const account = {
      bankNo,
      bankName,
      acctId: receivingAccount,
    };
    dispatch(setOpenDrawer({ title: '加入常用帳號', content: 'editDesignedAccount', open: true }));
    dispatch(setClickMoreOptions({ ...clickMoreOptions, add: { click: true, target: account } }));
  };

  const handleClickScreenshot = () => {
    console.log('call 原生截圖');
    setIsSnapshotSuccess(true);
    // 1 秒後將 isSnapshotSuccess 的值重置
    setTimeout(() => setIsSnapshotSuccess(false), 1000);
  };

  const renderTransferMainInfo = () => (
    <>
      <section className="transferMainInfo">
        <p>轉出金額與轉入帳號</p>
        <h3 className="transferAmount">{money}</h3>
        <h3>{`${bankName}(${bankNo})`}</h3>
        <h3>{receivingAccount ? `${receivingAccount}` : ''}</h3>
        <button type="button">
          <AddMemberIcon />
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
    </>
  );

  const renderBottomAction = (success) => (
    <BottomAction>
      <button type="button" onClick={success ? handleClickScreenshot : () => console.log('通話')}>
        { success ? <CameraIcon /> : <PhoneIcon />}
        { success ? '畫面截圖' : '聯絡客服' }
      </button>
      <div className="divider" />
      <button type="button" onClick={success ? () => console.log('call 原生分享') : () => directTo(history, 'transferStatic')}>
        { success ? <ShareIcon /> : <TransactionIcon />}
        { success ? '社群通知' : '重新轉帳' }
      </button>
    </BottomAction>
  );

  return (
    <TransferWrapper className="transferResultPage">
      <SuccessFailureAnimations
        isSuccess={isSuccess}
        successTitle="轉帳成功"
        errorTitle="轉帳失敗"
        errorCode="E341"
        errorDesc="親愛的客戶，您好非約定轉帳超過當日轉帳限額，請重新執行交易，如有疑問，請與本行客戶服務中心聯繫。"
        errorSpace
      >
        { renderTransferMainInfo() }
      </SuccessFailureAnimations>

      { renderBottomAction(isSuccess) }
      {/* { openTransferDrawer && <TransferDrawer /> } */}
      { isSnapshotSuccess && (
        <SnackModal icon={<CameraIcon size={32} color={theme.colors.basic.white} />} text="截圖成功" />
      ) }
    </TransferWrapper>
  );
};

export default Transfer2;
