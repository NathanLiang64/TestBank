import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { showCustomPrompt, showError } from 'utilities/MessageModal';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import BottomAction from 'components/BottomAction';
import CreditCard from 'components/CreditCard';

import { closeFunc, loadFuncParams, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';
import CreditCardTxsList from 'components/CreditCardTxsList';
import PageWrapper from './R00100.style';
import { getBankeeCard, getTransactionPromise, updateTxnNotes } from './api';

/**
 * R00100 信用卡 即時消費明細
 */
const R00100 = () => {
  const dispatch = useDispatch();
  const [cardInfo, setCardInfo] = useState();
  const [transactions, setTransactions] = useState();
  const go2Instalment = () => startFunc(FuncID.R00200, {cardNo: cardInfo.cardNo});

  const fetchTransactions = async (cards) => {
    const transactionsArray = await Promise.all(
      cards.map(({ cardNo }) => getTransactionPromise(cardNo)),
    );
    const flattedTransactions = transactionsArray.flat();
    setTransactions(flattedTransactions);
  };

  // 編輯信用卡明細備註的 Handler
  const onTxnNotesEdit = async (payload) => {
    const { result } = await updateTxnNotes(payload);
    if (result) {
      setTransactions((prevTrans) => prevTrans.map((tran) => {
        // TODO 目前測資回傳 txKey 為空字串，故加入 txDate 一起作為搜尋條件
        const {txDate, txKey, note} = payload;
        if (tran.txDate === txDate && tran.txKey === txKey) return {...tran, note};
        return tran;
      }));
    } else showError('編輯備註失敗');
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let fetchedCardInfo = null;
    const funcParams = await loadFuncParams();

    if (funcParams) {
      fetchedCardInfo = {...funcParams.card, usedCardLimit: funcParams.usedCardLimit};
    } else {
      // 若從更多 (B00600) 頁面進入，會先確認有沒有 bankee 信用卡，
      // 查詢的交易明細就會預設以 bankee 信用卡為主
      const bankeeCardInfo = await getBankeeCard();
      if (bankeeCardInfo) fetchedCardInfo = bankeeCardInfo;
    }

    if (!fetchedCardInfo) {
      await showCustomPrompt({
        message: '您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。',
        onOk: closeFunc,
        onClose: closeFunc,
      });
    }
    fetchTransactions(fetchedCardInfo.cards);
    setCardInfo(fetchedCardInfo);

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="信用卡即時消費明細" goBackFunc={closeFunc}>
      <MainScrollWrapper>
        <PageWrapper>
          <div className="bg-gray">
            <CreditCard
              cardName={cardInfo?.isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
              accountNo={cardInfo?.isBankeeCard ? cardInfo.cards[0].cardNo : ''}
              balance={cardInfo?.usedCardLimit}
              color="green"
              annotation="已使用額度"
            />
          </div>
          <div className="txn-wrapper">
            {!!cardInfo && (
            <CreditCardTxsList
              showAll
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
