import { useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import Main from 'components/Layout';
import { TransactionIcon1, RadioUncheckedIcon } from 'assets/images/icons';
import { showDrawer } from 'utilities/MessageModal';

import CreditCard from './components/CreditCard';
import DetailCreditCard from './components/detailCreditCard';
import { getCreditCards } from './api';

/**
 * C00700 信用卡 首頁
 */
const CreditCardPage = () => {
  const history = useHistory();
  const [plans, setPlans] = useState();

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    const response = await getCreditCards();
    setPlans(response);
  });

  /**
   * 執行指定的單元功能。
   * @param {*} funcCode 功能代碼
   */

  // render 功能列表
  const functionAllList = (item) => {
    const list = [
      { fid: '/D00100', title: '晚點付', account: item.account },
      { fid: '/R00300', title: '帳單', account: item.account },
      { fid: '/R00400', title: '繳費', account: item.account },
    ];
    if (item.type === 'all') {
      list.splice(0, 1);
    }
    const options = (
      <ul className="functionList">
        { list.map((func) => (
          func.fid
            ? (
              <li key={func.fid} onClick={() => history.push(func.fid, { accountNo: func.account })}>
                <p>
                  {func.title}
                </p>
              </li>
            ) : (
              <li>
                <div style={{ color: 'gray' }}>
                  {func.title}
                </div>
              </li>
            )
        )) }
      </ul>
    );
    return options;
  };

  // 信用卡更多
  const handleMoreClick = (item) => {
    const list = [
      {
        fid: '/C007001', icon: <RadioUncheckedIcon />, title: '信用卡資訊', data: item,
      },
      {
        fid: '/withholding', icon: <RadioUncheckedIcon />, title: '自動扣繳', data: item,
      },
      {
        fid: '/C007002', icon: <TransactionIcon1 />, title: '每月現金回饋', data: item,
      },
    ];
    const options = (
      <ul>
        {list.map((func) => (
          <li key={func.title}>
            <button type="button" onClick={() => history.push(func.fid, { details: func.account})}>
              {func.icon}
              {func.title}
            </button>
          </li>
        ))}
      </ul>
    );
    showDrawer('', options);
  };

  // 信用卡卡號(產生上方內容的 slides)
  const renderSlides = (data) => {
    if (!data || data.length === 0) return null;
    return (
      plans.map((item) => (
        <CreditCard
          key={uuid()}
          cardName={item.type === 'bankee' ? 'Bankee信用卡' : '所有信用卡'}
          accountNo={item.accountNo}
          balance={item.expenditure}
          color="green"
          annotation="已使用額度"
          onMoreClicked={handleMoreClick(item)}
          functionList={functionAllList(item)}
        />
      ))
    );
  };

  // 信用卡明細總覽
  const renderCreditList = (data) => {
    if (!data || data.length === 0) return null;
    console.log(data);
    return (
      data.map((item) => (
        <div>
          <DetailCreditCard
            key={uuid()}
            transactions={item.transactions}
            bonus={item?.bonusInfo}
          />
        </div>
      ))
    );
  };

  return (
    <Layout title="信用卡" goBackFunc={() => history.goBack()}>
      <Main>
        <SwiperLayout slides={renderSlides(plans)} hasDivider={false} slidesPerView={1.14} spaceBetween={8}>
          {renderCreditList(plans)}
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default CreditCardPage;
