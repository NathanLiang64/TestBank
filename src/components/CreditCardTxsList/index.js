/* eslint-disable no-unused-vars */
import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { setModalVisible } from 'stores/reducers/ModalReducer';
import { currencySymbolGenerator } from 'utilities/Generator';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import ArrowNextButton from 'components/ArrowNextButton';
import { TextInputField } from 'components/Fields';

import EmptyData from 'components/EmptyData';
import uuid from 'react-uuid';

import { FEIBIconButton } from 'components/elements';
import { EditIcon } from 'assets/images/icons';
import { updateTxnNotes, getTransactions } from './api';
import { validationSchema } from './validationSchema';
import DetailCardWrapper from './CreditCardTxsList.style';
import { creditNumberFormat, getTransactionPromise, stringDateFormat } from './utils';

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
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();

  const {
    control, handleSubmit, reset, getValues,
  } = useForm({
    defaultValues: { notes: {} },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  //  提交memoText
  const showMemoEditDialog = ({
    note, txDate, txKey, cardNo,
  }, index) => {
    showCustomPrompt({
      title: '編輯備註',
      message: (
        <TextInputField
          labelName="備註說明"
          name={`notes[${index}]`}
          control={control}
        />
      ),
      noDismiss: true,
      okContent: '完成',
      onOk: handleSubmit(async ({ notes }) => {
        const updatedResponse = await updateTxnNotes({
          cardNo,
          txDate: stringDateFormat(txDate),
          txKey,
          note: notes[index],
        });

        if (updatedResponse?.code === '0000') {
          setTransactions((prevState) => {
            const updatedState = prevState.map((transaction) => {
              if (transaction.txKey === txKey) { return { ...transaction, note: notes[index] }; }
              return transaction;
            });
            return updatedState;
          });
        } else {
          const resetValues = { ...getValues().notes, [index]: note };
          reset({ notes: resetValues });
          await showError(updatedResponse.message);
        }
        dispatch(setModalVisible(false));
      }),
      onClose: () => {
        const resetValues = { ...getValues().notes, [index]: note };
        reset({ notes: resetValues });
      },
    });
  };

  // 信用卡交易明細列表
  const renderTransactionList = () => {
    if (!transactions.length) {
      return (
        <div style={{ marginTop: '10rem' }}>
          <EmptyData content="查無交易明細" />
        </div>
      );
    }
    const arr = showAll ? transactions : transactions.slice(0, 3); // 至多只輸出三筆資料

    return (
      <div style={{ paddingTop: '2.5rem' }}>
        {arr.map((transaction, index) => (
          <DetailCardWrapper
            key={uuid()}
            data-index={index}
            noShadow
            id={transaction.txKey}
          >
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

  // 查詢交易明細
  useEffect(async () => {
    const transactionsArray = await Promise.all(
      card.cards.map(({cardNo}) => getTransactionPromise(cardNo)),
    );
    const concatedTransactions = transactionsArray.reduce((acc, cur) => {
      const newArr = acc.concat(cur);
      return newArr;
    }, []);

    setTransactions(concatedTransactions);
  }, []);

  return (
    <>
      {renderTransactionList()}
      {!!go2MoreDetails && transactions.length > 3 && (
        <ArrowNextButton onClick={go2MoreDetails}>更多明細</ArrowNextButton>
      )}
      {/* <ArrowNextButton onClick={go2MoreDetails}>更多明細</ArrowNextButton> */}
    </>
  );
};

export default CreditCardTxsList;
