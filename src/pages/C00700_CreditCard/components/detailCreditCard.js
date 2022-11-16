/* eslint-disable no-unused-vars */
import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { setModalVisible } from 'stores/reducers/ModalReducer';
import {
  currencySymbolGenerator, stringDateCodeFormatter,
} from 'utilities/Generator';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';
import { TextInputField } from 'components/Fields';

import { updateTxnNotes, getTransactions } from '../api';
import { DetailDialogContentWrapper, TableDialog} from './detailCreditCard.style';
import {
  backInfo, levelInfo, renderBody, renderHead, renderTransactionList,
} from '../utils';
import { validationSchema } from './validationSchema';

/*
* ==================== DetailCard 組件說明 ====================
* 信用卡交易明細組件
* ==================== DetailCard 可傳參數 ====================
* 1. card -> 卡片資料
* 2. onClick -> 更多明細
* */

const DetailCard = ({
  go2MoreDetails,
  card,
}) => {
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const isBankeeCard = card.isBankeeCard === 'Y';
  const {
    control, handleSubmit, reset, getValues,
  } = useForm({
    defaultValues: { notes: {} },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  /**
   * 初始化
   */

  const updateTransactions = async () => {
    const today = new Date();
    const dateEnd = stringDateCodeFormatter(today);
    // 查詢當天至60天前的資料
    const dateBeg = stringDateCodeFormatter(new Date(today - 86400 * 60 * 1000));
    const res = await getTransactions({
      // cardNo: '5232870002109002', // 這個帳號有 transaction 資料
      cardNo: card.cardNo,
      dateBeg,
      dateEnd,
    });
    setTransactions(res);
  };

  const showDialog = (title, info) => {
    showCustomPrompt({
      title,
      message: (
        <TableDialog>
          <table>
            <thead>
              <tr>
                {renderHead(info.title)}
              </tr>
            </thead>
            <tbody>
              { renderBody(info.body)}
            </tbody>
          </table>
          <span className="remark">
            ＊依個人Bankee數存月平均存款餘額核定等級
          </span>
        </TableDialog>
      ),
    });
  };

  const bonusInfo = () => [
    {
      label: '會員等級',
      value: `${card.memberLevel}`,
      iconType: 'Arrow',
      onClick: () => {
        showDialog('會員等級', levelInfo);
      },
    },
    {
      label: '國內/外回饋',
      value: `${card.rewardsRateDomestic}/${card.rewardsRateOverseas}%`,
      iconType: 'Arrow',
      onClick: () => {
        showDialog('國內外回饋', backInfo);
      },
    },
    {
      label: '回饋試算',
      value: `${currencySymbolGenerator('TWD')}${card.rewardsAmount}`,
      iconType: 'Arrow',
      onClick: () => history.push('/C007002', { accountNo: card.cardNo }),
    },
  ];

  //  提交memoText
  const showMemoEditDialog = ({
    note, txDate, txKey,
  }, index) => {
    showCustomPrompt({
      title: '編輯備註',
      message: (
        <TextInputField labelName="備註說明" name={`notes[${index}]`} control={control} />
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

  useEffect(() => {
    updateTransactions();
  }, []);

  return (
    <>
      <DetailDialogContentWrapper>
        {isBankeeCard && (
          <div className="panel">
            <ThreeColumnInfoPanel content={bonusInfo()} />
          </div>
        )}
      </DetailDialogContentWrapper>
      {renderTransactionList({
        transactions,
        showAll: false,
        isBankeeCard,
        showMemoEditDialog,
      })}
      {transactions.length > 3 && (
        <ArrowNextButton onClick={go2MoreDetails}>更多明細</ArrowNextButton>
      )}
      {/* <ArrowNextButton onClick={go2MoreDetails}>更多明細</ArrowNextButton> */}
    </>
  );
};

export default DetailCard;
