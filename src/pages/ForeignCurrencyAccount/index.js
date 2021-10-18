import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowForwardIos } from '@material-ui/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
// import { getForeignCurrencyAccounts, getTransactionDetails } from 'apis/foreignCurrencyAccountsApi';
import mockData from './mockData';
import ForeignCurrencyAccountWrapper from './foreignCurrencyAccount.style';
import { setSelectedAccount } from './stores/actions';

const ForeignCurrencyAccount = () => {
  const [debitCards, setDebitCards] = useState([]);
  const [details, setDetails] = useState([]);
  const [computedDetails, setComputedDetails] = useState([]);
  const [detailAreaHeight, setDetailAreaHeight] = useState(0);

  const ref = useRef();
  const dispatch = useDispatch();

  const handleChangeSlide = (swiper) => dispatch(setSelectedAccount(debitCards[swiper.activeIndex]));

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
      color="blue"
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
  usePageInfo('/api/foreignCurrencyAccount');

  useEffect(() => {
    /* ========== mock data (for mock api) ========== */
    // getForeignCurrencyAccounts()
    //   .then((data) => setDebitCards(data))
    //   .catch((error) => console.error(error));
    //
    // getTransactionDetails()
    //   .then(({ acctDetails }) => setDetails(acctDetails))
    //   .catch((error) => console.error(error));

    /* ========== mock data (for prototype) ========== */
    const { getForeignCurrencyAccounts, getTransactionDetails } = mockData;
    const { acctDetails } = getTransactionDetails;
    setDebitCards(getForeignCurrencyAccounts);
    setDetails(acctDetails);
  }, []);

  // 取得帳號資料後，計算 transactionDetail DOM 高度
  useEffect(() => {
    if (debitCards.length) {
      const { offsetHeight } = ref.current;
      setDetailAreaHeight(offsetHeight);
      dispatch(setSelectedAccount(debitCards[0]));
    }
  }, [debitCards]);

  // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
  useEffect(() => {
    if (details?.length) {
      const list = [];
      const computedCount = Math.floor((detailAreaHeight - 30) / 80);
      for (let i = 0; i < computedCount; i++) list.push(details[i]);
      setComputedDetails(list);
    }
  }, [details, detailAreaHeight]);

  return (
    <ForeignCurrencyAccountWrapper small $multipleCardsStyle={debitCards.length > 1}>
      <div className="userCardArea">
        { debitCards.length ? renderDebitCard(debitCards) : null }
      </div>
      <div className="transactionDetail" ref={ref}>
        { computedDetails.length ? renderDetailCardList(computedDetails) : null }
        <Link className="moreButton" to="/foreignCurrencyAccountDetails">
          更多明細
          <ArrowForwardIos />
        </Link>
      </div>
    </ForeignCurrencyAccountWrapper>
  );
};

export default ForeignCurrencyAccount;
