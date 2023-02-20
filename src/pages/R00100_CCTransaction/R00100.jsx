import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { showError } from 'utilities/MessageModal';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import BottomAction from 'components/BottomAction';
import CreditCard from 'components/CreditCard';

import { Func } from 'utilities/FuncID';
import CreditCardTxsList from 'components/CreditCardTxsList';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import PageWrapper from './R00100.style';
import { getBankeeCard, getTransactionPromise, updateTxnNotes } from './api';

/**
 * R00100 信用卡 即時消費明細
 */
const R00100 = () => {
  const dispatch = useDispatch();
  const [cardInfo, setCardInfo] = useState();
  const {startFunc, closeFunc, getCurrentFunc} = useNavigation();
  const [transactions, setTransactions] = useState();
  const [index, setIndex] = useState();
  const go2Instalment = () => startFunc(Func.R002.id, {cardNo: cardInfo.cardNo});

  const getTransactions = async (cards) => {
    const transactionsArray = await Promise.all(
      cards.map(({ cardNo }) => getTransactionPromise(cardNo)),
    );
    const flattedTransactions = transactionsArray.flat();
    return flattedTransactions;
  };

  // 編輯信用卡明細備註的 Handler
  const onTxnNotesEdit = async (payload) => {
    dispatch(setModalVisible(false));
    const { isSuccess, message } = await updateTxnNotes(payload);
    if (isSuccess) {
      setTransactions((prevTrans) => prevTrans.map((tran) => (
        tran.txKey === payload.txKey ? {...tran, note: payload.note} : tran)));
    } else showError(message);
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let fetchedCardInfo = null;
    let fetchedTransactions = null;
    const funcParams = await loadFuncParams();
    if (funcParams) {
      fetchedCardInfo = {...funcParams.card, usedCardLimit: funcParams.usedCardLimit};
      fetchedTransactions = funcParams.transactions;
      setIndex(funcParams.index);
    } else {
      // 若從更多 (B00600) 頁面進入，會先確認有沒有 bankee 信用卡，查詢的交易明細就會預設以 bankee 信用卡為主
      const bankeeCardInfo = await getBankeeCard();
      fetchedCardInfo = bankeeCardInfo;
      fetchedTransactions = await getTransactions(fetchedCardInfo.cards);
    }

    setCardInfo(fetchedCardInfo);
    setTransactions(fetchedTransactions);
    dispatch(setWaittingVisible(false));
  }, []);

  const goBackFunc = () => {
    const param = getCurrentFunc(); // TODO closeFunc就有此機制，為何還要自行處理？
    const {keepData} = param;
    if (keepData) {
      // TODO 若使用者在此頁進行背著修改，回到 C00700 的時候，cache 也要被覆蓋成修改後的資料
      // 或者是重新打 API 拿最新資料?
      keepData.transactionObj[index] = transactions;
      closeFunc(keepData);
    } else closeFunc();
  };

  return (
    <Layout fid={Func.R001} title="信用卡即時消費明細" goBackFunc={goBackFunc}>
      <MainScrollWrapper>
        <PageWrapper>
          <div className="bg-gray">
            <CreditCard
              cardName={cardInfo?.isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
              accountNo={cardInfo?.isBankeeCard ? cardInfo.cardNo : ''}
              balance={cardInfo?.usedCardLimit}
              color="green"
              annotation="已使用額度"
            />
          </div>
          <div className="txn-wrapper">
            {!!cardInfo && (
            <CreditCardTxsList
              card={cardInfo}
              transactions={transactions}
              onTxnNotesEdit={onTxnNotesEdit}
            />
            ) }
            {!!transactions?.length && (<div className="note">實際請款金額以帳單為準</div>)}
          </div>
          {cardInfo?.isBankeeCard && (
            <BottomAction position={0}>
              <button type="button" onClick={go2Instalment}>晚點付</button>
            </BottomAction>
          ) }
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default R00100;
