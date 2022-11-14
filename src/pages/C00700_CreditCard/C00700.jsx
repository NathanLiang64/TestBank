/* eslint-disable no-unused-vars */
import { useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import Main from 'components/Layout';
import CreditCard from 'components/CreditCard';

import { CreditCardIcon5, CreditCardIcon6, CircleIcon } from 'assets/images/icons';
import { setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showCustomDrawer, showError } from 'utilities/MessageModal';

import { closeFunc, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';
import DetailCreditCard from './components/detailCreditCard';
import { getCards, getCreditCards } from './api';
import SwiperCreditCard from './C00700.style';

/**
 * C00700 信用卡 首頁
 */
const CreditCardPage = () => {
  const history = useHistory();
  const [plans, setPlans] = useState();
  const [cards, setCards] = useState();
  const dispatch = useDispatch();
  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // TODO : getCards 應取代 getCreditCards，但目前 getCards 回傳資料不完全
    const response = await getCreditCards();
    const cardResponse = await getCards(); // 若沒有信用卡資訊時，code 還會是0000嗎？
    if (cardResponse.data.length) {
      showError('您尚未持有Bankee信用卡', closeFunc);
    }
    setPlans(response);
    setCards(cardResponse.data);
    dispatch(setWaittingVisible(false));
  }, []);

  // render 功能列表
  const functionAllList = (item) => {
    const list = [
      { fid: '/R00200', title: '晚點付', account: item.account },
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
      { fid: `/${FuncID.R00500}`, icon: <CreditCardIcon5 />, title: '自動扣繳' },
      { fid: '/C007002', icon: <CircleIcon />, title: '每月現金回饋' },
    ];
    const options = (
      <ul>
        {list.map((func) => (
          <li key={uuid()}>
            <button
              type="button"
              onClick={() => {
                if (func.fid.includes(FuncID.R00500)) {
                  startFunc(FuncID.R00500);
                } else {
                  history.push(func.fid, func?.param);
                }
                dispatch(setDrawerVisible(false));
              }}
            >
              {func.icon}
              {func.title}
            </button>
          </li>
        ))}
      </ul>
    );
    showCustomDrawer({ title: '', content: options });
  };

  // 信用卡卡號(產生上方內容的 slides)
  const renderSlides = () => {
    // if (!cardInfo || !cardInfo.cards.length) return null;
    if (!plans || !plans.length) return null;
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
