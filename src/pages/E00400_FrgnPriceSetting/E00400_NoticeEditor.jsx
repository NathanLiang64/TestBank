import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import theme from 'themes/theme';

import { FEIBButton } from 'components/elements';
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
    currency: yup.string().required('請選擇幣別'),
    direction: yup.number().required('').typeError(''),
    price: yup.number().required('請輸入價格').typeError('請輸入數字'),
    bidAsk: yup.number().required('請輸入設定類型'),
  });

  const {
    control, handleSubmit, watch, reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currency: '',
      direction: '1',
      price: '',
      ...initData, // 若 initData 有值，會覆蓋掉 currency/direction/price
      // NOTE initData 的 bidAsk 可能會是 number，但是傳入 radioGroup 的值必須數 string，因此要覆蓋掉原本的值
      bidAsk: (!initData || initData.direction) ? '1' : '2',
    },
  });

  const rateInfo = () => {
    const [bidAsk, currency] = watch(['bidAsk', 'currency']);
    if (!currency || !bidAsk) return null;
    const selectedCurrency = currencyOptions.find(({value}) => value === currency);
    const currentRate = selectedCurrency[bidAsk === '1' ? 'srate' : 'brate']; // TODO
    return `目前匯率 ${currentRate} (更新時間 ${currentTime})`;
  };

  const onBidAskChange = (e) => {
    const dir = e.target.value === '1' ? 1 : 0;
    reset((formValues) => ({...formValues, bidAsk: e.target.value, direction: dir}));
  };

  return (
    <DrawerWrapper>
      <form className="flex-col" onSubmit={handleSubmit(onSubmit)}>
        <RadioGroupField
          name="bidAsk"
          control={control}
          options={[{label: '買外幣', value: '1'}, {label: '賣外幣', value: '2'}]}
          onChange={onBidAskChange}
          row
        />

        <DropdownField
          labelName="幣別"
          name="currency"
          control={control}
          options={currencyOptions}
          annotation={rateInfo()}
        />

        <div className="rate-input">
          <DropdownField
            labelName="通知匯率"
            name="direction"
            control={control}
            options={[{label: '高於 (含)', value: 0}, {label: '低於 (含)', value: 1}]}
            $color={theme.colors.primary.brand}
            inputProps={{disabled: true}}
          />

          <TextInputField
            name="price"
            control={control}
            inputProps={{ placeholder: '請輸入價格'}}
          />
        </div>
        <FEIBButton type="submit">確認</FEIBButton>
      </form>
    </DrawerWrapper>
  );
}

export default NoticeEditor;
