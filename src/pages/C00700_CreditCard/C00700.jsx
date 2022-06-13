import { useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import Main from 'components/Layout';
import { TransactionIcon1, RadioUncheckedIcon } from 'assets/images/icons';
import { showDrawer } from 'utilities/MessageModal';

import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';

import CreditCard from './components/CreditCard';
import DetailCreditCard from './components/detailCreditCard';

import { getCreditCards } from './api';

/**
 * C00700 信用卡 首頁
 */
const CreditCardPage = () => {
  const history = useHistory();
  const [plans, setPlans] = useState();

  const aa = (data) => {
    data = 3;
    return data;
  };
  /**
   * 會員等級/回饋資訊 參數資訊
   */
  const bonusInfo = [
    {
      label: '會員等級', value: '4', iconType: 'Arrow', onClick: aa('de'),
    },
    {
      label: '國內/外回饋', value: '1.2/3%', iconType: 'Arrow', onClick: aa('de'),
    },
    {
      label: '回饋試算', value: '$39', iconType: 'Arrow', onClick: aa('de'),
    },
  ];

  const functionList = () => {
    const list = [
      { title: '晚點付', path: '/transfer', icon: null },
      { title: '帳單', path: '/transfer', icon: null },
      { title: '繳費', path: '/exchange', icon: null },
    ];
    const options = (
      <ul className="functionList">
        { list.map((func) => (
          func.fid
            ? (
              <li key={func.fid}>
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
    console.log(options);
    return options;
  };

  const handleMoreClick = (plan) => {
    const list = [
      { icon: <RadioUncheckedIcon />, title: '信用卡資訊'},
      { icon: <RadioUncheckedIcon />, title: '自動扣繳'},
      { icon: <TransactionIcon1 />, title: '每月現金回饋' },
    ];
    const options = (
      <ul>
        {list.map((func) => (
          <li key={func.title}>
            <button type="button" onClick={() => func.onClick(plan)}>
              {func.icon}
              {func.title}
            </button>
          </li>
        ))}
      </ul>
    );
    showDrawer('', options);
  };
  /**
   * 產生上方內容的 slides
   */
  useEffect(async () => {
    const response = await getCreditCards();
    setPlans(response);
  });

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
          onMoreClicked={() => handleMoreClick()}
          functionList={functionList()}
        />
      ))
    );
  };
  const renderLists = (data) => {
    if (!data || data.length === 0) return null;
    return (
      plans.map((item) => (
        <DetailCreditCard
          id={item.id}
          index={item.index}
          // inView="1"
          title={item.description}
          date={item.txnDate}
          bizDate={item.bizDate}
          dollarSign={item.currency}
          targetCard="1113456"
          amount={item.amount}
          balance={item.balance}
        />
      ))
    );
  };

  return (
    <Layout title="信用卡" goBackFunc={() => history.goBack()}>
      <Main>
        <SwiperLayout slides={renderSlides(plans)} hasDivider={false} slidesPerView={1.14} spaceBetween={8}>
          <div className="pad">
            {/* 顯示 會員等級/回饋資訊面版 */}
            <ThreeColumnInfoPanel content={bonusInfo} />
            {/* 顯示 明細細項 */}
            {renderLists(plans)}
            <ArrowNextButton onClick={aa}>更多明細</ArrowNextButton>
          </div>
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default CreditCardPage;
