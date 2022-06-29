import { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import {
  currencySymbolGenerator,
} from 'utilities/Generator';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';
import {
  FEIBIconButton,
  FEIBInputLabel,
  FEIBInput,
  FEIBErrorMessage,
} from 'components/elements';

import { EditIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';
import { updateMemo } from '../api';

// timeFormatter
import DetailCardWrapper, { DetailDialogContentWrapper, DetailDialogErrorMsg } from './detailCreditCard.style';

/*
* ==================== DetailCard 組件說明 ====================
* 信用卡交易明細組件
* ==================== DetailCard 可傳參數 ====================
* 1. type -> 卡片種類
* 2. transactions -> 交易明細內容
* 3. bonus -> 會員等級/回饋/回饋試算
* 4. onClick -> 更多明細
* */

const uid = uuid();

const DetailCard = ({
  type,
  details,
  bonus,
  onClick,
}) => {
  // 暫存明細資料
  const [transactions, setTransactions] = useState([]);
  const dispatch = useDispatch();
  /**
   * 初始化
   */
  useEffect(() => {
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

  const bonusInfo = () => ([
    {
      label: '會員等級', value: `${bonus.level}`, iconType: 'Arrow',
    },
    {
      label: '國內/外回饋', value: `${bonus.rewardLocalRate}/${bonus.rewardForeignRate}%`, iconType: 'Arrow',
    },
    {
      label: '回饋試算', value: `${bonus.rewards}`, iconType: 'Arrow',
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
  const showMemoEditDialog = (memo, id) => {
    // 用form 驗證取得值memo
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

  // 多餘7筆,就只輸出7筆
  const render = (lists, types) => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      if (!lists[i]?.index) {
        break;
      } else {
        const options = (
          <DetailCardWrapper key={uuid()} data-index={lists[i].index} noShadow id={lists[i].id}>
            <div className="description">
              <h4>{lists[i].description}</h4>
              <p>
                {stringDateFormat(lists[i].bizDate)}
                {types === 'all' ? ` | 卡-${creditNumberFormat(lists[i].targetCard)}` : ''}
              </p>
            </div>
            <div className="amount">
              {/* 刷卡金額 */}
              <h4>
                {currencySymbolGenerator(lists[i].currency, lists[i].amount)}
              </h4>
              <div className="remark">
                <span>{lists[i].memo}</span>
                <FEIBIconButton $fontSize={1.6} onClick={() => showMemoEditDialog(lists[i].memo, lists[i].id)} className="badIcon">
                  <EditIcon />
                </FEIBIconButton>
              </div>
            </div>
          </DetailCardWrapper>
        );
        arr.push(options);
      }
    }
    return arr;
  };

  // 信用卡總明細列表
  const renderFunctionList = (lists, types) => (
    <div>
      {
        lists.length > 0 && (render(lists, types))
      }
    </div>
  );

  return (
    <>
      <DetailDialogContentWrapper>
        <div className="panel">
          {!!bonus && <ThreeColumnInfoPanel content={bonusInfo()} />}
        </div>
      </DetailDialogContentWrapper>
      {renderFunctionList(transactions, type)}
      {details.length > 7 && <ArrowNextButton onClick={onClick}>更多明細</ArrowNextButton>}
    </>
  );
};

export default DetailCard;
