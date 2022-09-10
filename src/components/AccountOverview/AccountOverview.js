import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import DebitCard from 'components/DebitCard/DebitCard';
import AccountOverviewWrapper from './accountOverview.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const AccountOverview = ({
  accounts, onAccountChanged, cardColor,
  funcList, moreFuncs, onFunctionClick,
  transferMode, withdrawMode,
}) => {
  const renderDebitCard = (account) => (
    <DebitCard
      transferMode={transferMode}
      withdrawMode={withdrawMode}
      color={cardColor}
      accountObj={account}
      moreList={moreFuncs}
      functionList={funcList}
      onFunctionClick={onFunctionClick}
      type="original"
    />
  );

  const renderSwiper = () => {
    const onSlideChange = (swiper) => onAccountChanged(swiper.activeIndex);
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

  return accounts ? (
    <AccountOverviewWrapper $multipleCardsStyle={accounts?.length > 1}>
      <div className="userCardArea">
        { renderDebitCardPanel() }
      </div>
    </AccountOverviewWrapper>
  ) : null;
};

export default AccountOverview;
