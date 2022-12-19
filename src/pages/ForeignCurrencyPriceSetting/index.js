import { useEffect, useMemo, useState } from 'react';
import { CurrencyInfo, datetimeToString } from 'utilities/Generator';
import { showCustomDrawer } from 'utilities/MessageModal';

import AddNewItem from 'components/AddNewItem';
import SettingItem from 'components/SettingItem';
import Layout from 'components/Layout/Layout';

import { getAllNotices, removeNotice, getCcyList } from './api';
import ForeignCurrencyPriceSettingWrapper from './foreignCurrencyPriceSetting.style';
import ForeignCurrencyPriceSettingForm from './ForeignCurrencyPriceSettingForm';

const ForeignCurrencyPriceSetting = () => {
  const [currencyInfo, setCurrencyInfo] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const priceTypeOptions = [{label: '現金匯率', value: '0'}, {label: '即期匯率', value: '1'}];
  const currentTime = datetimeToString(new Date());
  const currencyOptions = useMemo(() => {
    if (!currencyInfo.length) return [];
    return currencyInfo.map(({ccyCd, ccyName}) => ({label: ccyName, value: ccyCd}));
  }, [currencyInfo]);

  // 取得所有已設定外幣到價通知列表
  const getAllPriceNotifications = async () => {
    const response = await getAllNotices();
    setNotificationList(response);
  };

  // 刪除外幣到價通知
  const deletePriceSetting = async (data) => {
    const param = {
      currency: data.currency,
      price: data.price,
      exchange_type: data.exchange_type,
    };
    await removeNotice(param);
    getAllPriceNotifications();
  };

  const findSelectedRate = (currency) => currencyInfo.find((item) => item.ccyCd === currency)?.sellRate;

  // 跳出新增/編輯外幣到價通知設定彈窗
  const showPriceSettingDrawer = (data) => {
    const isAddAction = !data; // 如有給 data 就是編輯模式，反之則為新增模式
    const defaultValues = {
      currency: isAddAction ? 'USD' : data.currency,
      price: isAddAction ? '' : data.price,
      exchange_type: isAddAction ? '0' : String(data.exchange_type),
      // exchange_type 在 RadioGroupField 的 value 必須為 string，
      // 因此先轉成 string 傳入，後續要 submit 之前會再轉為 number
    };

    showCustomDrawer({
      title: `${isAddAction ? '新增' : '編輯'}外幣到價通知`,
      content: (
        <ForeignCurrencyPriceSettingForm
          currentTime={currentTime}
          isAddAction={isAddAction}
          defaultValues={defaultValues}
          currencyOptions={currencyOptions}
          priceTypeOptions={priceTypeOptions}
          findSelectedRate={findSelectedRate}
          getAllPriceNotifications={getAllPriceNotifications}
        />
      ),
    });
  };

  const renderNotiList = () => (
    notificationList.map((item) => {
      const currency = CurrencyInfo.find((el) => el.code === item.currency);
      return (
        <SettingItem
          key={item.createTime}
          mainLable={`${currency.name} ${currency.symbol}`}
          subLabel={`匯率：${item.price}`}
          editClick={() => showPriceSettingDrawer(item)}
          deleteClick={() => deletePriceSetting(item)}
        />
      );
    })
  );

  useEffect(async () => {
    // 載入所有已設定的通知。
    getAllPriceNotifications();
    // 取得外幣列表
    const ccyList = await getCcyList();
    if (ccyList) setCurrencyInfo(ccyList);
  }, []);

  return (
    <Layout title="外幣到價通知">
      <ForeignCurrencyPriceSettingWrapper>
        {
          notificationList.length < 5 && (
            <AddNewItem onClick={() => showPriceSettingDrawer()} addLabel="新增（最多可設定五筆）" />
          )
        }
        { renderNotiList() }
      </ForeignCurrencyPriceSettingWrapper>
    </Layout>
  );
};

export default ForeignCurrencyPriceSetting;
