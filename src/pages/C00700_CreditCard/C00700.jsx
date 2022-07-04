import { useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import Main from 'components/Layout';
import CreditCard from 'components/CreditCard';

import { CreditCardIcon5, CreditCardIcon6, CircleIcon } from 'assets/images/icons';
import { showDrawer } from 'utilities/MessageModal';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import DetailCreditCard from './components/detailCreditCard';
import { getCreditCards } from './api';
import SwiperCreditCard from './C00700.style';

/**
 * C00700 信用卡 首頁
 */
const CreditCardPage = () => {
  const history = useHistory();
  const [plans, setPlans] = useState();
  const dispatch = useDispatch();

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getCreditCards();
    setPlans(response);
    dispatch(setWaittingVisible(false));
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
              <li key={uuid()}>
                <button type="button" onClick={() => history.push(func.fid, { accountNo: func.account })}>
                  {func.title}
                </button>
              </li>
            ) : (
              <li key={uuid()}>
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
  const handleMoreClick = (card) => {
    const list = [
      {
        fid: '/C007001', icon: <CreditCardIcon6 />, title: '信用卡資訊', param: card,
      },
      { fid: '/withholding', icon: <CreditCardIcon5 />, title: '自動扣繳' },
      { fid: '/C007002', icon: <CircleIcon />, title: '每月現金回饋' },
    ];
    const options = (
      <ul>
        {list.map((func) => (
          <li key={uuid()}>
            <button type="button" onClick={() => history.push(func.fid, func?.param)}>
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
        <SwiperCreditCard>
          <CreditCard
            key={uuid()}
            cardName={item.type === 'bankee' ? 'Bankee信用卡' : '所有信用卡'}
            accountNo={item.type === 'bankee' && item.accountNo}
            balance={item.creditUsed}
            color="green"
            annotation="已使用額度"
            onMoreClicked={() => handleMoreClick(item)}
            functionList={functionAllList(item)}
          />
        </SwiperCreditCard>
      ))
    );
  };

  // 信用卡明細總覽
  const renderCreditList = (data) => {
    if (!data || data.length === 0) return null;
    return (
      data.map((item) => (
        <div key={uuid()}>
          <DetailCreditCard
            details={item.transactions}
            bonus={item?.bonusInfo}
            onClick={() => history.push('R00100', item)}
            type={item.type}
            account={item.accountNo}
          />
        </div>
      ))
    );
  };

  return (
    <Layout title="信用卡" goBackFunc={() => history.goBack()}>
      <Main small>
        <SwiperLayout slides={renderSlides(plans)} hasDivider={false} slidesPerView={1.06}>
          {renderCreditList(plans)}
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default CreditCardPage;
