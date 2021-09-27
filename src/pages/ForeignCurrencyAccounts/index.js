import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowForwardIos } from '@material-ui/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
// import { getForeignCurrencyAccounts, getTransactionDetails } from 'apis/foreignCurrencyAccountsApi';
import mockData from './mockData';

/* Styles */
import ForeignCurrencyAccountsWrapper from './foreignCurrencyAccounts.style';

const ForeignCurrencyAccounts = () => {
  const [debitCards, setDebitCards] = useState([]);
  const [details, setDetails] = useState([]);
  const [computedDetails, setComputedDetails] = useState([]);
  const [detailAreaHeight, setDetailAreaHeight] = useState(0);

  const ref = useRef();

  // eslint-disable-next-line no-unused-vars
  const handleChangeSlide = (swiper) => {};

  const renderDetailCardList = (list) => (
    list.map((detail) => (
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
    ))
  );

  const renderDebitCard = (accounts) => accounts.map((account) => (
    <SwiperSlide key={account.id}>
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
    </SwiperSlide>
  ));

  useCheckLocation();
  usePageInfo('/api/foreignCurrencyAccounts');

  useEffect(() => {
    /* ========== mock data (for mock api) ========== */
    // getForeignCurrencyAccounts()
    //   .then((data) => setDebitCards(data))
    //   .catch((error) => console.error(error))
    //
    // getTransactionDetails()
    //   .then(({ acctDetails }) => setDetails(acctDetails))
    //   .catch((error) => console.error(error))

    /* ========== mock data (for prototype) ========== */
    const { getForeignCurrencyAccounts, getTransactionDetails } = mockData;
    setDebitCards(getForeignCurrencyAccounts);
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
    <ForeignCurrencyAccountsWrapper>
      <div className="userCardArea">
        <Swiper
          slidesPerView={1.14}
          spaceBetween={8}
          centeredSlides
          pagination
          onSlideChange={handleChangeSlide}
        >
          { debitCards.length ? renderDebitCard(debitCards) : null }
        </Swiper>
      </div>
      <div className="transactionDetail" ref={ref}>
        { computedDetails.length ? renderDetailCardList(computedDetails) : null }
        <Link className="moreButton" to="/foreignCurrencyAccounts">
          更多明細
          <ArrowForwardIos />
        </Link>
      </div>
    </ForeignCurrencyAccountsWrapper>
  );
};

export default ForeignCurrencyAccounts;
