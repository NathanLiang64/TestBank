import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { currencySymbolGenerator, stringDateCodeFormatter } from 'utilities/Generator';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import { setWaittingVisible, setModalVisible} from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import BottomAction from 'components/BottomAction';
import EmptyData from 'components/EmptyData';
import CreditCard from 'components/CreditCard';
import {FEIBIconButton} from 'components/elements';

import { EditIcon } from 'assets/images/icons';
import { getTransactions, updateTxnNotes } from 'pages/C00700_CreditCard/api';
import { TextInputField } from 'components/Fields';
import DetailCardWrapper from 'pages/C00700_CreditCard/components/detailCreditCard.style';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from 'pages/C00700_CreditCard/components/validationSchema';
import PageWrapper, { DetailDialogErrorMsg } from './R00100.style';

/**
 * R00100 信用卡 即時消費明細
 */
const Page = () => {
  const {
    control, handleSubmit, reset, getValues,
  } = useForm({
    defaultValues: { notes: {} },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState([]);

  const creditNumberFormat = (stringCredit) => {
    if (stringCredit) return `${stringCredit.slice(-4)}`;
    return '';
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // eslint-disable-next-line no-unused-vars
    const {accountNo} = location.state;
    const today = new Date();
    const dateEnd = stringDateCodeFormatter(today);
    const dateBeg = stringDateCodeFormatter(new Date(today - 86400 * 60 * 1000)); // 查詢當天至60天前的資料
    const res = await getTransactions({
      // cardNo: accountNo,
      cardNo: '5232870002109002', // hardcode
      dateBeg,
      dateEnd,
    });

    setTransactions(res);
    dispatch(setWaittingVisible(false));
  }, []);

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
          cardNo: '5232870002109002', // TODO 等待 getTransaction API 完成後進行 updateTxnNotes API 串接
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

  const renderFunctionList = () => (
    <div style={{paddingTop: '2.5rem'}}>
      {transactions.map((item, index) => (
        <DetailCardWrapper key={uuid()} data-index={index} noShadow id={item.txKey}>
          <div className="description">
            <h4>
              {item.txName}
            </h4>
            <p>
              {item.txDate}
              {location.state.type === 'all' && ` | 卡-${creditNumberFormat(item.cardNo)}`}
              {/* 原資料沒有 targetAcct 需要透過上層props 提供 term 來判斷 */}
            </p>
          </div>
          <div className="amount">
            {/* 刷卡金額 */}
            <h4>
              {currencySymbolGenerator('NTD', item.amount)}
            </h4>
            <div className="remark">
              <span>{item.note}</span>
              <FEIBIconButton $fontSize={1.6} onClick={() => showMemoEditDialog(item, index)} className="badIcon">
                <EditIcon />
              </FEIBIconButton>
            </div>
          </div>
        </DetailCardWrapper>
      ))}
    </div>
  );

  if (!location.state || !('type' in location.state)) history.goBack();

  return (
    <Layout title="信用卡即時消費明細" goBackFunc={() => history.goBack()}>
      <MainScrollWrapper>
        <PageWrapper>
          <div className="bg-gray">
            <CreditCard
              key={uuid()}
              cardName={location.state.type === 'bankee' ? 'Bankee信用卡' : '所有信用卡'}
              accountNo={location.state.type === 'bankee' ? location.state.accountNo : ''}
              balance={location.state.creditUsed}
              color="green"
              annotation="已使用額度"
            />
          </div>
          <div className="txn-wrapper">
            { transactions.length ? renderFunctionList() : (
              <div style={{ height: '20rem', marginTop: '6rem' }}>
                <EmptyData content="" />
              </div>
            )}
          </div>

          <div className="note">實際請款金額以帳單為準</div>
          {location.state.type === 'bankee' ? (
            <BottomAction position={0}>
              <button type="button">晚點付</button>
            </BottomAction>
          ) : null}
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default Page;
