import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import { useCheckLocation, usePageInfo } from 'hooks';
import { SearchRounded, CancelRounded, GetAppRounded } from '@material-ui/icons';
import { depositInquiryApi } from 'apis';
import DepositSearchCondition from 'pages/DepositSearchCondition';
import EmptyData from 'components/EmptyData';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import BottomDrawer from 'components/BottomDrawer';
import {
  FEIBIconButton, FEIBTabContext, FEIBTabList, FEIBTab,
} from 'components/elements';
import theme from 'themes/theme';
import { dateFormatter } from 'utilities/Generator';
import DepositInquiryWrapper from './depositInquiry.style';
import {
  setDetailList, setOpenInquiryDrawer, setDateRange, setKeywords, setCustomKeyword,
} from './stores/actions';

const DepositInquiry = () => {
  const transactionDetailRef = useRef();
  const [tabId, setTabId] = useState('');
  // TODO: tab 改存在 redux，搜尋頁也會用到
  const [tabList, setTabList] = useState([]);
  const [openDownloadDrawer, setOpenDownloadDrawer] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [viewerChildren, setViewerChildren] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [inViewChildren, setInViewChildren] = useState([]);

  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);
  const detailList = useSelector(({ depositInquiry }) => depositInquiry.detailList);
  const openInquiryDrawer = useSelector(({ depositInquiry }) => depositInquiry.openInquiryDrawer);
  const dateRange = useSelector(({ depositInquiry }) => depositInquiry.dateRange);
  const keywords = useSelector(({ depositInquiry }) => depositInquiry.keywords);
  // const { doGetInitData } = depositInquiryApi;
  const { getOnlineData } = depositInquiryApi;
  const dispatch = useDispatch();

  // const initKeywords = [
  //   { title: '繳卡款', name: 'keywordBill', selected: false },
  //   { title: '轉出', name: 'keywordTransfer', selected: false },
  //   { title: '轉入', name: 'keywordDepositAccount', selected: false },
  //   { title: '利息', name: 'keywordInterest', selected: false },
  //   { title: '付款儲值', name: 'keywordSpend', selected: false },
  //   { title: '薪轉', name: 'keywordSalary', selected: false },
  // ];
  const initKeywords = [
    { title: '跨轉', name: 'tranTP1', selected: false },
    { title: 'ATM', name: 'tranTP2', selected: false },
    { title: '存款息', name: 'tranTP3', selected: false },
    { title: '薪轉', name: 'tranTP4', selected: false },
    { title: '付款儲存', name: 'tranTP5', selected: false },
    { title: '自動扣繳', name: 'tranTP6', selected: false },
  ];

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  // 點擊查詢條件篩選 icon (放大鏡)
  const handleClickSearchButton = () => {
    dispatch(setOpenInquiryDrawer(true));
  };

  // 點擊下載交易明細 icon
  const handleClickDownloadDetails = (format) => {
    setOpenDownloadDrawer(false);
    if (format === 'pdf') {
      // 交易明細下載 (Pdf 格式)
      // window.location.href = 'url';
    } else {
      // 交易明細下載 (Excel 格式)
      // window.location.href = 'url';
    }
  };

  // 點擊清空條件 icon
  const handleClickClearCondition = () => {
    // 儲存目前的已選關鍵字陣列至 tempSelectedKeywords
    const tempKeywords = Array.from(keywords);
    // 將 tempKeywords 內所有的關鍵字改為未選取
    tempKeywords.forEach((keyword) => {
      keyword.selected = false;
    });
    // 清空日期範圍條件
    dispatch(setDateRange([]));
    // 清空已選關鍵字條件 (將 tempSelectedKeywords 取代掉現有的 selectedKeywords)
    dispatch(setKeywords(tempKeywords));
    dispatch(setCustomKeyword(''));
  };

  // const handleClickMonthTabs = async (event) => {
  //   // 從點擊的 Tab 連結取得 TabId
  //   const tab = event.currentTarget.href.split('#').pop();
  //   const response = await doGetInitData('/api/depositInquiry');
  //   if (response[tab]) {
  //     dispatch(setDetailList(response[tab]));
  //     const target = Array.from(transactionDetailRef.current.children).find((child) => child.id === tab);
  //     target.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };
  const handleClickOnlineMonthTabs = async (event) => {
    const testApiUrl = 'https://appbankee-t.feib.com.tw/ords/db1/acc/getAccTx?actno=04300490004059';
    // 從點擊的 Tab 連結取得 TabId
    const month = event.currentTarget.href.split('#').pop();
    const response = await getOnlineData(`${testApiUrl}&dataMonth=${month}`);
    if (response) {
      const { acctDetails } = response;
      // console.info('response', response);
      dispatch(setDetailList(acctDetails));
      const target = Array.from(transactionDetailRef.current.children).find((child) => child.id === month);
      // console.info('target', target);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // const getNewDetailData = async (scrollDirection) => {
  //   const response = await doGetInitData('/api/depositInquiry');
  //   const newDetailList = [];
  //   if (response.nextCall) {
  //     if (scrollDirection === 'up') {
  //       newDetailList.push(...response.nextCall, ...detailList);
  //     } else if (scrollDirection === 'down') {
  //       newDetailList.push(...detailList, ...response.nextCall);
  //     }
  //     dispatch(setDetailList(newDetailList));
  //     // 資料取回後
  //     setIsPending(false);
  //   }
  // };
  const getNewOnlineDetailData = async (scrollDirection, startIndex) => {
    const newDetailList = [];
    let response = null;
    const apiUrl = `https://appbankee-t.feib.com.tw/ords/db1/acc/getAccTxNext?actno=04300499312641&startIndex=${startIndex}&direct=`;
    if (scrollDirection === 'up') {
      response = await getOnlineData(`${apiUrl}-1`);
      newDetailList.push(...response.acctDetails, ...detailList);
      dispatch(setDetailList(newDetailList));
      // 避免資料更新時跳至最頂部，當資料回來時跳轉至舊資料的第一筆位置
      const target = Array.from(transactionDetailRef.current.children).find((child) => child.getAttribute('data-index') === (startIndex + 1).toString());
      target.scrollIntoView();
    } else if (scrollDirection === 'down') {
      response = await getOnlineData(`${apiUrl}1`);
      newDetailList.push(...detailList, ...response.acctDetails);
      dispatch(setDetailList(newDetailList));
    }
    setIsPending(false);
  };

  // 捲動畫面至剩餘 13 筆時正向或反向撈取資料
  const visibilitySensorOnChange = () => {
    if (transactionDetailRef.current) {
      setViewerChildren(Array.from(transactionDetailRef.current.children));
      const inViewList = viewerChildren.filter((item) => item.dataset.inview === 'y');
      setInViewChildren((prev) => {
        if (prev.length > 0 && inViewList.length > 0) {
          setTabId(inViewList[0].id);
          /* ============ 判斷使用者往上捲動或往下捲動 ========== */
          // 往下捲動
          if (prev[0].dataset.index < inViewList[0].dataset.index) {
            const prevLastIndex = parseInt(prev[prev.length - 1].dataset.index, 10);
            const viewerChildrenLastIndex = parseInt(viewerChildren[viewerChildren.length - 1].dataset.index, 10);
            // console.info('prevLastIndex: ', prevLastIndex);
            // console.info('totalLastIndex: ', viewerChildrenLastIndex);
            if (viewerChildrenLastIndex - prevLastIndex < 13) {
              if (!isPending) {
                // console.log(`下方剩餘數量少於 13 張卡片，call api 獲取從索引第 ${viewerChildrenLastIndex + 1} 到第 ${viewerChildrenLastIndex + 21} 張`);
                setIsPending(true);
                // getNewDetailData('down');
                // console.log('正向 start index: ', viewerChildrenLastIndex + 1);
                getNewOnlineDetailData('down', viewerChildrenLastIndex + 1);
              }
            }
          //  往上捲動
          } else if (prev[0].dataset.index > inViewList[0].dataset.index) {
            const prevFirstIndex = parseInt(prev[0].dataset.index, 10);
            const viewerChildrenFirstIndex = parseInt(viewerChildren[0].dataset.index, 10);
            // console.info('prevFirstIndex: ', prevFirstIndex);
            // console.info('totalFirstIndex: ', viewerChildrenFirstIndex);
            // 如果列表內的卡片數量至頂部剩餘數量少於 13 張
            if (prevFirstIndex - viewerChildrenFirstIndex < 13) {
              // 避免條件符合連續 call api
              if (!isPending) {
                // console.log(`獲取從索引第 ${viewerChildrenFirstIndex - 1} 到第 ${viewerChildrenFirstIndex - 21} 張`);
                setIsPending(true);
                // getNewDetailData('up');
                // console.log('反向 start index: ', viewerChildrenFirstIndex - 1);
                getNewOnlineDetailData('up', viewerChildrenFirstIndex - 1);
              }
            }
          }
        }
        return inViewList;
      });
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

  const renderSearchBarText = (date) => (
    <div className="searchCondition">
      <p>{`${dateFormatter(new Date(date[0]))} ~ ${dateFormatter(new Date(date[1]))}`}</p>
      <FEIBIconButton
        $fontSize={2}
        $iconColor={theme.colors.primary.light}
        onClick={handleClickClearCondition}
      >
        <CancelRounded />
      </FEIBIconButton>
    </div>
  );

  const renderSearchBarArea = () => (
    <div className="searchBar">
      <FEIBIconButton $fontSize={2.8} onClick={handleClickSearchButton}>
        <SearchRounded />
      </FEIBIconButton>
      { (dateRange.length > 0) && renderSearchBarText(dateRange) }
      <FEIBIconButton $fontSize={2.8} className="customPosition" onClick={() => setOpenDownloadDrawer(true)}>
        <GetAppRounded />
      </FEIBIconButton>
    </div>
  );

  // 捲動時 tabs 切換
  // const renderTabs = () => (
  //   <div className="tabsArea">
  //     <FEIBTabContext value={tabId}>
  //       <FEIBTabList onChange={handleChangeTabList} $size="small" className="tabList">
  //         <FEIBTab label="12月" value="12" href="#12" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="11月" value="11" href="#11" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="10月" value="10" href="#10" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="09月" value="09" href="#09" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="08月" value="08" href="#08" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="07月" value="07" href="#07" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="06月" value="06" href="#06" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="05月" value="05" href="#05" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="04月" value="04" href="#04" onClick={handleClickMonthTabs} />
  //         <FEIBTab label="03月" value="03" href="#03" onClick={handleClickMonthTabs} />
  //       </FEIBTabList>
  //     </FEIBTabContext>
  //   </div>
  // );
  const renderOnlineTabs = (monthly) => (
    <div className="tabsArea">
      <FEIBTabContext value={tabId}>
        <FEIBTabList onChange={handleChangeTabList} $size="small" className="tabList">
          { monthly.map((month) => (
            <FEIBTab
              key={month}
              label={`${month.substr(4, 2)}月`}
              value={month}
              href={`#${month}`}
              onClick={handleClickOnlineMonthTabs}
            />
          )) }
        </FEIBTabList>
      </FEIBTabContext>
    </div>
  );

  // const renderDetailCardList = (list) => (
  //   list.map((card) => (
  //     <VisibilitySensor
  //       key={card.id}
  //       onChange={visibilitySensorOnChange}
  //       containment={transactionDetailRef.current}
  //     >
  //       {({ isVisible }) => (
  //         <DetailCard
  //           id={card.date.substr(0, 2)}
  //           index={card.index}
  //           inView={isVisible ? 'y' : 'n'}
  //           avatar={card.avatar}
  //           title={card.title}
  //           type={card.type}
  //           date={card.date}
  //           sender={card.sender}
  //           amount={card.amount}
  //           balance={card.balance}
  //           noShadow
  //         />
  //       )}
  //     </VisibilitySensor>
  //   ))
  // );
  const renderOnlineDetailCardList = (list) => (
    list.map((card) => (
      <VisibilitySensor
        key={card.index}
        onChange={visibilitySensorOnChange}
        containment={transactionDetailRef.current}
      >
        {({ isVisible }) => (
          <DetailCard
            id={card.txnDate.substr(0, 6)}
            // id={card.index}
            index={card.index}
            inView={isVisible ? 'y' : 'n'}
            avatar={card.avatar}
            title={card.description}
            type={card.cdType}
            date={card.txnDate}
            sender={card.targetMbrID || card.targetAcct}
            dollarSign={card.currency}
            amount={card.amount}
            balance={card.balance}
            noShadow
          />
        )}
      </VisibilitySensor>
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

  const init = async () => {
    // 清空查詢條件
    dispatch(setDateRange([]));
    dispatch(setCustomKeyword(''));
    dispatch(setKeywords(initKeywords));

    // 取得所有存款卡的初始資料
    // const response = await doGetInitData('/api/depositInquiry');
    const onlineResponse = await getOnlineData('https://appbankee-t.feib.com.tw/ords/db1/acc/getAccTx?actno=04300490004059');
    // if (response.initData) {
    //   setTabId(response.initData[0].id.substr(0, 2));
    //   dispatch(setDetailList(response.initData));
    // }
    if (onlineResponse) {
      const { monthly, acctDetails } = onlineResponse;
      setTabList(monthly.reverse());
      setTabId(acctDetails[0].txnDate.substr(0, 6));
      dispatch(setDetailList(acctDetails));
    }
  };

  useEffect(init, [transactionDetailRef]);
  useCheckLocation();
  usePageInfo('/api/depositInquiry');

  return (
    <DepositInquiryWrapper small>
      { cardInfo && renderCardArea(cardInfo) }
      <div className="inquiryArea measuredHeight">
        { renderSearchBarArea() }
        { tabId && tabList && renderOnlineTabs(tabList) }
        <div className="transactionDetail" ref={transactionDetailRef}>
          { detailList?.length > 0 ? renderOnlineDetailCardList(detailList) : <EmptyData /> }
        </div>
      </div>
      { renderDownloadDrawer() }
      { renderSearchDrawer(<DepositSearchCondition initKeywords={initKeywords} />) }
    </DepositInquiryWrapper>
  );
};

export default DepositInquiry;
