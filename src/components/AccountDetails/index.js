import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import AccountDetailsSearchCondition from 'components/AccountDetailsSearchCondition';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import EmptyData from 'components/EmptyData';
import BottomDrawer from 'components/BottomDrawer';
import {
  FEIBIconButton, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import { CrossCircleIcon, DownloadIcon, SearchIcon } from 'assets/images/icons';
import { dateFormatter, stringDateCodeFormatter } from 'utilities/Generator';
import theme from 'themes/theme';
import {
  setCustomKeyword, setDateRange, setDetailList, setKeywords, setOpenInquiryDrawer, setTempDateRange,
} from './stores/actions';
import AccountDetailsWrapper, { DownloadDrawerWrapper } from './accountDetails.style';

const AccountDetails = ({
  selectedAccount, txnDetails, monthly, cardColor, onTabClick, onScroll, onSearch,
}) => {
  const [tabId, setTabId] = useState('');
  const [tabList, setTabList] = useState([]);
  const [openDownloadDrawer, setOpenDownloadDrawer] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [viewerChildren, setViewerChildren] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [inViewChildren, setInViewChildren] = useState([]);

  const detailList = useSelector(({ accountDetails }) => accountDetails.detailList);
  const openInquiryDrawer = useSelector(({ accountDetails }) => accountDetails.openInquiryDrawer);
  const dateRange = useSelector(({ accountDetails }) => accountDetails.dateRange);
  const keywords = useSelector(({ accountDetails }) => accountDetails.keywords);
  const customKeyword = useSelector(({ accountDetails }) => accountDetails.customKeyword);

  const txnDetailsRef = useRef();
  const dispatch = useDispatch();

  const initKeywords = [
    { title: '跨轉', name: 'tranTP1', selected: false },
    { title: 'ATM', name: 'tranTP2', selected: false },
    { title: '存款息', name: 'tranTP3', selected: false },
    { title: '薪轉', name: 'tranTP4', selected: false },
    { title: '付款儲存', name: 'tranTP5', selected: false },
    { title: '自動扣繳', name: 'tranTP6', selected: false },
  ];

  const init = () => {
    // 清空查詢條件
    dispatch(setDateRange([]));
    dispatch(setTempDateRange([]));
    dispatch(setCustomKeyword(''));
    dispatch(setKeywords(initKeywords));

    // 取得所有存款卡的初始資料後存取月份資輛 (Tabs)
    if (txnDetails?.length && monthly?.length) {
      setTabList(monthly);
      setTabId(txnDetails[0].txnDate.substr(0, 6));
    }

    // 畫面跳轉至畫面第一筆資料
    if (txnDetailsRef?.current) {
      const target = txnDetailsRef.current.children[0];
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }

    dispatch(setDetailList(txnDetails));
  };

  // 點擊下載交易明細
  const handleClickDownloadDetails = (format) => {
    setOpenDownloadDrawer(false);
    if (format === 'pdf') {
      // window.location.href = 'url';  // 交易明細下載 (Pdf 格式)
    } else if (format === 'excel') {
      // window.location.href = 'url';  // 交易明細下載 (Excel 格式)
    }
  };

  // 獲取交易明細時需代入的參數條件
  const requestConditions = () => {
    // tranTP 為類別條件，1 ~ 6 參數分別為：1 跨轉, 2 ATM, 3 存款息, 4 薪轉, 5 付款儲存, 6 自動扣繳
    const tranTPList = [];
    keywords.forEach((item) => {
      if (item.selected) tranTPList.push(item.name[item.name.length - 1]);
    });
    return {
      account: selectedAccount.acctId,
      beginDT: dateRange[0] ? stringDateCodeFormatter(dateRange[0]) : '',
      endDT: dateRange[1] ? stringDateCodeFormatter(dateRange[1]) : '',
      tranTP: tranTPList.join(),
      custom: customKeyword,
    };
  };

  useEffect(() => {
    if (tabList?.length) setTabList(tabList.sort((a, b) => b - a));
  }, [tabList]);

  // 點擊月份頁籤，代入條件：1.帳號, 2.日期起訖範圍, 3.類別, 4.自訂關鍵字, 5.月份
  const handleClickMonthTab = async (event) => {
    // 由點擊的月份頁籤 (Tab) 取得月份條件，固定月份時查詢資料方向為 0 (雙向)
    const month = event.currentTarget.getAttribute('data-month');
    const {
      account, beginDT, endDT, tranTP, custom,
    } = requestConditions();

    const conditions = {
      account, beginDT, endDT, tranTP, custom, month, direct: '0',
    };
    const response = await onTabClick(conditions);
    if (response) {
      dispatch(setDetailList(response?.acctDetails));
      setTabList(response?.monthly.sort((a, b) => b - a));

      // 畫面跳轉至該月份第一筆資料
      const target = Array.from(txnDetailsRef.current.children).find((child) => child.id === month);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      setTabId(month);
    }
  };

  // 滾動畫面後獲取新的交易明細，代入條件：1.帳號, 2.日期起訖範圍, 3.類別, 4.自訂關鍵字, 5.起始索引值, 6.方向
  const getMoreDetailsData = async (scrollDirection, startIndex) => {
    const {
      account, beginDT, endDT, tranTP, custom,
    } = requestConditions();
    const direct = scrollDirection === 'up' ? '-1' : '1';
    const newDetailList = [];

    if (startIndex) {
      const conditions = {
        account, beginDT, endDT, tranTP, custom, direct, startIndex,
      };
      const response = await onScroll(conditions);
      if (response) {
        const { acctDetails } = response;
        if (scrollDirection === 'up') {
          newDetailList.push(...acctDetails, ...detailList);
        } else if (scrollDirection === 'down') {
          newDetailList.push(...detailList, ...response.acctDetails);
        }
        dispatch(setDetailList(newDetailList));
      }
    }
    // 資料取回後，解除 isPending 狀態
    setIsPending(false);
  };

  // 確認是否正在處理資料請求，唯有未在處理請求時才能再次獲取資料
  const checkIsPending = (scrollDirection, startIndex) => {
    if (!isPending) {
      // 一旦進行資料請求，開啟 isPending 狀態，避免條件符合連續 call api
      setIsPending(true);
      getMoreDetailsData(scrollDirection, startIndex);
    }
  };

  // 判斷畫面捲動方向，當頂/底部的交易明細剩餘 25 筆時正/反向撈取資料
  const visibilitySensorOnChange = () => {
    if (txnDetailsRef.current) {
      setViewerChildren(Array.from(txnDetailsRef.current.children));
      const inViewList = viewerChildren.filter((item) => item.dataset.inview === 'y');
      setInViewChildren((prev) => {
        if (prev.length > 0 && inViewList.length > 0) {
          // 捲動畫面時，根據當前畫面上的第一筆明細動態切換月份標籤
          setTabId(inViewList[0].id);
          // 當畫面往下捲動
          if (prev[0].dataset.index < inViewList[0].dataset.index) {
            const prevLastIndex = parseInt(prev[prev.length - 1].dataset.index, 10);
            const viewerLastIndex = parseInt(viewerChildren[viewerChildren.length - 1].dataset.index, 10);
            // 底部明細剩餘數量少於 25 張時，由畫面上最後一筆明細索引值 + 1 (viewerLastIndex + 1) 正向獲取接續 50 筆 (50 由資料庫訂定)
            if (viewerLastIndex - prevLastIndex < 25) checkIsPending('down', viewerLastIndex + 1);
            // 當畫面往上捲動
          } else if (prev[0].dataset.index > inViewList[0].dataset.index) {
            const prevFirstIndex = parseInt(prev[0].dataset.index, 10);
            const viewerFirstIndex = parseInt(viewerChildren[0].dataset.index, 10);
            // 頂部明細剩餘數量少於 25 張時，由畫面上第一筆明細索引值 - 1 (viewerFirstIndex - 1) 反向獲取接續 50 筆 (50 由資料庫訂定)
            if (prevFirstIndex - viewerFirstIndex < 25) checkIsPending('up', viewerFirstIndex - 1);
          }
        }
        return inViewList;
      });
    }
  };

  const renderCardArea = (account) => (
    <DebitCard
      cardName={account?.acctName}
      account={account?.acctId}
      balance={account?.acctBalx}
      dollarSign={account?.ccyCd}
      color={cardColor}
    />
  );

  const renderSearchBarText = (date) => (
    <div className="searchCondition">
      <p>{`${dateFormatter(new Date(date[0]))} ~ ${dateFormatter(new Date(date[1]))}`}</p>
      <FEIBIconButton onClick={init}>
        <CrossCircleIcon />
      </FEIBIconButton>
    </div>
  );

  const renderMonthTabs = (monthList) => (
    <div className="tabsArea">
      <FEIBTabContext value={tabId}>
        <FEIBTabList onChange={(event, id) => setTabId(id)} $size="small" className="tabList">
          { monthList.map((month) => (
            <FEIBTab
              key={month}
              label={`${month.substr(4, 2)}月`}
              value={month}
              data-month={month}
              onClick={handleClickMonthTab}
            />
          )) }
        </FEIBTabList>
      </FEIBTabContext>
    </div>
  );

  const renderDetailCards = (list) => (
    list.map((card) => (
      <VisibilitySensor
        key={card.index}
        onChange={visibilitySensorOnChange}
        containment={txnDetailsRef.current}
      >
        {({ isVisible }) => (
          <DetailCard
            id={card.txnDate.substr(0, 6)}
            index={card.index}
            inView={isVisible ? 'y' : 'n'}
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
            noShadow
          />
        )}
      </VisibilitySensor>
    ))
  );

  const renderDownloadDrawer = () => (
    <BottomDrawer
      isOpen={openDownloadDrawer}
      onClose={() => setOpenDownloadDrawer(false)}
      content={(
        <DownloadDrawerWrapper>
          <li onClick={() => handleClickDownloadDetails('pdf')}>
            <p>下載 PDF</p>
            <DownloadIcon className="downloadIcon" />
          </li>
          <li onClick={() => handleClickDownloadDetails('excel')}>
            <p>下載 EXCEL</p>
            <DownloadIcon className="downloadIcon" />
          </li>
        </DownloadDrawerWrapper>
      )}
    />
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

  useEffect(init, [txnDetailsRef]);

  return (
    <AccountDetailsWrapper small>
      { renderCardArea(selectedAccount) }
      <div className="inquiryArea measuredHeight">

        <div className="searchBar">
          <FEIBIconButton onClick={() => dispatch(setOpenInquiryDrawer(true))}>
            <SearchIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
          { (dateRange.length > 0) && renderSearchBarText(dateRange) }
          <FEIBIconButton className="customPosition" onClick={() => setOpenDownloadDrawer(true)}>
            <DownloadIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
        </div>

        { tabList?.length ? renderMonthTabs(tabList) : null }

        <div className="transactionDetail" ref={txnDetailsRef}>
          { detailList?.length ? renderDetailCards(detailList) : <EmptyData /> }
        </div>

      </div>

      { renderDownloadDrawer() }
      { renderSearchDrawer(
        <AccountDetailsSearchCondition
          init={init}
          requestConditions={requestConditions}
          setTabList={setTabList}
          setTabId={setTabId}
          onSearch={onSearch}
        />,
      ) }
    </AccountDetailsWrapper>
  );
};

export default AccountDetails;
