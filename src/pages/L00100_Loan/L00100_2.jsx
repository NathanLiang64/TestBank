/* eslint react/no-array-index-key: 0 */

import { useEffect, useReducer } from 'react';
import { useHistory } from 'react-router';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { accountFormatter, dateToString, currencySymbolGenerator } from 'utilities/Generator';

import SwiperLayout from 'components/SwiperLayout';
import CopyTextIconButton from 'components/CopyTextIconButton';
import AccountCard from 'components/AccountCard';
import Loading from 'components/Loading';
import { MainScrollWrapper } from 'components/Layout';
import { getInfo } from './api';
import PageWrapper from './L00100.style';

/**
 * L00100_2 貸款 資訊頁 (有機會與 L00100 整合再一起，目前先分開)
 */
const Page = (props) => {
  const history = useHistory();
  const {location: {state}} = props;
  const {viewModel } = state;
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const fetchInfo = async (index) => {
    // Note 因為這邊沒有使用 useState，而是直接 mutate viewModel，因此需要 forceUpdate 去強迫渲染
    if (!viewModel.loans[index].info) {
      const {account, subNo} = viewModel.loans[index];
      const response = await getInfo({account, subNo});
      viewModel.loans[index].info = response;
    }
    viewModel.defaultSlide = index;
    forceUpdate();
  };

  const getListing = (d) => ([
    // { title: '貸款類別', content: d.loanType }, TODO: 主機未有資料，暫隱藏
    { title: '貸款期限', content: `${dateToString(d.startDate)}~${dateToString(d.endDate)}` },
    { title: '每期還款日', content: `每月${d.dayToPay}日` },
    { title: '初貸金額', content: currencySymbolGenerator(d.currency ?? 'NTD', d.txAmt, true) },
    { title: '貸款利率', content: `${d.rate}%` },
    { title: '貸款餘額', content: currencySymbolGenerator(d.currency ?? 'NTD', d.loanBalance, true) },
    { title: '已繳期數', content: `${d.periodPaid}期` },
    { title: '剩餘期數', content: `${d.periodRemaining}期` },
  ]);

  /**
   * 產生上方卡片的 slides
   */
  const renderSlides = (cards) => {
    if (!cards || cards?.length === 0) return [];

    const cardsWithEmptySlide = [...cards];
    return cardsWithEmptySlide.map((card) => {
      const branchId = card.debitAccount.substring(0, 3);

      return (
        <AccountCard type="L" key={uuid()}>
          <div className="justify-between items-start">
            <div>
              <div>
                {card.loanType ?? '信用貸款'}
                &nbsp;
                {`(${card.subNo})`}
              </div>
              <div className="justify-between items-center">
                <div>
                  {viewModel.branchCodeList.find((b) => b.branchNo === branchId)?.branchName ?? branchId}
                &nbsp;
                  {`${accountFormatter(card.account, true)}`}
                </div>
                <CopyTextIconButton copyText={card.account} />
              </div>
            </div>
          </div>
          <div className="justify-between items-center">
            <div>貸款餘額</div>
            <div className="balance">{currencySymbolGenerator(card.currency ?? 'NTD', card.balance, true)}</div>
          </div>
        </AccountCard>
      );
    });
  };

  const renderContents = () => {
    if (!viewModel.loans || viewModel.loans?.length === 0) return [];

    return viewModel.loans.map((loan) => (
      <div key={uuid()}>
        { loan.info ? getListing(loan.info).map((d) => (<InformationList key={uuid()} {...d} />))
          : <Loading isCentered space="top" />}
        <p className="remark">提早結清：12個月內結清，收取3%提前還款手續費；超過第12個月起提前還款收取0%手續費。</p>
      </div>
    ));
  };

  useEffect(() => {
    fetchInfo(viewModel.defaultSlide);
  }, []);

  return (
    <Layout title="貸款資訊" goBackFunc={() => history.replace('L00100', {viewModel})}>
      <MainScrollWrapper>
        <PageWrapper>
          <SwiperLayout
            slides={renderSlides(viewModel.loans)}
            hasDivider={false}
            slidesPerView={1.06}
            spaceBetween={8}
            centeredSlides
            onSlideChange={(swiper) => fetchInfo(swiper.activeIndex)}
            initialSlide={viewModel.defaultSlide}
          >
            {renderContents()}
          </SwiperLayout>
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default Page;
