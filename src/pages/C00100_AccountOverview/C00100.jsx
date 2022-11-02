/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import uuid from 'react-uuid';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import PieChart from 'components/PieChart';

import { getBalanceInfo } from './api';
import AccountCardList from './components/AccountCardList';

/**
 * C00100 帳戶總覽頁
 */
const AccountOverviewPage = () => {
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState(undefined);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBalanceInfo();
    setAccounts(response);
    dispatch(setWaittingVisible(false));
  }, []);

  // 檢查正資產陣列中的type，若缺少type即加一新物件至陣列
  const addTypeObj = (arr, type) => {
    // 檢查陣列中有無該type
    const found = arr.some((item) => item.type === type);

    // 若無符合該type的物件則新增一陣列物件
    if (!found) {
      arr.push({
        balance: 0,
        purpose: type === 'C' ? 2 : 0,
        accountNo: null,
        alias: '',
        currency: 'TWD',
        type,
        isEmpty: true,
      });
    }

    // 回傳新增後的整個陣列
    return arr;
  };
  const checkAssets = (checkedArr) => ['M', 'F', 'S', 'C'].map((type) => addTypeObj(checkedArr, type)).at(-1);

  /**
   * 產生上方圓餅圖的 slides
   * 因為第一階段可能沒有負資產的功能，所以預設空陣列，仰賴後端回傳的資料，再將其加入陣列中。
   * TODO: 空陣列時？
   */
  const renderSlides = (data) => {
    const slides = [];

    if (data?.assets && data.assets.length > 0) {
      slides.push(<PieChart key={uuid()} label="正資產" data={data.assets.sort((a, b) => b.balance - a.balance)} isCentered />);
    }

    if (data?.debts && data.debts.length > 0) {
      slides.push(<PieChart key={uuid()} label="負資產" data={data.debts.sort((a, b) => b.balance - a.balance)} isCentered />);
    }

    return slides;
  };

  /**
   * 產生下方帳戶資訊的 slides
   * 處理方式同上
   */
  const renderContents = (data) => {
    const slides = [];

    if (data?.assets && data.assets.length > 0) {
      const fullArr = checkAssets(data.assets);
      slides.push(<AccountCardList key={uuid()} data={fullArr} isDebt={false} />);
    }

    if (data?.debts && data.debts.length > 0) {
      slides.push(<AccountCardList key={uuid()} data={data.debts} isDebt />);
    }

    return slides;
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  return (
    <Layout title="帳戶總覽">
      <Main>
        <SwiperLayout slides={renderSlides(accounts)} hasDivider={false}>
          { renderContents(accounts) }
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default AccountOverviewPage;
