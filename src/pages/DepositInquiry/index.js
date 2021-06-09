/* eslint-disable */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import Scrollspy from 'react-scrollspy';
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
  setDetailList, setOpenInquiryDrawer, setDateRange, setSelectedKeywords,
} from './stores/actions';

const DepositInquiry = () => {
  const [tabId, setTabId] = useState('detailList12');
  const [openDownloadDrawer, setOpenDownloadDrawer] = useState(false);
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);
  const detailList = useSelector(({ depositInquiry }) => depositInquiry.detailList);
  const openInquiryDrawer = useSelector(({ depositInquiry }) => depositInquiry.openInquiryDrawer);
  const dateRange = useSelector(({ depositInquiry }) => depositInquiry.dateRange);
  const selectedKeywords = useSelector(({ depositInquiry }) => depositInquiry.selectedKeywords);
  const { doGetInitData } = depositInquiryApi;
  const dispatch = useDispatch();

  const handleChangeTabList = (event, id) => {
    console.info('tab id: ', id);
    setTabId(id);
  };

  const handleScrollChangeContent = (element) => {
    console.info('scroll spy element id: ', element.id);
    setTabId(element.id);
  };

  const handleClickSearchButton = () => {
    dispatch(setOpenInquiryDrawer(true));
  };

  const handleClickDownloadButton = () => {
    setOpenDownloadDrawer(true);
  };

  const handleClickDownloadDetails = (format) => {
    setOpenDownloadDrawer(false);
    if (format === 'pdf') {
      // TODO: 交易明細下載 (Pdf 格式)
      // window.location.href = 'url';
    } else {
      // TODO: 交易明細下載 (Excel 格式)
      // window.location.href = 'url';
    }
  };

  const handleClickMonthTabs = async (month) => {
    const response = await doGetInitData('/api/depositInquiry');
    if (response[month]) {
      const lastKey = Object.keys(response[month])[Object.keys(response[month]).length - 1];
      dispatch(setDetailList(response[month]));
      const target = document.getElementById(lastKey);
      target.scrollIntoView({ behavior: 'smooth' });
    }
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
      <FEIBIconButton $fontSize={2.8} className="customPosition" onClick={handleClickDownloadButton}>
        <GetAppRounded />
      </FEIBIconButton>
    </div>
  );

  // TODO: 捲動時 tabs 切換
  const renderTabs = () => (
    <div className="tabsArea">
      <Scrollspy
        items={["detailList12", "detailList11", "detailList10", "detailList09", "detailList08", "detailList07", "detailList06", "detailList05", "detailList04", "detailList03"]}
        currentClassName="scrollSpyActive"
        componentTag="div"
        className="scrollSpy"
        // offset={-240}
        rootEl="section"
        onUpdate={handleScrollChangeContent}
      >
        <FEIBTabContext value={tabId}>
          <FEIBTabList onChange={handleChangeTabList} $size="small">
            <FEIBTab label="12月" value="detailList12" href="#detailList12" />
            <FEIBTab label="11月" value="detailList11" href="#detailList11" onClick={() => handleClickMonthTabs('month11')} />
            <FEIBTab label="10月" value="detailList10" href="#detailList10" onClick={() => handleClickMonthTabs('month10')} />
            <FEIBTab label="09月" value="detailList09" href="#detailList09" />
            <FEIBTab label="08月" value="detailList08" href="#detailList08" />
            <FEIBTab label="07月" value="detailList07" href="#detailList07" />
            <FEIBTab label="06月" value="detailList06" href="#detailList06" />
            <FEIBTab label="05月" value="detailList05" href="#detailList05" />
            <FEIBTab label="04月" value="detailList04" href="#detailList04" />
            <FEIBTab label="03月" value="detailList03" href="#detailList03" />
          </FEIBTabList>
          {/* <FEIBTabPanel value="12"> */}
          {/*  <div>Content</div> */}
          {/* </FEIBTabPanel> */}

          {/* <FEIBTabPanel value="11"> */}
          {/*  <div>Content 1</div> */}
          {/* </FEIBTabPanel> */}
        </FEIBTabContext>
      </Scrollspy>
    </div>
  );

  const renderDetailCardList = (list) => (
    Object.keys(list).map((month) => (
      <section key={month} id={month}>
        { list[month].map((card) => {
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
        }) }
      </section>
    ))
  );

  const renderSearchDrawer = (element) => (
    <BottomDrawer
      title="明細搜尋"
      titleColor={theme.colors.primary.dark}
      className="debitInquirySearchDrawer"
      isOpen={openInquiryDrawer}
      onClose={() => dispatch(setOpenInquiryDrawer(false))}
      content={element}
    />
  );

  const renderDownloadDrawer = () => (
    <BottomDrawer
      className="debitInquiryDownloadDrawer"
      isOpen={openDownloadDrawer}
      onClose={() => setOpenDownloadDrawer(false)}
      content={(
        <ul>
          <li onClick={() => handleClickDownloadDetails('pdf')}><p>下載 PDF</p></li>
          <li onClick={() => handleClickDownloadDetails('excel')}><p>下載 EXCEL</p></li>
        </ul>
      )}
    />
  );

  useEffect(async () => {
    // 清空查詢條件
    dispatch(setDateRange(''));
    dispatch(setSelectedKeywords([]));

    // 取得所有存款卡的初始資料
    const response = await doGetInitData('/api/depositInquiry');
    if (response.initData) {
      dispatch(setDetailList(response.initData));
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
          { detailList && renderDetailCardList(detailList) }
        </div>
      </div>
      { renderDownloadDrawer() }
      { renderSearchDrawer(<DepositSearchCondition />) }
    </DepositInquiryWrapper>
  );
};

export default DepositInquiry;
