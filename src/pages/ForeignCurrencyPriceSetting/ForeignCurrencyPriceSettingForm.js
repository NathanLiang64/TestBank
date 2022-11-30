import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { closeDrawer } from 'utilities/MessageModal';

import { FEIBButton, FEIBHintMessage } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import { RadioGroupField } from 'components/Fields/radioGroupField';

import { addNotice, updateNotice } from './api';
import ForeignCurrencyPriceSettingWrapper from './foreignCurrencyPriceSetting.style';
import { validationSchema } from './validationSchema';

const ForeignCurrencyPriceSettingForm = ({
  currencyOptions,
  priceTypeOptions,
  getAllPriceNotifications,
  defaultValues,
  isAddAction,
  currentTime,
  findSelectedRate,
}) => {
  const { handleSubmit, control, watch } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const watchedCurrency = watch('currency');

  const onSubmit = async (data) => {
    const param = {
      currency: data.currency,
      price: data.price.toFixed(4),
      exchange_type: Number(data.exchange_type),
    };

    if (isAddAction) await addNotice(param);
    else await updateNotice(defaultValues, param);

    getAllPriceNotifications();
    closeDrawer();
  };

  return (
    <ForeignCurrencyPriceSettingWrapper className="drawerContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DropdownField
          name="currency"
          labelName="幣別"
          options={currencyOptions}
          control={control}
        />

        <RadioGroupField
          name="exchange_type"
          control={control}
          labelName="換匯種類"
          options={priceTypeOptions}
        />

        <TextInputField
          name="price"
          control={control}
          labelName="通知匯率"
          placeholder="請輸入匯率"
          type="number"
        />

        <FEIBHintMessage>
          目前匯率：
          {findSelectedRate(watchedCurrency)}
          （更新時間：
          {currentTime}
          ）
        </FEIBHintMessage>

        <FEIBButton type="submit">確認</FEIBButton>
      </form>
    </ForeignCurrencyPriceSettingWrapper>
  );
};

export default ForeignCurrencyPriceSettingForm;
