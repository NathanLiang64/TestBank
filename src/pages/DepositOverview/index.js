import { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowForwardIos, SyncAltRounded } from '@material-ui/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCheckLocation, usePageInfo } from 'hooks';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import { getTransactionDetails } from 'apis/depositOverviewApi';
import {
  setDebitCards, setSelectedAccount, setTransactionDetails, setTransactionMonthly,
} from './stores/actions';
import mockData from './mockData';
import DepositOverviewWrapper from './depositOverview.style';

const DepositOverview = () => {
  const debitCards = useSelector(({ depositOverview }) => depositOverview.debitCards);
  const selectedAccount = useSelector(({ depositOverview }) => depositOverview.selectedAccount);
  const txnDetails = useSelector(({ depositOverview }) => depositOverview.txnDetails);

  const [detailAreaHeight, setDetailAreaHeight] = useState(0);
  const [interestPanel, setInterestPanel] = useState({ title: '', content: '' });
  const [computedDetails, setComputedDetails] = useState([]);

  const detailsRef = useRef();
  const dispatch = useDispatch();
  const { push } = useHistory();

  const handleChangeSlide = (swiper) => dispatch(setSelectedAccount(debitCards[swiper.activeIndex]));

  const handleClickInterestRatePanel = () => {
    const { interest, interestRate } = selectedAccount;
    if (interestPanel.title === '優惠利率') {
      setInterestPanel({ title: '累積利息', content: `$${interest}` });
    } else {
      setInterestPanel({ ...interestPanel, title: '優惠利率', content: `${interestRate}%` });
    }
  };

  const renderDetailCardList = (list) => (
    list.map((card) => (
      <DetailCard
        key={card.index}
        avatar={card.avatar}
        title={card.description}
        type={card.cdType}
        date={card.txnDate}
        time={card.txnTime}
        bizDate={card.bizDate}
        targetBank={card.targetBank}
        targetAccount={card.targetAcct}
        targetMember={card.targetMbrID}
        dollarSign={card.currency}
        amount={card.amount}
        balance={card.balance}
      />
    ))
  );

  const renderSingleDebitCard = (account) => (
    <DebitCard
      type="original"
      branch={account.acctBranch}
      cardName={account.acctName}
      account={account.acctId}
      balance={account.acctBalx}
      dollarSign={account.ccyCd}
      functionList={account.functionList}
      moreList={account.moreList}
      color="purple"
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

  const renderInfoPanel = (info, title, content) => {
    const { interbankWithdrawal, interbankTransfer, interestRateLimit } = info;
    return (
      <div className="infoPanel">
        <div className="panelItem">
          <h3>免費跨提/轉</h3>
          <p>
            {interbankWithdrawal}
            /
            {interbankTransfer}
          </p>
        </div>
        <div className="panelItem customPosition" onClick={handleClickInterestRatePanel}>
          <h3>
            {title}
            <SyncAltRounded />
          </h3>
          <p>{content}</p>
        </div>
        <div className="panelItem" onClick={() => push('/depositPlus')}>
          <h3>
            優惠利率額度
            <ArrowForwardIos />
          </h3>
          <p>{interestRateLimit}</p>
        </div>
      </div>
    );
  };

  useCheckLocation();
  usePageInfo('/api/depositOverview');

  // 首次加載時取得用戶所有帳號
  useEffect(async () => {
    // TODO: for demo, remove mock data
    // getAccounts().then((response) => dispatch(setDebitCards(response));

    // TODO: for demo, add debitCards data from mock data (db.json)
    const { getAccounts } = mockData;
    dispatch(setDebitCards(getAccounts));
  }, []);

  // 取得帳號資料後，計算 transactionDetail DOM 高度
  useEffect(() => {
    if (debitCards?.length) {
      const { offsetHeight } = detailsRef?.current;
      setDetailAreaHeight(offsetHeight);
      dispatch(setSelectedAccount(debitCards[0]));
    }
  }, [debitCards]);

  // 根據當前帳戶取得交易明細資料及優惠利率數字
  useEffect(() => {
    if (selectedAccount) {
      const requestData = { account: selectedAccount.acctId };
      getTransactionDetails(requestData)
        .then(({ monthly, acctDetails }) => {
          dispatch(setTransactionMonthly(monthly));
          dispatch(setTransactionDetails(acctDetails));
        });

      const { interestRate } = selectedAccount;
      setInterestPanel({ ...interestPanel, title: '優惠利率', content: `${interestRate}%` });
    }
  }, [selectedAccount]);

  // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
  useEffect(async () => {
    if (txnDetails?.length) {
      const list = [];
      const computedCount = Math.floor((detailAreaHeight - 30) / 80);
      for (let i = 0; i < computedCount; i++) list.push(txnDetails[i]);
      setComputedDetails(list);
    }
  }, [txnDetails, detailAreaHeight]);

  return (
    <DepositOverviewWrapper small $multipleCardsStyle={debitCards?.length > 1}>
      <div className="userCardArea">
        { debitCards?.length ? renderDebitCard(debitCards) : null }
      </div>
      {
        (selectedAccount && interestPanel.title && interestPanel.content)
        && renderInfoPanel(selectedAccount, interestPanel.title, interestPanel.content)
      }
      <div className="transactionDetail" ref={detailsRef}>
        { computedDetails && renderDetailCardList(computedDetails) }
        <Link className="moreButton" to="/depositInquiry">
          更多明細
          <ArrowForwardIos />
        </Link>
      </div>
    </DepositOverviewWrapper>
  );
};

export default DepositOverview;
