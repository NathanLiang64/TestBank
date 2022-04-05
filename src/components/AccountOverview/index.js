import { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import { ArrowNextIcon, SwitchIcon } from 'assets/images/icons';
import AccountOverviewWrapper from './accountOverview.style';

const AccountOverview = ({
  accounts, onAccountChange, details, panelInfo, cardColor, detailsLink,
  funcList, moreFuncs,
}) => {
  // const debitCards = useSelector(({ accountOverview }) => accountOverview.debitCards);
  // const selectedAccount = useSelector(({ accountOverview }) => accountOverview.selectedAccount);
  // const txnDetails = useSelector(({ accountOverview }) => accountOverview.txnDetails);

  const [detailAreaHeight, setDetailAreaHeight] = useState(0);
  const [interestPanel, setInterestPanel] = useState({ title: '', content: '' });
  const [computedDetails, setComputedDetails] = useState([]);

  const detailsRef = useRef();
  const { push } = useHistory();

  const handleClickInterestRatePanel = () => {
    const { interest, interestRate } = panelInfo;
    if (interestPanel.title === '優惠利率') {
      setInterestPanel({ title: '累積利息', content: interest ? `$${interest}` : '-' });
    } else {
      setInterestPanel({ ...interestPanel, title: '優惠利率', content: interestRate ? `${interestRate}%` : '-' });
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

  const renderSingleDebitCard = (cardInfo) => (
    <DebitCard
      type="original"
      branch={cardInfo.acctBranch}
      cardName={cardInfo.acctName}
      account={cardInfo.acctId}
      balance={cardInfo.acctBalx}
      dollarSign={cardInfo.ccyCd}
      functionList={funcList}
      moreList={moreFuncs}
      color={cardColor}
    />
  );

  const handleChangeSlide = (swiper) => {
    onAccountChange(swiper);
  };

  const renderMultipleDebitCards = (userAccounts) => (
    <Swiper
      slidesPerView={1.14}
      spaceBetween={8}
      centeredSlides
      pagination
      onSlideChange={handleChangeSlide}
    >
      { userAccounts.map((account) => (
        <SwiperSlide key={account.cardInfo.acctId}>
          { renderSingleDebitCard(account.cardInfo) }
        </SwiperSlide>
      )) }
    </Swiper>
  );

  const renderDebitCard = (userAccounts) => (
    userAccounts.length > 1
      ? renderMultipleDebitCards(userAccounts)
      : renderSingleDebitCard(userAccounts[0].cardInfo)
  );

  const renderInterestRatePanel = (info, title, content) => {
    const { interbankWithdrawal, interbankTransfer, interestRateLimit } = info;
    return (
      <div className="interestRatePanel">
        <div className="panelItem">
          <h3>免費跨提/轉</h3>
          <p>
            {interbankWithdrawal}
            /
            {interbankTransfer}
          </p>
        </div>
        <div className="panelItem" onClick={handleClickInterestRatePanel}>
          <h3>
            {title}
            <SwitchIcon className="switchIcon" />
          </h3>
          <p>{content}</p>
        </div>
        <div className="panelItem" onClick={() => push('/depositPlus')}>
          <h3>
            優惠利率額度
            <ArrowNextIcon />
          </h3>
          <p>{interestRateLimit}</p>
        </div>
      </div>
    );
  };

  // 取得帳號資料後，計算 transactionDetail DOM 高度
  useEffect(() => {
    if (accounts?.length) {
      // TODO: 計算可顯示的明細項目數量。
      // const { offsetHeight } = detailsRef?.current;
      // setDetailAreaHeight(offsetHeight);
      setDetailAreaHeight(430);
    }
  }, [accounts]);

  // 根據當前帳戶取得交易明細資料及優惠利率數字
  useEffect(() => {
    if (panelInfo) {
      const { interestRate } = panelInfo;
      setInterestPanel({
        ...interestPanel,
        title: '優惠利率',
        content: interestRate ? `${interestRate}%` : '-',
      });
    }
  }, [panelInfo]);

  // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
  useEffect(async () => {
    if (details?.length) {
      const list = [];
      const computedCount = Math.floor((detailAreaHeight - 30) / 80);
      for (let i = 0; i < computedCount; i++) list.push(details[i]);
      setComputedDetails(list);
    }
  }, [details, detailAreaHeight]);

  return (
    <AccountOverviewWrapper small $multipleCardsStyle={accounts?.length > 1}>
      <div className="userCardArea">
        { accounts?.length ? renderDebitCard(accounts) : null }
      </div>
      {
        // 顯示 優惠利率資訊面版
        panelInfo && renderInterestRatePanel(panelInfo, interestPanel?.title, interestPanel?.content)
      }
      <div className="transactionDetail" ref={detailsRef}>
        { computedDetails && renderDetailCardList(computedDetails) }
        <Link className="moreButton" to={detailsLink}>
          更多明細
          <ArrowNextIcon />
        </Link>
      </div>
    </AccountOverviewWrapper>
  );
};

export default AccountOverview;
