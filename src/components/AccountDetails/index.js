/* eslint-disable no-use-before-define */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import AccountDetailsSearchCondition from 'components/AccountDetailsSearchCondition';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import EmptyData from 'components/EmptyData';
import {
  FEIBIconButton, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import { CrossCircleIcon, DownloadIcon, SearchIcon } from 'assets/images/icons';
import { showDrawer } from 'utilities/MessageModal';
import { stringDateFormatter } from 'utilities/Generator';
import { setDrawerVisible } from 'stores/reducers/ModalReducer';
import theme from 'themes/theme';
import { downloadDepositTransactionReport } from './api';
import {
  setCustomKeyword, setDateRange, setDetailList, setKeywords,
} from './stores/actions';
import AccountDetailsWrapper, { DownloadDrawerWrapper } from './accountDetails.style';

const AccountDetails = ({
  selectedAccount, cardColor, onSearch,
}) => {
  const [tabId, setTabId] = useState('');
  const [tabList, setTabList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [indexRange, setIndexRange] = useState(null);

  const detailList = useSelector(({ accountDetails }) => accountDetails.detailList);
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

  useEffect(() => {
    // 清空查詢條件
    if (selectedAccount) init();
  }, [selectedAccount]);

  const init = async (conds = null) => {
    // 只要有重新查詢交易明細，就必需清除 eof 旗標，否則就不會再補資料了。
    if (indexRange) indexRange.eof = false;

    const response = await onSearch(requestConditions(conds));
    // console.log(response);
    if (response) {
      const { acctTxDtls, monthly } = response;
      // 取得所有存款卡的初始資料後存取月份資料 (Tabs)
      if (acctTxDtls.length) {
        setTabList(monthly.sort((a, b) => b - a));
      }

      // 畫面跳轉至畫面第一筆資料
      if (txnDetailsRef?.current) {
        const target = txnDetailsRef.current.children[0];
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }

      dispatch(setDetailList(acctTxDtls));
    } else dispatch(setDetailList(null));
  };

  /**
   * 下載交易明細清單
   * @param {*} fileType 下載檔案類型, 1:PDF, 2:EXCEL(CSV)
   */
  const handleClickDownloadDetails = async (fileType) => {
    // dispatch(setWaittingVisible(true)); // BUG : 打開、再關閉後，查詢條件會被清掉。
    dispatch(setDrawerVisible(false));
    const conditions = requestConditions({ dateRange, keywords, customKeyword });
    await downloadDepositTransactionReport(fileType, conditions);
    // dispatch(setWaittingVisible(false));
  };

  // 獲取交易明細時需代入的參數條件
  const requestConditions = (conds = null) => {
    const dtRange = (conds?.dateRange ?? ['', '']);
    const selKwds = (conds?.keywords ?? initKeywords);
    const custKwds = (conds?.customKeyword ?? '');

    dispatch(setDateRange(dtRange));
    dispatch(setKeywords(selKwds));
    dispatch(setCustomKeyword(custKwds));

    // tranTP 為類別條件，1 ~ 6 參數分別為：1 跨轉, 2 ATM, 3 存款息, 4 薪轉, 5 付款儲存, 6 自動扣繳
    const tranTPList = [];
    selKwds.forEach((item) => {
      if (item.selected) tranTPList.push(item.name[item.name.length - 1]);
    });

    return {
      account: selectedAccount.acctId,
      beginDT: dtRange[0],
      endDT: dtRange[1],
      tranTP: tranTPList.join(),
      custom: custKwds,
      direct: 1,
      startIndex: (conds?.startIndex ?? 0),
    };
  };

  useEffect(() => {
    if (tabList?.length) setTabId(tabList[0]);
  }, [tabList]);

  /**
   * 找出明細項目索引的範圍。
   */
  useEffect(() => {
    let indexMax = Number.MIN_VALUE;
    let indexMin = Number.MAX_VALUE;
    let inviewMax = Number.MIN_VALUE;
    let inviewMin = Number.MAX_VALUE;

    detailList?.forEach((card) => {
      indexMax = Math.max(indexMax, card.index);
      indexMin = Math.min(indexMin, card.index);
      if (card.inView) {
        inviewMax = Math.max(inviewMax, card.index);
        inviewMin = Math.min(inviewMin, card.index);
      }
    });

    setIndexRange({
      indexMax, indexMin, inviewMax, inviewMin, eof: indexRange?.eof,
    });
  }, [detailList]);

  // 點擊月份頁籤，代入條件：1.帳號, 2.日期起訖範圍, 3.類別, 4.自訂關鍵字, 5.月份
  const handleClickMonthTab = async (event) => {
    // 由點擊的月份頁籤 (Tab) 取得月份條件，固定月份時查詢資料方向為 0 (雙向)
    const month = event.currentTarget.getAttribute('data-month');
    const conditions = {
      ...requestConditions({ dateRange, keywords, customKeyword }),
      month,
      direct: '0', // 資料方向為0，表示取前後各50筆。
      startIndex: '', // Note：不可指定 startIndex 否則將視為一般查詢。
    };
    const response = await onSearch(conditions);
    if (response) {
      dispatch(setDetailList(response.acctTxDtls));
      setTabList(response.monthly.sort((a, b) => b - a));

      // 畫面跳轉至該月份第一筆資料
      const target = Array.from(txnDetailsRef.current.children).find((child) => child.id === month);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      setTabId(month);
    }
  };

  /**
   * 滾動畫面後獲取新的交易明細。   ，代入條件：1.帳號, 2.日期起訖範圍, 3.類別, 4.自訂關鍵字, 5.起始索引值, 6.方向
   * @param {*} scrollDirection 資料方向(-1:看較早前的資料, 1.看較舊的資料）
   * @param {*} startIndex 出現在顯示區首筆的交易明細索引
   * @returns 表示已沒有資料可以取得的旗標。
   */
  const getMoreDetailsData = async (scrollDirection, startIndex) => {
    let isEOF = false;
    // 確認是否正在處理資料請求，唯有未在處理請求時才能再次獲取資料
    if (!isLoading) {
      // 一旦進行資料請求，開啟 isPending 狀態，避免條件符合連續 call api
      setIsLoading(true);

      const conditions = {
        ...requestConditions({ dateRange, keywords, customKeyword }),
        direct: scrollDirection,
        startIndex,
      };
      const response = await onSearch(conditions);
      if (response) {
        const newDetailList = [];
        const newCards = response.acctTxDtls.filter((card) => (card.index < indexRange.indexMin) || (card.index > indexRange.indexMax));
        if (scrollDirection === -1) {
          newDetailList.push(...newCards, ...detailList); // 新明細項目加到陣列-前端
        } else if (scrollDirection === 1) {
          newDetailList.push(...detailList, ...newCards); // 新明細項目加到陣列-後端
          indexRange.eof = (newCards.length === 0);
        }
        dispatch(setDetailList(newDetailList));
        console.log(newCards.length, (newCards.length === 0));
        isEOF = (newCards.length === 0);
      }
    }
    // 資料取回後，解除 isPending 狀態
    setIsLoading(false);
    return isEOF;
  };

  // 判斷畫面捲動方向，當頂/底部的交易明細剩餘 25 筆時正/反向撈取資料
  const visibilitySensorOnChange = async () => {
    if (!isLoading && txnDetailsRef.current) {
      const allCards = Array.from(txnDetailsRef.current.children);
      const inviewCards = allCards.filter((card) => card.dataset.inview === 'Y');
      // console.log(allCards, inviewCards);

      // 捲動畫面時，根據當前畫面上的第一筆明細動態切換月份標籤
      if (inviewCards?.length) setTabId(inviewCards[0].id);

      // 找出目前視景內的明細項目索引範圍。
      let inviewMax = Number.MIN_VALUE;
      let inviewMin = Number.MAX_VALUE;
      inviewCards.forEach((card) => {
        const { index } = card.dataset;
        inviewMax = Math.max(inviewMax, index);
        inviewMin = Math.min(inviewMin, index);
      });

      // 資料方向(-1:看較早前的資料, 1.看較舊的資料）
      const scrollDirection = Math.sign(inviewMin - indexRange.inviewMin);
      // console.log(indexRange, inviewMax, inviewMin, scrollDirection);
      if (scrollDirection !== 0) {
        if (scrollDirection === 1) {
          // 底部明細剩餘數量少於 25 張時，反向獲取接續 50 筆
          if ((indexRange.indexMax - inviewMax) <= 25 && !indexRange.eof) {
            await getMoreDetailsData(scrollDirection, indexRange.indexMax - 1);
          }
        } else if (scrollDirection === -1) {
          // 頂部明細剩餘數量少於 25 張時，反向獲取接續 50 筆
          if ((indexRange.indexMin - inviewMin) <= 25 && (indexRange.indexMin > 1)) {
            await getMoreDetailsData(scrollDirection, inviewMin - 1);
          }
        }
      }

      indexRange.inviewMax = inviewMax;
      indexRange.inviewMin = inviewMin;
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
      <p>{`${stringDateFormatter(date[0])} ~ ${stringDateFormatter(date[1])}`}</p>
      <FEIBIconButton onClick={async () => await init()}>
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
            inView={isVisible ? 'Y' : 'N'}
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
    <DownloadDrawerWrapper>
      <li onClick={() => handleClickDownloadDetails(1)}>
        <p>下載 PDF</p>
        <DownloadIcon className="downloadIcon" />
      </li>
      <li onClick={() => handleClickDownloadDetails(2)}>
        <p>下載 EXCEL</p>
        <DownloadIcon className="downloadIcon" />
      </li>
    </DownloadDrawerWrapper>
  );

  const renderSearchDrawer = () => (
    <AccountDetailsSearchCondition onSearch={init} />
  );

  return (
    <AccountDetailsWrapper small>
      { renderCardArea(selectedAccount) }
      <div className="inquiryArea measuredHeight">

        <div className="searchBar">
          <FEIBIconButton onClick={() => showDrawer('明細搜尋', renderSearchDrawer())}>
            <SearchIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
          { (dateRange?.length && dateRange[0]) ? renderSearchBarText(dateRange) : null }
          <FEIBIconButton className="customPosition" onClick={() => showDrawer('', renderDownloadDrawer())}>
            <DownloadIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
        </div>

        { tabList?.length ? renderMonthTabs(tabList) : null }

        <div className="transactionDetail" ref={txnDetailsRef} style={{ height: 500, maxHeight: 500, overflowY: 'scroll' }}>
          { detailList?.length ? renderDetailCards(detailList) : <EmptyData /> }
          {/* TODO:資料載入中。（ 用 isLoading 判斷 ） */}
        </div>
      </div>
    </AccountDetailsWrapper>
  );
};

export default AccountDetails;
