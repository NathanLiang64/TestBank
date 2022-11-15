/* eslint-disable no-unused-vars */
import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import uuid from 'react-uuid';

import {
  currencySymbolGenerator, stringDateCodeFormatter,
} from 'utilities/Generator';
import { setModalVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';

import { FEIBIconButton } from 'components/elements';

import { EditIcon } from 'assets/images/icons';
import { showCustomPrompt, showError } from 'utilities/MessageModal';

import { TextInputField } from 'components/Fields';
import { yupResolver } from '@hookform/resolvers/yup';
import { closeFunc } from 'utilities/AppScriptProxy';
import { updateTxnNotes, getTransactions } from '../api';

// timeFormatter
import DetailCardWrapper, { DetailDialogContentWrapper, DetailDialogErrorMsg, TableDialog} from './detailCreditCard.style';
import {
  backInfo, levelInfo, renderBody, renderHead,
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
  // 暫存明細資料
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
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

  // Formatter
  // 將日期格式由 YYYYMMDD 字串轉為 MM/DD 字串
  const stringDateFormat = (stringDate) => {
    if (stringDate) return `${stringDate.slice(4, 6)}/${stringDate.slice(6, 8)}`;
    return '';
  };
  // 信用卡號顯示後四碼
  const creditNumberFormat = (stringCredit) => {
    if (stringCredit) return `${stringCredit.slice(-4)}`;
    return '';
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

  // 信用卡總明細列表
  const renderFunctionList = () => {
    if (!transactions.length) return null;
    const arr = transactions.slice(0, 3); // 至多只輸出三筆資料

    return (
      <div style={{paddingTop: '2.5rem'}}>
        {arr.map((item, index) => (
          <DetailCardWrapper key={uuid()} data-index={index} noShadow id={item.txKey}>
            <div className="description">
              <h4>
                {item.txName}
              </h4>
              <p>
                {item.txDate}
                {card.isBankeeCard === 'N' && ` | 卡-${creditNumberFormat(item.cardNo)}`}
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
  };

  useEffect(() => {
    updateTransactions();
  }, []);

  return (
    <>
      <DetailDialogContentWrapper>
        {card.isBankeeCard === 'Y' && (
          <div className="panel">
            <ThreeColumnInfoPanel content={bonusInfo()} />
          </div>
        )}
      </DetailDialogContentWrapper>
      {renderFunctionList()}
      {transactions.length > 3 && (
        <ArrowNextButton onClick={go2MoreDetails}>更多明細</ArrowNextButton>
      )}
      {/* <ArrowNextButton onClick={onClick}>更多明細</ArrowNextButton> */}
    </>
  );
};

export default DetailCard;
