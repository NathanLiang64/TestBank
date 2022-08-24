/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FEIBButton, FEIBInputLabel, FEIBInput } from 'components/elements';
import { accountFormatter } from 'utilities/Generator';
import Badge from 'components/Badge';
import Avatar from 'components/Avatar';
import BankCodeInput from 'components/BankCodeInput';
import { getBankCode } from './api';
import { DrawerWrapper } from './D00500.style';

/**
 * 編輯/新增銀行帳號。
 * @param {*} initData {
 *   bankId: 常用轉入帳戶-銀行代碼
 *   acctId: 常用轉入帳戶-帳號
 *   bankName: 銀行名稱
 *   nickName: 暱稱
 *   headshot: 大頭照，只有常用轉入帳戶是Bankee會員才會有值。若為 null 表示沒有頭像。
 * }
 * @param {*} onFinished 完成編輯時的事件。
 */
function AccountEditor({
  initData,
  onFinished,
}) {
  const storageItemName = 'BankList';
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
  const { control, getValues, handleSubmit, formState: { errors }, setValue, trigger } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
    defaultValues: initData,
  });

  /**
   *- 初始化
   */
  useEffect(async () => {
    let banks = sessionStorage.getItem(storageItemName);
    try {
      banks = JSON.parse(banks);
    } catch (ex) {
      sessionStorage.removeItem(storageItemName);
      banks = null;
    }

    if (!banks) {
      banks = await getBankCode();
      sessionStorage.setItem(storageItemName, JSON.stringify(banks)); // 暫存入以減少API叫用
    }
    setBankList(banks);
  }, []);

  /**
   * 第一頁 - 選銀行及輸入帳號
   */
  const Page1 = () => {
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
            defaultValue={getValues(idBankNo)}
            errorMessage={errors.bankId?.message}
          />
        </div>
        <div>
          <FEIBInputLabel htmlFor={idAcctNo}>帳號</FEIBInputLabel>
          <Controller
            control={control}
            name={idAcctNo}
            defaultValue={model.acctId}
            render={({ field }) => (
              <FEIBInput
                {...field}
                autoComplete="off"
                inputMode="numeric"
                maxLength="14"
                placeholder="請輸入常用的銀行帳號"
                error={!!errors?.acctId} // 畫紅底線
              />
            )}
          />
        </div>

        <FEIBButton type="submit">下一步</FEIBButton>
      </form>
    );
  };

  /**
   * 第二頁 - 輸入暱稱，編輯完成。
   */
  const Page2 = () => {
    const onSubmit = (values) => {
      const newModel = {
        ...model,
        ...values,
      };
      onFinished(newModel);
    };
    return (
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <Badge>
          <div className="label">帳號</div>
          <div className="text-blue">{`${model.bankName} ${accountFormatter(model.acctId)}`}</div>
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
                maxLength="14"
                placeholder="請輸入容易讓您記住此帳號的暱稱"
                error={!!errors?.nickName} // 畫紅底線
              />
            )}
          />
          <FEIBButton type="submit">完成</FEIBButton>
        </div>
        <FEIBButton type="button" onClick={() => setConfirmPage(false)}>修改</FEIBButton>
      </form>
    );
  };

  /**
   * HTML輸出。
   */
  return (bankList) ? (
    <DrawerWrapper>
      {confirmPage === false ? (<Page1 />) : (<Page2 />)}
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
