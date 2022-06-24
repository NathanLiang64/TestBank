import { useState } from 'react';

import {
  currencySymbolGenerator,
} from 'utilities/Generator';
import * as yup from 'yup';
import { CreateRounded } from '@material-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { switchLoading } from 'utilities/BankeePlus';
import { profileApi } from 'apis';
import uuid from 'react-uuid';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import Dialog from 'components/Dialog';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';

// timeFormatter
import DetailCardWrapper, { DetailDialogContentWrapper } from './detailCreditCard.style';

/*
* ==================== DetailCard 組件說明 ====================
* 交易明細卡片組件
* ==================== DetailCard 可傳參數 ====================
* 1. nickName -> 備註
* 2. transactions -> 交易明細內容
* 3. bonus -> 會員等級/回饋/回饋試算
* 4. onClick -> 更多明細
* */

const DetailCard = ({
  nickName,
  transactions,
  bonus,
  onClick,
}) => {
  const [showChangeNickNameDialog, setShowChangeNickNameDialog] = useState(false);
  const [setNickName] = useState('');

  // Formatter
  // 將日期格式由 YYYYMMDD 字串轉為 MM/DD 字串
  const stringDateFormat = (stringDate) => {
    if (stringDate) {
      const dateArray = stringDate.split('');
      dateArray.splice(0, 4);
      dateArray.splice(2, 0, '/');
      return dateArray.join('');
    }
    return '';
  };
  // 信用卡號顯示後四碼
  // const creditNumberFormat = (stringCredit) => {
  //   if (stringCredit) {
  //     const creditArray = stringCredit.substring(stringCredit.length - 4);
  //     return creditArray;
  //   }
  //   return '';
  // };

  const schema = yup.object().shape({
    nickName: yup
      .string()
      .required('請輸入您的名稱'),
  });

  const {
    handleSubmit, control, formState: { errors }, reset, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    switchLoading(true);
    const param = {
      nickName: data.nickName,
    };
    const response = await profileApi.updateNickName(param);
    console.log(response);
    if (typeof (response) === 'string') {
      setNickName(data.nickName);
      setShowChangeNickNameDialog(false);
    }
    switchLoading(false);
  };

  const renderForm = () => (
    <form id="nickNameForm" onSubmit={handleSubmit(onSubmit)} style={{ paddingBottom: '0' }}>
      <FEIBInputLabel htmlFor="nickName">您的名稱</FEIBInputLabel>
      <Controller
        name="nickName"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput
            {...field}
            type="text"
            id="nickName"
            name="nickName"
            placeholder="請輸入您的名稱"
            error={!!errors.nickName}
          />
        )}
      />
      <FEIBErrorMessage>{errors.nickName?.message}</FEIBErrorMessage>
    </form>
  );

  const renderDialog = () => (
    <Dialog
      isOpen={showChangeNickNameDialog}
      onClose={() => setShowChangeNickNameDialog(false)}
      title="編輯名稱"
      content={renderForm()}
      action={(<FEIBButton type="submit" form="nickNameForm">完成</FEIBButton>)}
    />
  );

  const showEditNickNameDialog = () => {
    reset();
    setValue('nickName', nickName);
    setShowChangeNickNameDialog(true);
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

  // 多餘7筆,就只輸出7筆
  const render = (lists) => {
    const arr = [];
    for (let i = 1; i < 8; i++) {
      const options = (
        <DetailCardWrapper key={uuid()} data-index={lists[i].index} noShadow id={lists[i].id}>
          <div className="description">
            <h4>{lists[i].description}</h4>
            <p>
              {stringDateFormat(lists[i].bizDate)}
              {/* {list.targetCard ? ` | 卡-${creditNumberFormat(list.targetCard)}` : ''} */}
            </p>
          </div>
          <div className="amount">
            {/* 刷卡金額 */}
            <h4>
              {currencySymbolGenerator(lists[i].currency, lists[i].amount)}
            </h4>
            <div className="remark">
              <span>{lists[i].memo}</span>
              <CreateRounded onClick={showEditNickNameDialog} />
              { renderDialog() }
            </div>
          </div>
        </DetailCardWrapper>
      );
      arr.push(options);
    }
    return arr;
  };

  // 信用卡總明細列表
  const renderFunctionList = (lists) => (
    <div>
      {/* 假設資料少等於7筆,就全部輸出 ; 假設資料多餘7筆,就只輸出7筆 */}
      {
      lists.length <= 7 ? (
        lists.map((list) => (
          <DetailCardWrapper
            key={uuid()}
            data-index={list.index}
            noShadow
            id={list.id}
          >
            <div className="description">
              <h4>{list.description}</h4>
              <p>
                {stringDateFormat(list.bizDate)}
                {/* {list.targetCard ? ` | 卡-${creditNumberFormat(list.targetCard)}` : ''} */}
              </p>
            </div>
            <div className="amount">
              {/* 刷卡金額 */}
              <h4>
                {currencySymbolGenerator(list.currency, list.amount)}
              </h4>
              <div className="remark">
                <span>{list.memo}</span>
                <CreateRounded onClick={showEditNickNameDialog} />
                { renderDialog() }
              </div>
            </div>
          </DetailCardWrapper>
        ))
      ) : (render(lists))
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
      {renderFunctionList(transactions)}
      {transactions.length > 7 && <ArrowNextButton onClick={onClick}>更多明細</ArrowNextButton>}
    </>
  );
};

export default DetailCard;
