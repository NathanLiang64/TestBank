import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import uuid from 'react-uuid';
import { Func } from 'utilities/FuncID';

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
  const [accounts, setAccounts] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBalanceInfo();
    setAccounts(response);
    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 產生上方圓餅圖的 slides
   * 因為第一階段可能沒有負資產的功能，所以預設空陣列，仰賴後端回傳的資料，再將其加入陣列中。
   * 正資產子帳戶只顯示『存錢計畫』
   * TODO: 空陣列時？
   */
  const renderSlides = (data) => {
    const slides = [];

    if (data?.assets?.assetItems && data?.assets?.assetItems.length > 0) {
      // 正資產陣列只保留台幣帳戶/證券帳戶
      let assetList = data.assets.assetItems.filter((account) => ['M', 'S', 'C'].indexOf(account.type) !== -1);
      // 正資產再加入一組由後端換算加總好餘額的外幣帳戶 (目前外幣帳戶幣別都不是新台幣 所以不能直接加總)
      // TODO：可要求API直接將assetItems回傳餘額換算好的外幣帳戶 這樣就可以將原始陣列直接帶入圓餅圖
      assetList = assetList.filter((account) => account.type !== 'F');
      assetList.push({ type: 'F', balance: data.assets?.totalBalanceF2N });

      slides.push(<PieChart key={uuid()} label="正資產" data={assetList.sort((a, b) => b.balance - a.balance)} isCentered />);
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

    if (data?.assets?.assetItems && data?.assets?.assetItems.length > 0) {
      slides.push(
        <AccountCardList
          key={uuid()}
          data={data.assets.assetItems}
          isDebt={false}
          necessaryType={['M', 'S', 'F']}
          totalBalanceF2N={data.assets.totalBalanceF2N}
        />,
      );
    }

    if (data?.debts && data.debts.length > 0) {
      slides.push(<AccountCardList key={uuid()} data={data.debts} isDebt necessaryType={['CC', 'L']} />);
    }

    return slides;
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  return (
    <Layout fid={Func.C001} title="帳戶總覽">
      <Main>
        <SwiperLayout slides={renderSlides(accounts)} hasDivider={false}>
          { renderContents(accounts) }
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default AccountOverviewPage;
