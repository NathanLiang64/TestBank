import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowForwardIos } from '@material-ui/icons';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import { depositOverviewApi } from 'apis';
import {
  setCards, setCardInfo, setInterestPanelTitle, setInterestPanelContent,
} from './stores/actions';
import DepositOverviewWrapper from './depositOverview.style';

const DepositOverview = () => {
  const cards = useSelector(({ depositOverview }) => depositOverview.cards);
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);
  const interestPanelTitle = useSelector(({ depositOverview }) => depositOverview.interestPanelTitle);
  const interestPanelContent = useSelector(({ depositOverview }) => depositOverview.interestPanelContent);

  const dispatch = useDispatch();
  const { push } = useHistory();
  const { doGetInitData } = depositOverviewApi;

  const selectedCard = (id, allCards) => {
    const filteredCard = allCards.find((card) => card.id === id);
    // 將篩選後的卡片資訊存進 redux
    dispatch(setCardInfo(filteredCard));
  };

  const handleClickInterestRateLimit = () => {
    push('/depositPlus');
  };

  const handleClickInterestRatePanel = () => {
    const { interest, interestRate } = cardInfo;
    if (interestPanelTitle === '優惠利率') {
      dispatch(setInterestPanelTitle('累積利息'));
      dispatch(setInterestPanelContent(`$${interest}`));
    } else {
      dispatch(setInterestPanelTitle('優惠利率'));
      dispatch(setInterestPanelContent(`${interestRate}%`));
    }
  };

  const renderDetailCardList = (list) => (
    list.map((card) => {
      const {
        id,
        avatar,
        title,
        type,
        date,
        sender,
        amount,
        balance,
      } = card;
      return (
        <DetailCard
          key={id}
          avatar={avatar}
          title={title}
          type={type}
          date={date}
          sender={sender}
          amount={amount}
          balance={balance}
        />
      );
    })
  );

  const renderDebitCard = (info) => {
    const {
      cardBranch,
      cardName,
      cardAccount,
      cardBalance,
    } = info;
    return (
      <DebitCard
        type="original"
        branch={cardBranch}
        cardName={cardName}
        account={cardAccount}
        balance={cardBalance}
      />
    );
  };

  const renderInfoPanel = (info, title, content) => {
    const {
      interbankWithdrawal,
      interbankTransfer,
      interestRateLimit,
    } = info;
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
        <div className="panelItem" onClick={handleClickInterestRatePanel}>
          <h3>{title}</h3>
          <p>{content}</p>
        </div>
        <div className="panelItem" onClick={handleClickInterestRateLimit}>
          <h3>優惠利率額度</h3>
          <p className="inline">
            {interestRateLimit}
            <ArrowForwardIos />
          </p>
        </div>
      </div>
    );
  };

  useCheckLocation();
  usePageInfo('/api/depositOverview');

  // 取得所有存款卡的初始資料
  useEffect(async () => {
    const response = await doGetInitData('/api/depositOverview');
    if (response.initData) {
      const { debitCards } = response.initData;
      dispatch(setCards(debitCards));
    }
  }, []);

  // 根據用戶選擇的卡片，將該卡片資料儲存至 redux
  useEffect(() => {
    selectedCard(1, cards);
  }, [cards]);

  // 取得所選卡片資料後，將優惠利率數字存進 redux
  useEffect(() => {
    if (cardInfo) {
      const { interestRate } = cardInfo;
      dispatch(setInterestPanelContent(`${interestRate}%`));
    }
  }, [cardInfo]);

  return (
    <DepositOverviewWrapper>
      <div className="measuredHeight">
        { cardInfo && renderDebitCard(cardInfo) }
        {
          (cardInfo && interestPanelTitle && interestPanelContent)
          && renderInfoPanel(cardInfo, interestPanelTitle, interestPanelContent)
        }
        <div className="transactionDetail">
          { cardInfo && renderDetailCardList(cardInfo.detailList) }
          <Link className="moreButton" to="/">
            更多明細
            <ArrowForwardIos />
          </Link>
        </div>
      </div>
    </DepositOverviewWrapper>
  );
};

export default DepositOverview;
