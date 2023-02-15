/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton} from 'components/elements';

import { DropdownField, RadioGroupField, TextInputField } from 'components/Fields';
import { DrawerWrapper } from './E00400.style';
/**
 * 編輯/新增銀行帳號。
 * @param {{
 *   bankId: '常用轉入帳戶-銀行代碼'
 *   acctId: '常用轉入帳戶-帳號'
 *   bankName: '銀行名稱'
 *   nickName: '暱稱'
 *   headshot: '代表圖檔的UUID，用來顯示大頭貼；若為 null 表示還沒有設定頭像。'
 * }} initData
 * @param {Function} onFinished 完成編輯時的事件。
 */
function AccountEditor({
  initData, // 有預設 acctId 時，會直接開在第二頁，而且不能回到第一頁！
  onFinished,
}) {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    currency: yup.string().required('請選擇幣別'),
    type: yup.string().required('請選擇換匯種類'),
    criteria: yup.string().required('請選擇通知門檻'),
    rate: yup.string().required('請輸入匯率').matches(/^\d+(\.\d+)?$/, '請輸入數字'),
  });

  /**
   * 表單
   */
  const { control, handleSubmit} = useForm({
    resolver: yupResolver(schema),
    defaultValues: initData ?? {
      currency: '',
      type: '1',
      criteria: '',
      rate: '',
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (

    <DrawerWrapper>
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <DropdownField
          labelName="幣別"
          name="currency"
          control={control}
          options={[]}
        />

        <RadioGroupField
          labelName="換匯種類"
          name="type"
          control={control}
          options={[{label: '現金匯率', value: '1'}, {label: '即期匯率', value: '2'}]}
          row
        />

        <div className="rate-input">
          <DropdownField
            labelName="通知匯率"
            name="criteria"
            control={control}
            options={[{label: '低於 (含)', value: 'lower'}, {label: '高於', value: 'higher'}]}
          />

          <TextInputField
            name="rate"
            control={control}
            inputProps={{ placeholder: '請輸入匯率'}}
          />
        </div>

        <FEIBButton type="submit">確認</FEIBButton>
      </form>
    </DrawerWrapper>

  );
}

export default AccountEditor;
