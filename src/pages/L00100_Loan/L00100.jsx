/* eslint react/no-array-index-key: 0 */

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import AccountCard from 'components/AccountCard';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import InformationList from 'components/InformationList';
import EmptyData from 'components/EmptyData';
import {
  accountFormatter, dateFormatter, stringToDate, currencySymbolGenerator,
} from 'utilities/Generator';

import { getLoanSummary } from './api';
import PageWrapper from './L00100.style';

const uid = uuid();

/**
 * L00100 貸款 首頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loans, setLoans] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getLoanSummary();
    setLoans(response);
    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 產生上卡片的 slides
   */
  const renderSlides = (cards) => {
    if (!cards || cards?.length === 0) return [];

    return cards.map((card, i) => (
      <AccountCard type="L" key={`${uid}-c${i}`}>
        <div>{card.alias ?? '貸款'}</div>
        <div>{accountFormatter(card.accountNo)}</div>
        <div className="justify-end items-baseline gap-4">
          <div>貸款餘額</div>
          <div className="balance">{currencySymbolGenerator(card.currency ?? 'NTD', card.balance)}</div>
        </div>
        <div className="justify-end gap-6 mt-4 divider">
          <button type="button" className="text-16">本期應繳查詢</button>
        </div>
      </AccountCard>
    ));
  };

  /**
   * 產生下方資訊會用到的
   */
  const renderBonusContents = (info) => ([
    { label: '應繳款日', value: `每月${info.cycleTiming}日` },
    { label: '應繳本息', value: currencySymbolGenerator(info.currency ?? 'NTD', info.interest) },
    { label: '可能回饋', value: info.isJoinedRewardProgram ? currencySymbolGenerator(info.currency ?? 'NTD', info.rewards) : '-' },
  ]);

  const renderTransactions = (card) => {
    if (card?.transactions?.length <= 0) {
      return (
        <div style={{ height: '20rem', marginTop: '6rem' }}>
          <EmptyData />
        </div>
      );
    }

    return card.transactions.map((t, i) => (
      <InformationList
        key={`${uid}-t${i}`}
        title="還款金額"
        caption={dateFormatter(stringToDate(t.txnDate))}
        content={currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}
        remark={`貸款餘額 ${currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}`}
      />
    ));
  };

  /**
   * 產生下方交易資訊的 slides
   */
  const renderContents = (cards) => {
    if (!cards || cards?.length === 0) return [];

    return cards.map((card, i) => (
      <PageWrapper key={`${uid}-a${i}`}>
        <ThreeColumnInfoPanel content={renderBonusContents(card.bonusInfo)} />
        <div>{ renderTransactions(card) }</div>
      </PageWrapper>
    ));
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  return (
    <Layout title="貸款" goBackFunc={() => history.goBack()}>
      <Main small>
        <SwiperLayout slides={renderSlides(loans)} hasDivider={false} slidesPerView={1.1} spaceBetween={8} centeredSlides>
          { renderContents(loans) }
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default Page;
