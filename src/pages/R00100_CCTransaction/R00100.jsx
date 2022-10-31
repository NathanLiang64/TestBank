/* eslint react/no-array-index-key: 0 */

import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { currencySymbolGenerator, stringDateCodeFormatter } from 'utilities/Generator';
import { showCustomPrompt } from 'utilities/MessageModal';
import { setWaittingVisible, setModalVisible} from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import InformationTape from 'components/InformationTape';
import BottomAction from 'components/BottomAction';
import EmptyData from 'components/EmptyData';
import Loading from 'components/Loading';
import CreditCard from 'components/CreditCard';
import {
  FEIBIconButton,
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
} from 'components/elements';

import { EditIcon } from 'assets/images/icons';
import { getBasicCCInfo, getTransactions, updateMemo } from './api';
import PageWrapper, { DetailDialogErrorMsg } from './R00100.style';
import Loader from './components/loader';

const uid = uuid();
const endDate = new Date();
const startDate = new Date(endDate);
const limitDate = new Date(endDate);
startDate.setDate(endDate.getDate() - 14);
limitDate.setDate(endDate.getDate() - 60);

// 因為useState是async所以fetchTransactions時transactions有可能是空的
// 因此利用 backlog 變數暫存
let backlog = [];

/**
 * R00100 信用卡 即時消費明細
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [card, setCard] = useState();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState();

  // eslint-disable-next-line no-unused-vars
  const creditNumberFormat = (stringCredit) => {
    if (stringCredit) return `${stringCredit.slice(-4)}`;
    return '';
  };

  const fetchTransactions = async () => {
    if (startDate <= limitDate) return;
    setIsLoading(true);
    startDate.setDate(startDate.getDate() - 15);
    endDate.setDate(endDate.getDate() - 15);

    const response = await getTransactions({
      accountNo: card?.accountNo,
      startDate: stringDateCodeFormatter(startDate),
      endDate: stringDateCodeFormatter(endDate),
    });
    backlog = backlog.concat(response);
    setTransactions(backlog);
    setIsLoading(false);
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;
    const response = await getTransactions({
      accountNo,
      startDate: stringDateCodeFormatter(startDate),
      endDate: stringDateCodeFormatter(endDate),
    });
    backlog = backlog.concat(response);
    setTransactions(backlog);

    if (location.state && ('type' in location.state)) {
      setCard({
        type: location.state.type,
        accountNo,
        creditUsed: location.state.creditUsed,
      });
    } else {
      setCard(await getBasicCCInfo(accountNo));
    }

    dispatch(setWaittingVisible(false));
  }, []);

  //  提交memoText
  const onSubmit = async (index) => {
    const input = document.getElementById(uid).querySelector('input[name="pwd"]');
    const errorMsg = document.getElementById(uid).querySelector('.errorMsg');
    if (input.value.length > 7) {
      errorMsg.style.visibility = 'visible';
      input.parentElement.classList.add('errorBorder');
    } else {
      dispatch(setWaittingVisible(true));
      errorMsg.style.visibility = 'hidden';
      const response = await updateMemo({ id: index, memo: input.value });
      if (response) {
        const tmp = backlog.slice();
        const indexNumber = tmp.findIndex((element) => element.id === index);
        tmp[indexNumber].memo = input.value;
        backlog = tmp;
        setTransactions(backlog);
      }
      dispatch(setModalVisible(false));
      dispatch(setWaittingVisible(false));
    }
  };

  const showMemo = (memo, id) => {
    const EditDialog = () => {
      showCustomPrompt({
        title: '編輯備註',
        message: (
          <div id={uid} style={{ paddingBottom: '2.4rem' }}>
            <FEIBInputLabel htmlFor="memo">備註說明</FEIBInputLabel>
            <DetailDialogErrorMsg>
              <FEIBInput
                name="pwd"
                placeholder="請輸入您的備註"
                defaultValue={memo}
              />
              <FEIBErrorMessage className="errorMsg">
                編輯最多七個字
              </FEIBErrorMessage>
            </DetailDialogErrorMsg>
          </div>
        ),
        noDismiss: true,
        okContent: '完成',
        onOk: () => onSubmit(id),
      });
      dispatch(setModalVisible(true));
    };
    const options = (
      <DetailDialogErrorMsg className="remark">
        <span>{memo.trim()}</span>
        <FEIBIconButton $fontSize={1.6} onClick={() => EditDialog()} className="badIcon">
          <EditIcon />
        </FEIBIconButton>
      </DetailDialogErrorMsg>
    );
    return options;
  };
  console.log('card', card);
  return (
    <Layout title="信用卡即時消費明細" goBackFunc={() => history.goBack()}>
      <MainScrollWrapper>
        <PageWrapper>
          <div className="bg-gray">
            <CreditCard
              key={uuid()}
              cardName={card?.type === 'bankee' ? 'Bankee信用卡' : '所有信用卡'}
              accountNo={card?.type === 'bankee' ? card?.accountNo : ''}
              balance={card?.creditUsed}
              color="green"
              annotation="已使用額度"
            />
          </div>
          <div className="txn-wrapper">
            { card && transactions.length > 0 ? transactions.map((t, i) => (
              <InformationTape
                key={`${uid}-${i}`}
                topLeft={t.description}
                topRight={currencySymbolGenerator(t.currency ?? 'TWD', t.amount)}
                bottomLeft={`${t.txnDate.slice(4, 6)}/${t.txnDate.slice(6, 8)}${card.type === 'all' ? ` | 卡-${creditNumberFormat(t.targetAcct)}` : ''}`}
                bottomRight={showMemo(t.memo, t.id)}
                noShadow
              />
            )) : (
              <div style={{ height: '20rem', marginTop: '6rem' }}>
                <EmptyData />
              </div>
            )}
          </div>
          { isLoading && <Loading isCentered />}
          <div className="note">實際請款金額以帳單為準</div>
          <Loader isLoading={isLoading} fetchTransactions={fetchTransactions} />
          {card?.type === 'bankee' ? (
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
