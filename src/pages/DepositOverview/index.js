import { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowForwardIos, SyncAltRounded } from '@material-ui/icons';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import { depositOverviewApi } from 'apis';
import {
  setCards, setCardInfo, setDetailAreaHeight, setInterestPanelTitle, setInterestPanelContent, setComputedCardList,
} from './stores/actions';
import DepositOverviewWrapper from './depositOverview.style';

const DepositOverview = () => {
  const cards = useSelector(({ depositOverview }) => depositOverview.cards);
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);
  const transactionDetailAreaHeight = useSelector(({ depositOverview }) => depositOverview.transactionDetailAreaHeight);
  const computedCardList = useSelector(({ depositOverview }) => depositOverview.computedCardList);
  const interestPanelTitle = useSelector(({ depositOverview }) => depositOverview.interestPanelTitle);
  const interestPanelContent = useSelector(({ depositOverview }) => depositOverview.interestPanelContent);

  const ref = useRef();
  const dispatch = useDispatch();
  const { push } = useHistory();
  // TODO: for demo, remove mock data
  // const { doGetInitData, getDetailsData } = depositOverviewApi;
  const { getDetailsData } = depositOverviewApi;

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

  const renderDebitCard = (info) => {
    const {
      cardBranch, cardName, cardAccount, cardBalance, functionList, moreList,
    } = info;
    return (
      <DebitCard
        type="original"
        branch={cardBranch}
        cardName={cardName}
        account={cardAccount}
        balance={cardBalance}
        functionList={functionList}
        moreList={moreList}
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
        <div className="panelItem customPosition" onClick={handleClickInterestRatePanel}>
          <h3>
            {title}
            <SyncAltRounded />
          </h3>
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
    // TODO: for demo, remove mock data
    // const response = await doGetInitData('/api/depositOverview');
    // if (response.initData) {
    //   const { debitCards } = response.initData;
    //   dispatch(setCards(debitCards));
    // }
    // TODO: for demo, add debitCards data from mock data (db.json)
    const debitCards = [
      {
        id: 1,
        cardBranch: '信義分行',
        cardName: '保時捷車友會',
        cardAccount: '04300499001234',
        cardBalance: 2000000,
        interbankWithdrawal: 3,
        interbankTransfer: 5,
        interest: 3,
        interestRate: 2.6,
        interestRateLimit: '5萬',
        functionList: [
          { title: '轉帳', path: '/transfer', icon: null },
          { title: '無卡提款', path: '/cardLessATM', icon: null },
        ],
        moreList: [
          { title: '定存', path: '/', icon: 'monetization_on' },
          { title: '換匯', path: '/', icon: 'euro' },
        ],
      },
      {
        id: 2,
        cardBranch: '大安分行',
        cardName: '另一張存款卡',
        cardAccount: '04300499001234',
        cardBalance: 1680000,
        interbankWithdrawal: 1,
        interbankTransfer: 5,
        interest: 5,
        interestRate: 3.6,
        interestRateLimit: '6萬',
        functionList: [
          { title: '轉帳', path: '/transfer', icon: null },
          { title: '無卡提款', path: '/cardLessATM', icon: null },
        ],
        moreList: [
          { title: '設為速查帳戶', path: '/cardLessATM', icon: 'playlist_add' },
          { title: '增加子帳戶', path: '/cardLessATM', icon: 'library_add' },
          { title: '存摺封面下載', path: '/cardLessATM', icon: 'system_update' },
          { title: '編輯帳戶別名', path: '/cardLessATM', icon: 'edit' },
        ],
      },
    ];
    dispatch(setCards(debitCards));
  }, []);

  // 根據用戶選擇的卡片，將該卡片資料儲存至 redux
  useEffect(() => {
    selectedCard(1, cards);
  }, [cards]);

  // 取得所選卡片資料後，將優惠利率數字存進 redux，計算 transactionDetail DOM 高度
  useEffect(() => {
    if (cardInfo) {
      const { interestRate } = cardInfo;
      const { offsetHeight } = ref.current;
      dispatch(setInterestPanelContent(`${interestRate}%`));
      dispatch(setDetailAreaHeight(offsetHeight));
    }
  }, [cardInfo]);

  // 計算裝置可容納的交易明細卡片數量
  useEffect(async () => {
    if (cardInfo) {
      // 根據剩餘高度計算要顯示的卡片數量
      const computedCount = Math.floor((transactionDetailAreaHeight - 32) / 80);
      const detailsResponse = await getDetailsData('https://appbankee-t.feib.com.tw/ords/db1/acc/getAccTx?actno=04300499312641');
      if (detailsResponse) {
        const list = [];
        const { acctDetails } = detailsResponse;
        for (let i = 0; i < computedCount; i++) {
          list.push(acctDetails[i]);
        }
        dispatch(setComputedCardList(list));
      }
    }
  }, [cardInfo, transactionDetailAreaHeight]);

  return (
    <DepositOverviewWrapper small>
      <div className="measuredHeight">
        { cardInfo && renderDebitCard(cardInfo) }
        {
          (cardInfo && interestPanelTitle && interestPanelContent)
          && renderInfoPanel(cardInfo, interestPanelTitle, interestPanelContent)
        }
        <div className="transactionDetail" ref={ref}>
          { computedCardList && renderDetailCardList(computedCardList) }
          <Link className="moreButton" to="/depositInquiry">
            更多明細
            <ArrowForwardIos />
          </Link>
        </div>
      </div>
    </DepositOverviewWrapper>
  );
};

export default DepositOverview;
