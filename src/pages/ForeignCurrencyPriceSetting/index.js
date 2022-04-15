import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
  FEIBRadio,
  FEIBRadioLabel,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';
import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import BottomDrawer from 'components/BottomDrawer';
import Header from 'components/Header';

/* Styles */
import ForeignCurrencyPriceSettingWrapper from './foreignCurrencyPriceSetting.style';

const ForeignCurrencyPriceSetting = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    currencyType: yup
      .string()
      .required('請選擇幣別'),
    price: yup
      .number()
      .typeError('匯率須為數字')
      .positive('匯率必須大於 0'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState('');
  // 新增外幣到價通知
  const addPriceSetting = () => {
    setDrawerTitle('新增外幣到價通知');
    setDrawerOpen(true);
  };

  // 編輯外幣到價通知
  const editPriceSetting = () => {
    setDrawerTitle('編輯外幣到價通知');
    setDrawerOpen(true);
  };

  // 刪除外幣到價通知
  const deletePriceSetting = () => {
    console.log('刪除到價通知');
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    handleCloseDrawer();
  };

  const renderForm = () => (
    <ForeignCurrencyPriceSettingWrapper className="drawerContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel>幣別</FEIBInputLabel>
        <Controller
          name="currencyType"
          defaultValue="1"
          control={control}
          render={({ field }) => (
            <FEIBSelect
              {...field}
              id="currencyType"
              name="currencyType"
              error={!!errors.currencyType}
            >
              <FEIBOption value="1">美金 USD</FEIBOption>
            </FEIBSelect>
          )}
        />
        <FEIBErrorMessage>{errors.currencyType?.message}</FEIBErrorMessage>
        <FEIBInputLabel>換匯種類</FEIBInputLabel>
        <Controller
          name="priceType"
          control={control}
          defaultValue="1"
          render={({ field }) => (
            <RadioGroup
              {...field}
              aria-label="換匯種類"
              id="priceType"
              name="priceType"
              defaultValue="1"
              className="groupContainer"
            >
              <FEIBRadioLabel value="1" control={<FEIBRadio />} label="現金匯率" />
              <FEIBRadioLabel value="2" control={<FEIBRadio />} label="即期匯率" />
            </RadioGroup>
          )}
        />
        <FEIBInputLabel>通知匯率</FEIBInputLabel>
        <Controller
          name="price"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="text"
              inputMode="numeric"
              id="price"
              name="price"
              placeholder="請輸入匯率"
              error={!!errors.price}
            />
          )}
        />
        <div className="updateTime">目前匯率：（更新時間：MM/DD HH:MM）</div>
        <FEIBErrorMessage>{errors.price?.message}</FEIBErrorMessage>
        <FEIBButton type="submit">確認</FEIBButton>
      </form>
    </ForeignCurrencyPriceSettingWrapper>
  );

  const renderDrawer = () => (
    <BottomDrawer
      title={drawerTitle}
      isOpen={drawerOpen}
      onClose={handleCloseDrawer}
      content={renderForm()}
    />
  );

  return (
    <>
      <Header title="外幣到價通知" />
      <ForeignCurrencyPriceSettingWrapper>
        <AddNewItem onClick={addPriceSetting} addLabel="新增（最多可設定五筆）" />
        <SettingItem
          mainLable="美金 USD"
          subLabel="匯率：27"
          editClick={editPriceSetting}
          deleteClick={deletePriceSetting}
        />
        { renderDrawer() }
      </ForeignCurrencyPriceSettingWrapper>
    </>
  );
};

export default ForeignCurrencyPriceSetting;
