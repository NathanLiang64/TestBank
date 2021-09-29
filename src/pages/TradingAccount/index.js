import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowForwardIos } from '@material-ui/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
// import { getTradingAccounts, getTransactionDetails } from 'apis/tradingAccountApi';
import mockData from './mockData';

/* Styles */
import TradingAccountWrapper from './tradingAccount.style';

const TradingAccount = () => {
  const [debitCards, setDebitCards] = useState([]);
  const [details, setDetails] = useState([]);
  const [computedDetails, setComputedDetails] = useState([]);
  const [detailAreaHeight, setDetailAreaHeight] = useState(0);

  const ref = useRef();

  // eslint-disable-next-line no-unused-vars
  const handleChangeSlide = (swiper) => {};

  const renderDetailCardList = (list) => list.map((detail) => (
    <DetailCard
      key={detail.index}
      avatar={detail.avatar}
      title={detail.description}
      type={detail.cdType}
      date={detail.txnDate}
      time={detail.txnTime}
      bizDate={detail.bizDate}
      targetBank={detail.targetBank}
      targetAccount={detail.targetAcct}
      targetMember={detail.targetMbrID}
      dollarSign={detail.currency}
      amount={detail.amount}
      balance={detail.balance}
    />
  ));

  const renderSingleDebitCard = (account) => (
    <DebitCard
      type="original"
      branch={account.acctBranch}
      cardName={account.acctName}
      account={account.acctId}
      balance={account.acctBalx}
      functionList={account.functionList}
      moreList={account.moreList}
      moreDefault={false}
      dollarSign={account.ccyCd}
      color="yellow"
    />
  );

  const renderMultipleDebitCards = (accounts) => (
    <Swiper
      slidesPerView={1.14}
      spaceBetween={8}
      centeredSlides
      pagination
      onSlideChange={handleChangeSlide}
    >
      { accounts.map((account) => (
        <SwiperSlide key={account.id}>
          { renderSingleDebitCard(account) }
        </SwiperSlide>
      )) }
    </Swiper>
  );

  const renderDebitCard = (accounts) => (
    accounts.length > 1
      ? renderMultipleDebitCards(debitCards)
      : renderSingleDebitCard(debitCards[0])
  );

  useCheckLocation();
  usePageInfo('/api/tradingAccount');

  useEffect(() => {
    /* ========== mock data (for mock api) ========== */
    // getTradingAccounts()
    //   .then((data) => setDebitCards(data))
    //   .catch((error) => console.error(error));
    //
    // getTransactionDetails()
    //   .then(({ acctDetails }) => setDetails(acctDetails))
    //   .catch((error) => console.error(error));

    /* ========== mock data (for prototype) ========== */
    const { getTradingAccounts, getTransactionDetails } = mockData;
    setDebitCards(getTradingAccounts);
    setDetails(getTransactionDetails.acctDetails);
  }, []);

  // 取得帳號資料後，計算 transactionDetail DOM 高度
  useEffect(() => {
    if (debitCards.length) {
      const { offsetHeight } = ref.current;
      setDetailAreaHeight(offsetHeight);
    }
  }, [debitCards]);

  // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
  useEffect(async () => {
    if (details.length) {
      const list = [];
      const computedCount = Math.floor((detailAreaHeight - 32) / 80);
      for (let i = 0; i < computedCount; i++) list.push(details[i]);
      setComputedDetails(list);
    }
  }, [details, detailAreaHeight]);

  return (
    <TradingAccountWrapper small $multipleCardsStyle={debitCards.length > 1}>
      <div className="userCardArea">
        { debitCards.length ? renderDebitCard(debitCards) : null }
      </div>
      <div className="transactionDetail" ref={ref}>
        { computedDetails.length ? renderDetailCardList(computedDetails) : null }
        <Link className="moreButton" to="/tradingAccount">
          更多明細
          <ArrowForwardIos />
        </Link>
      </div>
    </TradingAccountWrapper>
  );
};

export default TradingAccount;
