/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { FEIBButton, FEIBHintMessage} from 'components/elements';

import { DropdownField, RadioGroupField, TextInputField } from 'components/Fields';
import { DrawerWrapper } from './E00400.style';
/**
 * 編輯/新增到價通知。
 * @param {{
 *   initData: '初始值'
 *   currencyOptions: '幣別匯率選項'
*   currentTime: '取得幣別匯率的時間'
 *   onSubmit: '完成編輯時的事件'
 * }}
 */
function NoticeEditor({
  initData,
  currencyOptions,
  currentTime,
  onSubmit,
}) {
  const schema = yup.object().shape({
    method: yup.string().required('請選擇種類'),
    currency: yup.string().required('請選擇幣別'),
    direction: yup.string().required('請選擇通知門檻'),
    price: yup.number().required('請輸入匯率').typeError('請輸入數字'),
  });

  const { control, handleSubmit, watch} = useForm({
    resolver: yupResolver(schema),
    defaultValues: initData ?? {
      method: 'srate', currency: '', direction: '', price: '',
    },
  });

  const methodOptions = [{label: '買外幣', value: 'srate'}, {label: '賣外幣', value: 'brate'}];
  const directionOptions = [{label: '高於 (含)', value: '0'}, {label: '低於 (含)', value: '1'}];

  const rateInfo = () => {
    const [method, currency] = watch(['method', 'currency']);
    if (!currency) return null;
    const selectedCurrency = currencyOptions.find(({value}) => value === currency);
    const currentRate = selectedCurrency[method];
    return <FEIBHintMessage>{`目前匯率 ${currentRate} (更新時間 ${currentTime})`}</FEIBHintMessage>;
  };

  return (
    <DrawerWrapper>
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <RadioGroupField name="method" control={control} options={methodOptions} row />

        <div>
          <DropdownField labelName="幣別" name="currency" control={control} options={currencyOptions} />
          {rateInfo()}
        </div>

        <div className="rate-input">
          <DropdownField labelName="通知匯率" name="direction" control={control} options={directionOptions} />
          <TextInputField name="price" control={control} inputProps={{ placeholder: '請輸入價格'}} />
        </div>
        <FEIBButton type="submit">確認</FEIBButton>
      </form>
    </DrawerWrapper>
  );
}

export default NoticeEditor;
