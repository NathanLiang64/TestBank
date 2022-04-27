import { Swiper, SwiperSlide } from 'swiper/react';
import DebitCard from 'components/DebitCard';
import AccountOverviewWrapper from './accountOverview.style';

const AccountOverview = ({
  accounts, onAccountChange, cardColor,
  funcList, moreFuncs,
}) => {
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

  return (
    <AccountOverviewWrapper small $multipleCardsStyle={accounts?.length > 1}>
      <div className="userCardArea">
        { accounts?.length ? renderDebitCard(accounts) : null }
      </div>
    </AccountOverviewWrapper>
  );
};

export default AccountOverview;
