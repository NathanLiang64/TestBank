import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { SearchRounded, CancelRounded, GetAppRounded } from '@material-ui/icons';
import { depositInquiryApi } from 'apis';
import DepositSearchCondition from 'pages/DepositSearchCondition';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import BottomDrawer from 'components/BottomDrawer';
import CheckboxButton from 'components/CheckboxButton';
import {
  FEIBIconButton, FEIBTabContext, FEIBTabList, FEIBTab,
} from 'components/elements';
import theme from 'themes/theme';
import DepositInquiryWrapper from './depositInquiry.style';
import {
  setCurrentMonthDetailList, setOpenInquiryDrawer, setDateRange, setSelectedKeywords,
} from './stores/actions';

const DepositInquiry = () => {
  const [tabId, setTabId] = useState('12');
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);
  const currentMonthDetailList = useSelector(({ depositInquiry }) => depositInquiry.currentMonthDetailList);
  const openInquiryDrawer = useSelector(({ depositInquiry }) => depositInquiry.openInquiryDrawer);
  const dateRange = useSelector(({ depositInquiry }) => depositInquiry.dateRange);
  const selectedKeywords = useSelector(({ depositInquiry }) => depositInquiry.selectedKeywords);

  const { doGetInitData } = depositInquiryApi;

  const dispatch = useDispatch();
  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  const handleClickSearchButton = () => {
    dispatch(setOpenInquiryDrawer(true));
  };

  const handleClickMonthTabs = async () => {
    const response = await doGetInitData('/api/depositInquiry');
    if (response.initData) {
      const { detailList11 } = response.initData;
      dispatch(setCurrentMonthDetailList(detailList11));
    }
    const target = document.getElementById('11');
    target.scrollIntoView({ behavior: 'smooth' });
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

  const renderSearchBarText = (date, keywords) => (
    date ? (
      <>
        <p>{date}</p>
        <FEIBIconButton
          $fontSize={2}
          $iconColor={theme.colors.primary.light}
          onClick={() => {
            dispatch(setDateRange(''));
            dispatch(setSelectedKeywords([]));
          }}
        >
          <CancelRounded />
        </FEIBIconButton>
      </>
    ) : (
      keywords && (
        <div className="selectedKeywords">
          { keywords.map((keyword) => (
            <CheckboxButton key={keyword} label={keyword} unclickable />
          )) }
        </div>
      )
    )
  );

  const renderSearchBarArea = () => (
    <div className="searchBar">
      <FEIBIconButton $fontSize={2.8} onClick={handleClickSearchButton}>
        <SearchRounded />
      </FEIBIconButton>
      { renderSearchBarText(dateRange, selectedKeywords) }
      <FEIBIconButton $fontSize={2.8} className="customPosition">
        <GetAppRounded />
      </FEIBIconButton>
    </div>
  );

  const renderTabs = () => (
    <div className="tabsArea">
      <FEIBTabContext value={tabId}>
        <FEIBTabList onChange={handleChangeTabList} $size="small">
          <FEIBTab label="12月" value="12" />
          <FEIBTab label="11月" value="11" onClick={handleClickMonthTabs} />
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
          id={date.substr(0, 2)}
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

  const renderBottomDrawer = (element) => (
    <BottomDrawer
      title="明細搜尋"
      titleColor={theme.colors.primary.dark}
      className="debitInquiryDrawer"
      isOpen={openInquiryDrawer}
      onClose={() => dispatch(setOpenInquiryDrawer(false))}
      content={element}
    />
  );

  // 取得所有存款卡的初始資料
  useEffect(async () => {
    const response = await doGetInitData('/api/depositInquiry');
    if (response.initData) {
      const { detailList12 } = response.initData;

      dispatch(setCurrentMonthDetailList(detailList12));
    }
  }, []);

  useCheckLocation();
  usePageInfo('/api/depositInquiry');

  return (
    <DepositInquiryWrapper small>
      { cardInfo && renderCardArea(cardInfo) }
      <div className="inquiryArea measuredHeight">
        { renderSearchBarArea() }
        { renderTabs() }
        <div className="transactionDetail">
          { currentMonthDetailList && renderDetailCardList(currentMonthDetailList) }
        </div>
      </div>
      { renderBottomDrawer(<DepositSearchCondition />) }
    </DepositInquiryWrapper>
  );
};

export default DepositInquiry;
