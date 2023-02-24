import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { showError } from 'utilities/MessageModal';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import BottomAction from 'components/BottomAction';
import CreditCard from 'components/CreditCard';

import { Func } from 'utilities/FuncID';
import CreditCardTxsList from 'components/CreditCardTxsList';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import PageWrapper from './R00100.style';
import { getBankeeCard, getTransactions, updateTxnNotes } from './api';

/**
 * R00100 信用卡 即時消費明細
 */
const R00100 = () => {
  const dispatch = useDispatch();
  const [cardInfo, setCardInfo] = useState();
  const {startFunc, getCurrentFunc} = useNavigation();
  const [transactions, setTransactions] = useState();
  const go2Instalment = () => startFunc(Func.R002.id, {cardNo: cardInfo.cardNo});

  // 編輯信用卡明細備註的 Handler
  const onTxnNotesEdit = async (payload) => {
    const { isSuccess, message } = await updateTxnNotes(payload);
    if (isSuccess) {
      const {txKey, note, cardNo} = payload;
      const txnIndex = transactions.findIndex((txn) => txn.txKey === txKey);
      transactions[txnIndex].note = note;
      setTransactions([...transactions]);

      // 若是從 C00700 頁面進入，則也要連同 keepData 的一起改變
      const {keepData} = getCurrentFunc();
      if (keepData) {
        const {transactionObj, index, cardsInfo} = keepData;
        transactionObj[index] = transactions; // 改變本身卡面的交易明細
        const bankeeCardNo = cardsInfo.find(({isBankeeCard}) => isBankeeCard).cardNo;
        const otherIndex = index === 0 ? 1 : 0; // 另一個卡面的 index
        if (cardNo !== bankeeCardNo || !transactionObj[otherIndex]) return;
        // 若改變的是 bankee 信用卡備註，則另一個卡面的交易明細也要一起變動
        transactionObj[otherIndex].find((txn) => txn.txKey === txKey).note = note;
      }
    } else showError(message);
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let fetchedCardInfo = null;
    let fetchedTransactions = null;
    const funcParams = await loadFuncParams();
    if (funcParams) { // 從信用卡首頁 C00700 進入
      fetchedCardInfo = {...funcParams.card, usedCardLimit: funcParams.usedCardLimit};
      fetchedTransactions = funcParams.transactions;
    } else { // 從更多 B00600 進入 (一定要擁有 bankee 信用卡才進得來)，預設的交易明細以 bankee 信用卡為主
      fetchedCardInfo = await getBankeeCard();
      fetchedTransactions = await getTransactions(fetchedCardInfo.cardNo);
    }
    dispatch(setWaittingVisible(false));

    setCardInfo(fetchedCardInfo);
    setTransactions(fetchedTransactions);
  }, []);

  return (
    <Layout fid={Func.R001} title="信用卡即時消費明細">
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
