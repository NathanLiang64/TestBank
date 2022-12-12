/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import BottomAction from 'components/BottomAction';
import SnackModal from 'components/SnackModal';
import theme from 'themes/theme';
import {
  AddMemberIcon, CameraIcon, PhoneIcon, ShareIcon, TransactionIcon,
} from 'assets/images/icons';
import AccountEditor from 'pages/D00500_FrequentContacts/D00500_AccountEditor';
import { addFrequentAccount } from 'pages/D00500_FrequentContacts/api';
import { shareMessage } from 'utilities/AppScriptProxy';

import { setWaittingVisible, setDrawerVisible } from 'stores/reducers/ModalReducer';
import { showDrawer, showError, showInfo } from 'utilities/MessageModal';
import { getDisplayAmount, getCycleDesc, getTransDate } from './api';
import TransferWrapper from './D00100.style';

/**
 * 轉帳結果頁
 * @param {*} { state } 是由轉帳確認頁(D001001)在通過交易驗證後，傳過來的 Model 資料。
 */
const TransferResult = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const dispatch = useDispatch();

  const [model] = useState(state);
  const [showSnapshotSuccess, setShowSnapshotSuccess] = useState();

  /**
   * 頁面初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
  }, []);

  /**
   * 初始化完成，關閉等待中狀態。
   */
  useEffect(async () => {
    if (model) dispatch(setWaittingVisible(false));
  }, [model]);

  /**
   * 顯示轉帳結果。
   */
  const renderTransferResult = () => (
    <>
      <section className="transferMainInfo">
        <p>轉出金額與轉入帳號</p>
        <h3 className="transferAmount">{getDisplayAmount(model.amount)}</h3>
        <h3>{`${model.transIn.bankName} (${model.transIn.bank})`}</h3>
        <h3>{model.transIn.account}</h3>
        {/* 只有「一般轉帳」才需要加入常用帳號 */}
        {model.transIn.type === 0 && (
          <button type="button">
            <AddMemberIcon />
            <span onClick={createRepeatableAccount}>加入常用轉帳</span>
          </button>
        )}
      </section>
      <hr />
      <section>
        <InformationList
          title="轉出帳號後五碼"
          content={`*********${model.transOut.account.substring(9)}`}
          remark={model.transOut.alias}
        />
        {/* 只有「預約轉帳」才需要出現 */}
        {model.booking.mode === 1 && (
          <InformationList title="時間" content={getTransDate(model)} />
        )}
        {model.booking.mode === 1 && model.booking.multiTimes === '*' && (
          <InformationList title="週期" content={getCycleDesc(model.booking)} remark={`預計轉帳${model.booking.transTimes}次`} />
        )}
      </section>
      <section className="transactionDetailArea">
        <Accordion title="詳細交易" space="bottom">
          {/* model.result.fiscCode 財金序號(跨轉才有) */}
          <InformationList title="帳戶餘額" content={`$${model.transOut.balance}`} remark={model.transOut.alias} />
          {model.booking.mode === 0 && model.result.isCrossBank && (
            <InformationList title="手續費" content={`$${model.result.fee}`} remark={`跨轉優惠:剩餘${model.transOut.freeTransferRemain}次`} />
          )}
          <InformationList title="備註" content={model.memo} />
        </Accordion>
      </section>
    </>
  );

  /**
   * 處理UI流程：新增帳戶
   */
  const createRepeatableAccount = async () => {
    const onFinished = async (newAcct) => {
      const headshotId = await addFrequentAccount(newAcct);
      if (headshotId) {
        const message = '這個帳號已加入您的常用帳號名單中嚕！';
        await showInfo(message, () => dispatch(setDrawerVisible(false)));
      }
    };

    // 給 AccountEditor 預設值，且直接進到設定暱稱。
    const acctData = {
      bankId: model.transIn.bank, // '常用轉入帳戶-銀行代碼',
      acctId: model.transIn.account, // '常用轉入帳戶-帳號',
    };

    await showDrawer('新增常用帳號', (<AccountEditor initData={acctData} onFinished={onFinished} />));
  };

  /**
   * 顯示下方功能按鈕，依轉帳結果而有不同輸出。
   * @param {boolean} mode 轉帳結果
   */
  const renderBottomAction = (mode) => (
    <BottomAction>
      {mode ? (
        <>
          <button type="button" onClick={handleClickScreenshot}>
            <CameraIcon />
            畫面截圖
          </button>
          <div className="divider" />
          {/* TODO 將轉帳結果透過原生的分享功能發送出去 */}
          <button type="button" onClick={() => shareMessage('[社群通知]內容待規劃！')}>
            <ShareIcon />
            社群通知
          </button>
        </>
      ) : (
        <>
          {/* TODO 透過原生撥客服電話，但要先詢問使用者（撥客服、智能客服、LINE */}
          <button type="button" onClick={showError('[聯絡客服]功能尚未完成！')}>
            <PhoneIcon />
            聯絡客服
          </button>
          <div className="divider" />
          <button type="button" onClick={() => history.replace('/D00100', model)}>
            <TransactionIcon />
            重新轉帳
          </button>
        </>
      )}
    </BottomAction>
  );

  const handleClickScreenshot = () => {
    // TODO 透過原生功能進行截圖。
    setShowSnapshotSuccess(true);
    setTimeout(() => setShowSnapshotSuccess(false), 1000); // 1 秒後自動關閉。
  };

  /**
   * 頁面輸出。
   */
  return model ? (
    <Layout goBack={false}>
      <TransferWrapper className="transferResultPage">
        <ResultAnimation
          isSuccess={model.result.isSuccess}
          subject={model.result.isSuccess ? '轉帳成功' : '轉帳失敗'}
          descHeader={model.result.errorCode}
          description={model.result.message}
        />
        { renderTransferResult() }
        { renderBottomAction(model.result.isSuccess) }
        { showSnapshotSuccess && (
          <SnackModal icon={<CameraIcon size={32} color={theme.colors.basic.white} />} text="截圖成功" />
        ) }
      </TransferWrapper>
    </Layout>
  ) : null;
};

export default TransferResult;
