import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { SearchRounded, CancelRounded, GetAppRounded } from '@material-ui/icons';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import {
  FEIBIconButton, FEIBTabContext, FEIBTabList, FEIBTab,
} from 'components/elements';
import theme from 'themes/theme';
import DepositInquiryWrapper from './depositInquiry.style';

const DepositInquiry = () => {
  const [tabId, setTabId] = useState('12');
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  const renderCardArea = (card) => {
    const { cardName, cardAccount, cardBalance } = card;
    return (
      <DebitCard
        cardName={cardName}
        account={cardAccount}
        balance={cardBalance}
      />
    );
  };

  const renderSearchBarArea = () => (
    <div className="searchBar">
      <FEIBIconButton $fontSize={2.8}>
        <SearchRounded />
      </FEIBIconButton>
      <p>2020/07/22 ~ 2020/09/22</p>
      <FEIBIconButton
        $fontSize={2}
        $iconColor={theme.colors.primary.light}
      >
        <CancelRounded />
      </FEIBIconButton>
      <FEIBIconButton $fontSize={2.8} className="customPosition">
        <GetAppRounded />
      </FEIBIconButton>
    </div>
  );

  const renderTabs = () => (
    <div className="tabsArea">
      <FEIBTabContext value={tabId} className="iAmeContext">
        <FEIBTabList onChange={handleChangeTabList} $size="small" className="iAmList">
          <FEIBTab label="12月" value="12" />
          <FEIBTab label="11月" value="11" />
          <FEIBTab label="10月" value="10" />
          <FEIBTab label="09月" value="9" />
          <FEIBTab label="08月" value="8" />
          <FEIBTab label="07月" value="7" />
          <FEIBTab label="06月" value="6" />
          <FEIBTab label="05月" value="5" />
          <FEIBTab label="04月" value="4" />
          <FEIBTab label="03月" value="3" />
        </FEIBTabList>
        {/* <FEIBTabPanel value="12"> */}
        {/*  <div>Content</div> */}
        {/* </FEIBTabPanel> */}

        {/* <FEIBTabPanel value="11"> */}
        {/*  <div>Content 1</div> */}
        {/* </FEIBTabPanel> */}
      </FEIBTabContext>
    </div>
  );

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
          noShadow
        />
      );
    })
  );

  useCheckLocation();
  usePageInfo('/api/depositInquiry');

  return (
    <DepositInquiryWrapper small>
      { cardInfo && renderCardArea(cardInfo) }
      <div className="inquiryArea measuredHeight">
        { renderSearchBarArea() }
        { renderTabs() }
        <div className="transactionDetail">
          { cardInfo && renderDetailCardList(cardInfo.detailList) }
        </div>
      </div>
    </DepositInquiryWrapper>
  );
};

export default DepositInquiry;
