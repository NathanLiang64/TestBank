import { useRef, useState } from 'react';
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
  const detailsRef = useRef();
  const { push } = useHistory();
  // 優存(利率/利息)資訊 顯示模式（true.優惠利率, false.累積利息)
  const [showRate, setShowRate] = useState(true);

  const renderDetailCardList = () => {
    // TODO: 計算可顯示的明細項目數量。
    // TODO: 因為外層 div 已縮至最小，無法正確計算可顯示的數量。「外層」可能是 Layout 物件。
    console.log(detailsRef?.current);
    console.log(detailsRef?.current?.offsetHeight);
    // const { offsetHeight } = detailsRef?.current;
    // setDetailAreaHeight(offsetHeight);
    const detailAreaHeight = 430; // 暫時固定顯示 5 筆

    // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
    const list = [];
    if (details?.length) {
      const computedCount = Math.floor((detailAreaHeight - 30) / 80);
      for (let i = 0; (i < computedCount && i < details.length); i++) {
        list.push(details[i]);
      }

      return (
        list.map((card) => (
          <DetailCard
            key={card.index}
            avatar={null} // 大頭貼路徑＋card.targetMbrId
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
    }

    return (
      <div>
        TODO: 顯示沒有資料的圖案
        <br />
        <br />
      </div>
    );
  };

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

  const renderMultipleDebitCards = (userAccounts) => (
    <Swiper
      slidesPerView={1.14}
      spaceBetween={8}
      centeredSlides
      pagination
      onSlideChange={onAccountChange}
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

  /**
   * 顯示 優存(利率/利息)資訊
   */
  const renderBonusInfoPanel = () => {
    const { freeWithdrawal, freeTransfer, bonusQuota } = panelInfo;
    const value1 = panelInfo.bonusRate ? `${panelInfo.bonusRate * 100}%` : '-';
    const value2 = panelInfo.interest ? `$${panelInfo.interest}` : '-';
    return (
      <div className="interestRatePanel">
        <div className="panelItem">
          <h3>免費跨提/轉</h3>
          <p>
            {freeWithdrawal}
            /
            {freeTransfer}
          </p>
        </div>
        <div className="panelItem" onClick={() => setShowRate(!showRate)}>
          <h3>
            {showRate ? '優惠利率' : '累積利息'}
            <SwitchIcon className="switchIcon" />
          </h3>
          <p>{showRate ? value1 : value2 }</p>
        </div>
        <div className="panelItem" onClick={() => push('/depositPlus')}>
          <h3>
            優惠利率額度
            <ArrowNextIcon />
          </h3>
          <p>{bonusQuota}</p>
        </div>
      </div>
    );
  };

  return (
    <AccountOverviewWrapper small $multipleCardsStyle={accounts?.length > 1}>
      <div className="userCardArea">
        { accounts?.length ? renderDebitCard(accounts) : null }
      </div>
      {/* 顯示 優惠利率資訊面版 */}
      { panelInfo ? renderBonusInfoPanel() : null }
      <div className="transactionDetail" ref={detailsRef}>
        {/* 顯示 最近交易明細 */}
        { renderDetailCardList() }
        <Link className="moreButton" to={detailsLink}>
          更多明細
          <ArrowNextIcon />
        </Link>
      </div>
    </AccountOverviewWrapper>
  );
};

export default AccountOverview;
