/* eslint-disable no-unused-vars */
import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import uuid from 'react-uuid';

import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import { TextInputField } from 'components/Fields';
import ArrowNextButton from 'components/ArrowNextButton';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { currencySymbolGenerator } from 'utilities/Generator';
import { showCustomPrompt, showError } from 'utilities/MessageModal';

import { FEIBIconButton } from 'components/elements';
import { EditIcon } from 'assets/images/icons';
import { updateTxnNotes, getTransactions } from './api';
import { validationSchema } from './validationSchema';
import DetailCardWrapper from './creditCardTxsList.style';
import { creditNumberFormat, getTransactionPromise, stringDateFormat } from './utils';
import { MemoEditForm } from './memoEditForm';

/*
* ==================== TransactionsList 組件說明 ====================
* 信用卡交易明細組件
* ==================== TransactionsList 可傳參數 ====================
* 1. card -> 卡片資料
* 2. go2MoreDetails -> 更多明細
* 3. showAll -> true:顯示所有交易明細, false: 只顯示前三筆
* */

const CreditCardTxsList = ({
  card,
  go2MoreDetails,
  showAll,
}) => {
  const [transactions, setTransactions] = useState();

  const updateTransactions = async () => {
    const transactionsArray = await Promise.all(
      card.cards.map(({ cardNo }) => getTransactionPromise(cardNo)),
    );
    const concatedTransactions = transactionsArray.reduce((acc, cur) => {
      const newArr = acc.concat(cur);
      return newArr;
    }, []);

    setTransactions(concatedTransactions);
  };

  //  提交memoText
  const showMemoEditDialog = async (transaction) => {
    await showCustomPrompt({
      title: '編輯備註',
      message: (
        <MemoEditForm
          defaultValues={transaction}
          updateTransactions={updateTransactions}
        />
      ),
    });
  };

  // 信用卡交易明細列表
  const renderTransactionList = () => {
    if (!transactions) return <Loading space="both" isCentered />;
    if (!transactions.length) return <EmptyData content="查無交易明細" />;

    const transArr = showAll ? transactions : transactions.slice(0, 3); // 至多只輸出三筆資料
    return (
      <div style={{ paddingTop: '2.5rem' }}>
        {transArr.map((transaction, index) => (
          // TODO key 應該改成 transaction.txKey
          <DetailCardWrapper key={uuid()} noShadow>
            <div className="description">
              <h4>{transaction.txName}</h4>
              <p>
                {stringDateFormat(transaction.txDate)}
                {!card.isBankeeCard
                  && ` | 卡-${creditNumberFormat(transaction.cardNo)}`}
              </p>
            </div>
            <div className="amount">
              <h4>{currencySymbolGenerator('NTD', transaction.amount)}</h4>
              <div className="remark">
                <span>{transaction.note}</span>
                <FEIBIconButton
                  $fontSize={1.6}
                  onClick={() => showMemoEditDialog(transaction, index)}
                  className="badIcon"
                >
                  <EditIcon />
                </FEIBIconButton>
              </div>
            </div>
          </DetailCardWrapper>
        ))}
      </div>
    );
  };

  useEffect(() => {
    // 查詢交易明細
    updateTransactions();
  }, []);

  return (
    <>
      {renderTransactionList()}
      {!!go2MoreDetails && transactions?.length > 3 && (
        <ArrowNextButton onClick={go2MoreDetails}>更多明細</ArrowNextButton>
      )}
    </>
  );
};

export default CreditCardTxsList;
