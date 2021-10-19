import { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ArrowForwardIos, SyncAltRounded } from '@material-ui/icons';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import AccountOverviewWrapper from './accountOverview.style';

const AccountOverview = ({
  accounts, selectedAccount, onAccountChange, details, showInterestRatePanel, cardColor, detailsLink,
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
    const { interest, interestRate } = selectedAccount;
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

  const renderSingleDebitCard = (userAccount) => (
    <DebitCard
      type="original"
      branch={userAccount.acctBranch}
      cardName={userAccount.acctName}
      account={userAccount.acctId}
      balance={userAccount.acctBalx}
      dollarSign={userAccount.ccyCd}
      functionList={userAccount.functionList}
      moreList={userAccount.moreList}
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
        <SwiperSlide key={account.id}>
          { renderSingleDebitCard(account) }
        </SwiperSlide>
      )) }
    </Swiper>
  );

  const renderDebitCard = (userAccounts) => (
    userAccounts.length > 1
      ? renderMultipleDebitCards(userAccounts)
      : renderSingleDebitCard(userAccounts[0])
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

  // 取得帳號資料後，計算 transactionDetail DOM 高度
  useEffect(() => {
    if (accounts?.length) {
      const { offsetHeight } = detailsRef?.current;
      setDetailAreaHeight(offsetHeight);
    }
  }, [accounts]);

  // 根據當前帳戶取得交易明細資料及優惠利率數字
  useEffect(() => {
    if (Object.keys(selectedAccount)?.length) {
      const { interestRate } = selectedAccount;
      setInterestPanel({
        ...interestPanel,
        title: '優惠利率',
        content: interestRate ? `${interestRate}%` : '-',
      });
    }
  }, [selectedAccount]);

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
        showInterestRatePanel && (
          // (selectedAccount && interestPanel.title && interestPanel.content) &&
          renderInterestRatePanel(selectedAccount, interestPanel?.title, interestPanel?.content)
        )
      }
      <div className="transactionDetail" ref={detailsRef}>
        { computedDetails && renderDetailCardList(computedDetails) }
        <Link className="moreButton" to={detailsLink}>
          更多明細
          <ArrowForwardIos />
        </Link>
      </div>
    </AccountOverviewWrapper>
  );
};

export default AccountOverview;
