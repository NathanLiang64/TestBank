import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import DebitCard from 'components/DebitCard/DebitCard';
import AccountOverviewWrapper from './accountOverview.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const AccountOverview = ({
  accounts, onAccountChanged, cardColor,
  funcList, moreFuncs, onFunctionClick,
  transferMode, withdrawMode, defaultSlide,
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
      <Swiper slidesPerView={1.14} spaceBetween={8} centeredSlides pagination initialSlide={defaultSlide} onSlideChange={onSlideChange}>
        { accounts.map((account) => (
          <SwiperSlide key={`${account.accountNo}-${account.currency}`}>
            { renderDebitCard(account) }
          </SwiperSlide>
        )) }
      </Swiper>
    );
  };

  return accounts ? (
    <AccountOverviewWrapper $multipleCardsStyle={accounts?.length > 1}>
      <div className="userCardArea">
        { accounts.length > 1 ? (
          renderSwiper()
        ) : (
          <div className="singleAccount">
            {renderDebitCard(accounts[0])}
          </div>
        )}
      </div>
    </AccountOverviewWrapper>
  ) : null;
};

export default AccountOverview;