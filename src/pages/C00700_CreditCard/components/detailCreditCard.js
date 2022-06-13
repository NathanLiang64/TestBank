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

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import Dialog from 'components/Dialog';

// timeFormatter
import DetailCardWrapper from './detailCreditCard.style';

// { DetailDialogContentWrapper }

/*
* ==================== DetailCard 組件說明 ====================
* 交易明細卡片組件
* ==================== DetailCard 可傳參數 ====================
* 1. id -> Html DOM 元素 id
* 2. index -> HTML data-index 參數，放置後端撈回的卡片索引值
* 3. inView -> HTML data-inview 參數，顯示卡片是否在畫面可視範圍
* 6. title -> 明細標題
* 7. date -> 交易日期
* 9. bizDate -> 帳務日期
* 10. dollarSign -> 貨幣單位
* 13. targetCard -> 目標帳號的會員 ID
* 14. amount -> 交易金額
* 15. balance -> 交易後所剩餘額
* 16. noShadow -> 卡片不帶陰影樣式
* */

const DetailCard = ({
  id,
  index,
  inView,
  title,
  date,
  dollarSign,
  targetCard,
  amount,
  noShadow,
  nickName,
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
  const creditNumberFormat = (stringCredit) => {
    if (stringCredit) {
      const creditArray = stringCredit.substring(stringCredit.length - 4);
      return creditArray;
    }
    return '';
  };

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

  return (
    <>
      <DetailCardWrapper
        data-index={index}
        data-inview={inView}
        $noShadow={noShadow}
        id={id}
        // onClick={() => setOpenDetailDialog(true)}
      >
        <div className="description">
          <h4>{title}</h4>
          <p>
            {stringDateFormat(date)}
            {targetCard ? ` | 卡-${creditNumberFormat(targetCard)}` : ''}
          </p>
        </div>
        <div className="amount">
          {/* 刷卡金額 */}
          <h4>
            {currencySymbolGenerator(dollarSign, amount)}
          </h4>
          <div className="remark">
            <span>編輯最多七個字</span>
            <CreateRounded onClick={showEditNickNameDialog} />
            { renderDialog() }
          </div>
        </div>
      </DetailCardWrapper>
    </>
  );
};

export default DetailCard;
