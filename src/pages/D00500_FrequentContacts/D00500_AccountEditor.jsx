import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  FEIBButton, FEIBInputLabel, FEIBInput, FEIBErrorMessage, FEIBIconButton,
} from 'components/elements';
import Badge from 'components/Badge';
import Avatar from 'components/Avatar';
import BankCodeInput from 'components/BankCodeInput';
import { accountFormatter } from 'utilities/Generator';

import { ArrowBackIcon, EditIcon } from 'assets/images/icons';
import { getBankCode } from './api';
import { DrawerWrapper } from './D00500.style';

/**
 * 編輯/新增銀行帳號。
 * @param {{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   headshot: '大頭照，只有常用轉入帳戶是Bankee會員才會有值。若為 null 表示沒有頭像。'
 *   readonly: '這些預設資料不可變更，直接進到第二頁；但 bankId, acctId 必需有值。'
 * }} initData
 * @param {Function} onFinished 完成編輯時的事件。
 */
function AccountEditor({
  initData,
  onFinished,
}) {
  const [bankList, setBankList] = useState();
  const [model, setModel] = useState(initData);
  const [confirmPage, setConfirmPage] = useState(false);

  // Form 欄位名稱。
  const idBankNo = 'bankId'; // 銀行代碼。
  const idAcctNo = 'acctId'; // 帳號
  const idNickName = 'nickName'; // 暱稱

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    bankId: yup.string().required('請選擇銀行'),
    acctId: yup.string().required('請輸入帳號').matches(/^(\d{10,14})?$/, '銀行帳號必定是由10~14個數字所組成'),
  });

  /**
   * 表單
   */
  const {
    control, getValues, handleSubmit, formState: { errors }, setValue, trigger,
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: initData,
  });

  /**
   *- 初始化
   */
  useEffect(async () => {
    const banks = await getBankCode();
    setBankList(banks);
  }, []);

  /**
   * 第一頁 - 選銀行及輸入帳號
   */
  const renderPage1 = () => {
    const onSubmit = (values) => {
      setModel({
        ...model,
        ...values,
        bankName: bankList.find((b) => b.bankNo === getValues(idBankNo)).bankName, // 保留選取銀行的名稱
      });
      setConfirmPage(true);
    };
    return (
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <BankCodeInput
            control={control}
            name={idBankNo}
            setValue={setValue}
            trigger={trigger}
            value={getValues(idBankNo)}
            errorMessage={errors.bankId?.message}
          />
        </div>
        <div>
          <FEIBInputLabel htmlFor={idAcctNo}>帳號</FEIBInputLabel>
          <Controller
            control={control}
            name={idAcctNo}
            value={model.acctId}
            render={({ field }) => (
              <FEIBInput
                {...field}
                inputMode="numeric"
                placeholder="請輸入常用的銀行帳號"
                inputProps={{ maxLength: 14, autoComplete: 'off' }}
                error={!!errors?.acctId} // 畫紅底線
              />
            )}
          />
          <FEIBErrorMessage>{errors.acctId?.message}</FEIBErrorMessage>
        </div>

        <FEIBButton type="submit">下一步</FEIBButton>
      </form>
    );
  };

  /**
   * 第二頁 - 輸入暱稱，編輯完成。
   */
  const renderPage2 = () => {
    const onSubmit = (values) => {
      const newModel = {
        ...model,
        headshot: values.headshot,
        nickName: values.nickName,
      };
      onFinished(newModel);
    };
    return (
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Badge>
          <div className="label">帳號</div>
          <div className="text-blue">
            {`${model.bankName} ${accountFormatter(model.acctId)}`}
            <FEIBIconButton className="editButton" $fontSize={1.6} onClick={() => setConfirmPage(false)}>
              <EditIcon onClick={() => setConfirmPage(false)} />
            </FEIBIconButton>
          </div>

        </Badge>
        <div className="flex-col">
          <div className="self-center">
            <Avatar src={model.headshot} name={model.nickName} />
          </div>
          <FEIBInputLabel htmlFor={idNickName}>暱稱</FEIBInputLabel>
          <Controller
            name={idNickName}
            defaultValue={model.nickName}
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                autoComplete="off"
                placeholder="請輸入容易讓您記住此帳號的暱稱"
                inputProps={{ maxLength: 20 }}
                error={!!errors?.nickName} // 畫紅底線
              />
            )}
          />
          <FEIBButton type="submit">完成</FEIBButton>
        </div>
      </form>
    );
  };

  /**
   * HTML輸出。
   */
  return (bankList) ? (

    <DrawerWrapper>
      <FEIBIconButton className="goBack" $fontSize={1.6} onClick={() => setConfirmPage(false)} $hide={!confirmPage}>
        <ArrowBackIcon />
      </FEIBIconButton>
      {confirmPage === false ? renderPage1() : renderPage2()}
    </DrawerWrapper>

  ) : null;
}

/**
 * 預設值：台灣銀行(004)
 */
AccountEditor.defaultProps = {
  initData: { bankId: '', acctId: '', nickName: '' },
  onFinished: null,
};

export default AccountEditor;
