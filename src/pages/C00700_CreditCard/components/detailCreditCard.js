/* eslint-disable no-unused-vars */
import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import uuid from 'react-uuid';

import {
  currencySymbolGenerator,
} from 'utilities/Generator';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';

import { FEIBIconButton } from 'components/elements';

import { EditIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';

import { TextInputField } from 'components/Fields';
import { updateMemo, updateTxnNotes, getTransactions } from '../api';

// timeFormatter
import DetailCardWrapper, { DetailDialogContentWrapper, DetailDialogErrorMsg, TableDialog} from './detailCreditCard.style';
import { backInfo, levelInfo } from '../utils';

/*
* ==================== DetailCard 組件說明 ====================
* 信用卡交易明細組件
* ==================== DetailCard 可傳參數 ====================
* 1. type -> 卡片種類
* 2. transactions -> 交易明細內容
* 3. bonus -> 會員等級/回饋/回饋試算
* 4. onClick -> 更多明細
* 5. accountNo -> 現金回饋
* */

const uid = uuid();

const DetailCard = ({
  type,
  details,
  bonus,
  onClick,
  account,
}) => {
  // 暫存明細資料
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const {
    control, handleSubmit, reset, getValues,
  } = useForm();
  /**
   * 初始化
   */
  useEffect(async () => {
    // TODO getTransactions API 待完成
    const res = await getTransactions();
    console.log('res', res);
    setTransactions(details);
  }, []);

  // Formatter
  // 將日期格式由 YYYYMMDD 字串轉為 MM/DD 字串
  const stringDateFormat = (stringDate) => {
    if (stringDate) {
      return `${stringDate.slice(4, 6)}/${stringDate.slice(6, 8)}`;
    }
    return '';
  };
  // 信用卡號顯示後四碼
  const creditNumberFormat = (stringCredit) => {
    if (stringCredit) {
      return `${stringCredit.slice(-4)}`;
    }
    return '';
  };

  // 刷卡回饋popup
  const showbackDialog = () => {
    showCustomPrompt({
      title: '國內外回饋',
      message: (
        <TableDialog>
          <table>
            <thead>
              <tr>
                { backInfo.title.map((info) => (
                  <th key={`${uuid()}-head`}>
                    {info}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              { backInfo.body.map((info) => (
                <tr key={`${uuid()}-body`}>
                  <th>{info.level}</th>
                  <th>{info.condition}</th>
                  <th>{info.percentage}</th>
                </tr>
              )) }
            </tbody>
          </table>
          <span className="remark"> ＊依個人Bankee數存月平均存款餘額核定等級 </span>
        </TableDialog>
      ),
      okContent: '回信用卡首頁',
    });
    dispatch(setModalVisible(true));
  };

  // 會員等級表格資訊

  // 會員等級popup
  const showlevelDialog = () => {
    showCustomPrompt({
      title: '會員等級',
      message: (
        <TableDialog>
          <table>
            <thead>
              <tr>
                { levelInfo.title.map((info) => (
                  <th key={`${uuid()}-header`}>{info}</th>
                )) }
              </tr>
            </thead>
            <tbody>
              { levelInfo.body.map((info) => (
                <tr key={`${uuid()}-body`}>
                  <th>{info.level}</th>
                  <th>{info.condition}</th>
                </tr>
              )) }
            </tbody>
          </table>
          <span className="remark">
            ＊依個人Bankee數存月平均存款餘額核定等級
          </span>
        </TableDialog>
      ),
      okContent: '回信用卡首頁',
    });
    dispatch(setModalVisible(true));
  };

  const bonusInfo = () => ([
    {
      label: '會員等級', value: `${bonus.level}`, iconType: 'Arrow', onClick: () => { showlevelDialog(); },
    },
    {
      label: '國內/外回饋', value: `${bonus.rewardLocalRate}/${bonus.rewardForeignRate}%`, iconType: 'Arrow', onClick: () => { showbackDialog(); },
    },
    {
      label: '回饋試算', value: `${currencySymbolGenerator(bonus.currency)}${bonus.rewards}`, iconType: 'Arrow', onClick: () => history.push('/C007002', { accountNo: account }),
    },
  ]);

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

      // TODO API;
      const response = await updateMemo({ id: index, memo: input.value });
      if (response) {
        const indexNumber = transactions.findIndex((element) => element.id === index);
        setTransactions(transactions[indexNumber].memo = input.value);
      }
      dispatch(setModalVisible(false));
      dispatch(setWaittingVisible(false));
    }
  };

  //  提交memoText
  const showMemoEditDialog = (memo = '', id) => {
    // 用form 驗證取得值memo
    showCustomPrompt({
      title: '編輯備註',
      message: (
        <TextInputField labelName="備註說明" name={`notes.${id}`} defaultValue={memo} control={control} />
      ),
      noDismiss: true,
      okContent: '完成',
      onOk: handleSubmit((values) => {
        console.log('values[id]', values.notes[id]);
        // TODO 等待 getTransaction API 完成後進行 updateTxnNotes API 串接
        dispatch(setModalVisible(false));
      }),
      onClose: () => {
        const {notes} = getValues();
        const resetValues = {...notes, [id]: memo};
        reset({notes: resetValues});
      },
    });
  };

  // 多餘3筆,就只輸出3筆
  const render = (lists, types) => {
    const arr = lists.slice(0, 3);
    return arr.map((item, index) => (
      <DetailCardWrapper key={uuid()} data-index={index} noShadow id={item.id}>
        <div className="description">
          <h4>{item.description}</h4>
          <p>
            {stringDateFormat(item.bizDate)}
            {types === 'all' ? ` | 卡-${creditNumberFormat(item.targetAcct)}` : ''}
          </p>
        </div>
        <div className="amount">
          {/* 刷卡金額 */}
          <h4>
            {currencySymbolGenerator(item.currency, item.amount)}
          </h4>
          <div className="remark">
            <span>{item.memo}</span>
            <FEIBIconButton $fontSize={1.6} onClick={() => showMemoEditDialog(item.memo, item.id)} className="badIcon">
              <EditIcon />
            </FEIBIconButton>
          </div>
        </div>
      </DetailCardWrapper>
    ));
  };

  // 信用卡總明細列表
  const renderFunctionList = (lists, types) => (
    <div style={{paddingTop: '2.5rem'}}>
      {
        lists.length > 0 && (render(lists, types))
      }
    </div>
  );

  return (
    <>
      <DetailDialogContentWrapper>
        { !!bonus && (
        <div className="panel">
          <ThreeColumnInfoPanel content={bonusInfo()} />
        </div>
        )}
      </DetailDialogContentWrapper>
      {renderFunctionList(transactions, type)}
      {details.length > 7 && <ArrowNextButton onClick={onClick}>更多明細</ArrowNextButton>}
    </>
  );
};

export default DetailCard;
