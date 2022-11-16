/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { stringDateCodeFormatter } from 'utilities/Generator';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import { setWaittingVisible, setModalVisible} from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import BottomAction from 'components/BottomAction';
import CreditCard from 'components/CreditCard';

import { getTransactions, updateTxnNotes } from 'pages/C00700_CreditCard/api';
import { TextInputField } from 'components/Fields';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from 'pages/C00700_CreditCard/components/validationSchema';
import { closeFunc, loadFuncParams, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';
import { renderTransactionList } from 'pages/C00700_CreditCard/utils';
import PageWrapper, { DetailDialogErrorMsg } from './R00100.style';

/**
 * R00100 信用卡 即時消費明細
 */
const R00100 = () => {
  const {
    control, handleSubmit, reset, getValues,
  } = useForm({
    defaultValues: { notes: {} },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  const dispatch = useDispatch();
  const [cardInfo, setCardInfo] = useState();
  const [transactions, setTransactions] = useState([]);
  const isBankeeCard = cardInfo?.isBankeeCard === 'Y';

  //  提交memoText
  const showMemoEditDialog = ({
    note, txDate, txKey,
  }, index) => {
    showCustomPrompt({
      title: '編輯備註',
      message: (
        <DetailDialogErrorMsg>
          <TextInputField labelName="備註說明" name={`notes[${index}]`} control={control} />
        </DetailDialogErrorMsg>
      ),
      noDismiss: true,
      okContent: '完成',
      onOk: handleSubmit(async ({notes}) => {
        const updatedResponse = await updateTxnNotes({
          // cardNo: '5232870002109002', // API Bug: getTransaction API 回傳資料沒有 cardNo
          txDate,
          txKey,
          note: notes[index],
        });
        if (updatedResponse?.code === '0000') {
          setTransactions((prevState) => {
            const updatedState = prevState.map((transaction) => {
              if (transaction.txKey === txKey) return { ...transaction, note: notes[index] };
              return transaction;
            });
            return updatedState;
          });
        } else {
          const resetValues = { ...getValues().notes, [index]: note };
          reset({notes: resetValues});
          await showError(updatedResponse.message);
        }
        dispatch(setModalVisible(false));
      }),
      onClose: () => {
        const resetValues = { ...getValues().notes, [index]: note };
        reset({notes: resetValues});
      },
    });
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const funcParams = await loadFuncParams();
    if (funcParams) {
      const {card, usedCardLimit} = funcParams;
      const today = new Date();
      const dateEnd = stringDateCodeFormatter(today);
      const dateBeg = stringDateCodeFormatter(new Date(today - 86400 * 60 * 1000)); // 查詢當天至60天前的資料
      const res = await getTransactions({
        cardNo: card.cardNo,
        dateBeg,
        dateEnd,
      });
      if (res) setTransactions(res);

      setCardInfo({...card, usedCardLimit});
    } else {
      showCustomPrompt({
        message: '您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。',
        onOk: closeFunc,
        onClose: closeFunc,
      });
    }

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="信用卡即時消費明細" goBackFunc={closeFunc}>
      <MainScrollWrapper>
        <PageWrapper>
          <div className="bg-gray">
            <CreditCard
              cardName={isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
              accountNo={isBankeeCard ? cardInfo.cardNo : ''}
              balance={cardInfo?.usedCardLimit}
              color="green"
              annotation="已使用額度"
            />
          </div>
          <div className="txn-wrapper">
            {/* renderTransactionList 與 C00700 的 detailCreditCards 共用 */}
            {renderTransactionList({
              transactions,
              isBankeeCard,
              showAll: true,
              showMemoEditDialog,

            })}
          </div>

          <div className="note">實際請款金額以帳單為準</div>
          {isBankeeCard && (
            <BottomAction position={0}>
              <button type="button" onClick={() => startFunc(FuncID.R00200, {cardNo: cardInfo.cardNo})}>晚點付</button>
            </BottomAction>
          ) }
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default R00100;
