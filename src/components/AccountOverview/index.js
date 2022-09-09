import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import DebitCard from 'components/DebitCard';
import AccountOverviewWrapper from './accountOverview.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const AccountOverview = ({
  accounts, onAccountChange, cardColor,
  funcList, moreFuncs, onFunctionChange,
}) => {
  const renderDebitCard = (account) => (
    <DebitCard
      type="original"
      branch={account.branchName}
      cardName={account.alias}
      account={account.accountNo}
      balance={account.balance}
      dollarSign={account.currency}
      functionList={funcList}
      moreList={moreFuncs}
      color={cardColor}
      onFunctionClick={onFunctionChange}
    />
  );

  const renderSwiper = () => {
    const onSlideChange = (swiper) => onAccountChange(swiper.activeIndex);
    return (
      <Swiper slidesPerView={1.14} spaceBetween={8} centeredSlides pagination onSlideChange={onSlideChange}>
        { accounts.map((account) => (
          <SwiperSlide key={`${account.accountNo}-${account.currency}`}>
            { renderDebitCard(account) }
        </SwiperSlide>
      )) }
    </Swiper>
  );
  };

  const renderDebitCardPanel = () => (
    accounts.length > 1
      ? renderSwiper()
      : renderDebitCard(accounts[0])
  );

  return (
    <AccountOverviewWrapper small $multipleCardsStyle={accounts?.length > 1}>
      <div className="userCardArea">
        { renderDebitCardPanel() }
      </div>
    </AccountOverviewWrapper>
  );
};

export default AccountOverview;
