import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import SearchCondition from 'components/AccountDetails/searchCondition';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import EmptyData from 'components/EmptyData';
import {
  FEIBIconButton, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import Loading from 'components/Loading';
import { /* setWaittingVisible, */ setDrawerVisible } from 'stores/reducers/ModalReducer';
import { showDrawer } from 'utilities/MessageModal';
import { stringDateFormatter } from 'utilities/Generator';
import { CrossCircleIcon, DownloadIcon, SearchIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import { getDepositBook } from './api';
import AccountDetailsWrapper, { DownloadDrawerWrapper } from './accountDetails.style';

/**
 * 交易明細頁
 * 支援：C00300, C00400, C00500
 */
const AccountDetails = ({
  selectedAccount, onSearch,
}) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false); // 表示正在執行載入交易明細的 API
  const [monthes, setMonthes] = useState([]);
  const [currMonth, setCurrMonth] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [condition, setCondition] = useState(null); // 目前的查詢條件。
  const txnDetailsRef = useRef();

  /**
   * 查詢條件變更時，重新查詢，並重建清單陣列。
   */
  useEffect(async () => {
    // dispatch(setWaittingVisible(true));
    setIsLoading(true);

    const response = await onSearch(condition);
    if (response) {
      const { acctTxDtls, monthly } = response;

      setTransactions(acctTxDtls);

      // 畫面跳轉至畫面第一筆資料
      if (txnDetailsRef?.current) {
        let currItem = txnDetailsRef.current.children[0];
        if (condition?.dataMonth) {
          // 畫面跳轉至該月份第一筆資料
          currItem = Array.from(txnDetailsRef.current.children).find((child) => child.id === condition.dataMonth);
        }

        if (currItem) currItem.scrollIntoView({ behavior: 'smooth' });
      }

      // 取得所有存款卡的初始資料後存取月份資料 (Tabs)
      if (monthly.length) setMonthes(monthly.sort((a, b) => b - a));
    }

    setIsLoading(false);
    // dispatch(setWaittingVisible(false));
  }, [condition]);

  /**
   * 彈出 進階查詢 功能。
   */
  const showSearchDrawer = () => {
    const closeDrawer = () => { dispatch(setDrawerVisible(false)); };
    const content = (
      <SearchCondition
        condition={condition}
        onSearch={(newCond) => {
          closeDrawer();
          setCondition(newCond);
        }}
        onCancel={closeDrawer}
      />
    );
    showDrawer('查詢條件', content);
  };

  /**
   * 彈出 查詢結果下載功能選單。
   */
  const showDownloadDrawer = () => {
    /**
     * 下載交易明細清單
     * @param {*} fileType 下載檔案類型, 1:PDF, 2:EXCEL(CSV)
     */
    const handleDownloadDetails = async (fileType) => {
      // dispatch(setWaittingVisible(true)); // BUG : 打開、再關閉後，查詢條件會被清掉。
      dispatch(setDrawerVisible(false));
      await getDepositBook(fileType, condition);
      // dispatch(setWaittingVisible(false));
    };

    const content = (
      <DownloadDrawerWrapper>
        <li onClick={() => handleDownloadDetails(1)}>
          <p>下載 PDF</p>
          <DownloadIcon className="downloadIcon" />
        </li>
        <li onClick={() => handleDownloadDetails(2)}>
          <p>下載 EXCEL</p>
          <DownloadIcon className="downloadIcon" />
        </li>
      </DownloadDrawerWrapper>
    );
    showDrawer('', content);
  };

  /**
   * 顯示 啟用查詢明細頁的帳號 資訊卡
   * @param {*} account 啟用查詢明細頁的帳號資料
   */
  const renderCardArea = (account) => (
    <DebitCard
      cardName={account?.acctName}
      account={account?.acctId}
      balance={account?.acctBalx}
      dollarSign={account?.ccyCd}
      color={account?.cardColor}
    />
  );

  /**
   * 顯示 查詢日期區間
   * @param {*} cond 目前的查詢條件。
   */
  const renderSearchBarText = (cond) => {
    if (!cond || !cond.beginDT) return null; // 沒有設定查詢日期區間，就不顯示。
    return (
      <div className="searchCondition">
        <p>{`${stringDateFormatter(cond.beginDT)} ~ ${stringDateFormatter(cond.endDT)}`}</p>
        <FEIBIconButton onClick={() => setCondition(null)}>
          <CrossCircleIcon />
        </FEIBIconButton>
      </div>
    );
  };

  /**
   * 顯示 查詢結果的月份清單。
   * @param {*} items 查詢結果的月份資料。
   */
  const renderMonthTabs = (items) => {
    if (!items?.length) return null;

    // 點擊月份頁籤，以目前查詢條件再加上指定月份為新的查詢條件。
    const handleClickMonthTab = async (event) => {
      // 由點擊的月份頁籤 (Tab) 取得月份條件，固定月份時查詢資料方向為 0 (雙向)
      const month = event.currentTarget.getAttribute('data-month');
      const newCondition = {
        ...condition,
        dataMonth: month,
        direct: '0', // 資料方向為0，表示取前後各50筆。
        startIndex: '', // Note：不可指定 startIndex 否則將視為一般查詢。
      };
      setCondition(newCondition);
      // setCurrMonth(month);
    };

    return (
      <div className="tabsArea">
        <FEIBTabContext value={currMonth ?? items[0]}>
          <FEIBTabList onChange={(event, id) => setCurrMonth(id)} $size="small" className="tabList">
            { items.map((month) => (
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
  };

  /**
   * 顯示 查詢結果的明細清單。
   * @param {*} items 查詢結果的明細資料。
   */
  const renderDetailCards = (items) => {
    if (!items || items.length === 0) return null;

    return (
      items.map((card) => (
        <VisibilitySensor
          key={card.index}
          active={false} // Note: 加了就能解決在切換月份時，重覆觸發 visibilitySensorOnChange 的狀況。
          // TODO onChange={visibilitySensorOnChange}
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
  };

  /**
   * 主頁面
   */
  return (
    <AccountDetailsWrapper small>
      { renderCardArea(selectedAccount) }
      <div className="inquiryArea measuredHeight">

        <div className="searchBar">
          <FEIBIconButton onClick={showSearchDrawer}>
            <SearchIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
          { renderSearchBarText(condition) }
          <FEIBIconButton className="customPosition" onClick={showDownloadDrawer}>
            <DownloadIcon size={20} color={theme.colors.text.dark} />
          </FEIBIconButton>
        </div>

        { renderMonthTabs(monthes) }

        {/* TODO transactionDetail 的 height: 500, maxHeight: 500 不應該是固定值 */}
        <div className="transactionDetail" ref={txnDetailsRef} style={{ height: 500, maxHeight: 500, overflowY: 'scroll' }}>
          { renderDetailCards(transactions) ?? <EmptyData /> }
          { isLoading && <Loading space="both" isCentered /> }
        </div>
      </div>
    </AccountDetailsWrapper>
  );
};

export default AccountDetails;
