import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { SearchRounded, CancelRounded, GetAppRounded } from '@material-ui/icons';
import { depositInquiryApi } from 'apis';
import DepositSearchCondition from 'pages/DepositSearchCondition';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import Dialog from 'components/Dialog';
import BottomDrawer from 'components/BottomDrawer';
import CheckboxButton from 'components/CheckboxButton';
import {
  FEIBIconButton, FEIBTabContext, FEIBTabList, FEIBTab, FEIBButton,
} from 'components/elements';
import theme from 'themes/theme';
import DepositInquiryWrapper from './depositInquiry.style';
import {
  setDetailList, setOpenInquiryDrawer, setDateRange, setSelectedKeywords,
} from './stores/actions';

const DepositInquiry = () => {
  const transactionDetailRef = useRef();
  const [tabId, setTabId] = useState('detailList12');
  const [openDownloadDrawer, setOpenDownloadDrawer] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);
  const detailList = useSelector(({ depositInquiry }) => depositInquiry.detailList);
  const openInquiryDrawer = useSelector(({ depositInquiry }) => depositInquiry.openInquiryDrawer);
  const dateRange = useSelector(({ depositInquiry }) => depositInquiry.dateRange);
  const selectedKeywords = useSelector(({ depositInquiry }) => depositInquiry.selectedKeywords);
  const { doGetInitData } = depositInquiryApi;
  const dispatch = useDispatch();

  const handleClickDetailCard = () => {
    setOpenDetailDialog(true);
  };

  const handleClickDialogMainButton = () => {
    setOpenDetailDialog(false);
  };

  const handleChangeTabList = (event, id) => {
    setTabId(id);
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

  const scrollSpy = () => {
    transactionDetailRef.current.addEventListener('scroll', () => {
      const children = Array.from(transactionDetailRef.current.children);
      const childrenLength = children.length;
      if ((childrenLength > 1) && children[1].getBoundingClientRect().top > 283) {
        setTabId(children[0].id);
      } else if ((childrenLength > 2) && children[2].getBoundingClientRect().top > 283) {
        setTabId(children[1].id);
      } else if ((childrenLength > 3) && children[3].getBoundingClientRect().top > 283) {
        setTabId(children[2].id);
      } else if ((childrenLength > 4) && children[4].getBoundingClientRect().top > 283) {
        setTabId(children[3].id);
      } else if ((childrenLength > 5) && children[5].getBoundingClientRect().top > 283) {
        setTabId(children[4].id);
      } else if ((childrenLength > 6) && children[6].getBoundingClientRect().top > 283) {
        setTabId(children[5].id);
      } else if ((childrenLength > 7) && children[7].getBoundingClientRect().top > 283) {
        setTabId(children[6].id);
      } else if ((childrenLength > 8) && children[8].getBoundingClientRect().top > 283) {
        setTabId(children[7].id);
      } else if ((childrenLength > 9) && children[9].getBoundingClientRect().top > 283) {
        setTabId(children[8].id);
      } else if ((childrenLength > 10) && children[10].getBoundingClientRect().top > 283) {
        setTabId(children[9].id);
      } else if ((childrenLength > 11) && children[11].getBoundingClientRect().top > 283) {
        setTabId(children[10].id);
      } else {
        setTabId(children[children.length - 1].id);
      }

      // const detailList11 = document.getElementById('detailList11');
      // const detailList10 = document.getElementById('detailList10');
      // // const detailList09 = document.getElementById('detailList09');
      // if (detailList11 && detailList11.getBoundingClientRect().top > 284) {
      //   setTabId('detailList12');
      // } else if (detailList10 && detailList10.getBoundingClientRect().top > 284) {
      //   setTabId('detailList11');
      // } else {
      //   setTabId('detailList10');
      // }
    });
  };

  const handleClickMonthTabs = async (month) => {
    const monthNumber = month.substr(month.length - 2, 2);
    setTabId(`detailList${monthNumber}`);
    const response = await doGetInitData('/api/depositInquiry');
    if (response[month]) {
      const lastKey = Object.keys(response[month])[Object.keys(response[month]).length - 1];
      dispatch(setDetailList(response[month]));
      // const target = document.getElementById(`detailList${monthNumber}`);
      scrollSpy();
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

  // 捲動時 tabs 切換
  const renderTabs = () => (
    <div className="tabsArea">
      <FEIBTabContext value={tabId}>
        <FEIBTabList onChange={handleChangeTabList} $size="small" className="tabList">
          <FEIBTab label="12月" value="detailList12" href="#detailList12" onClick={() => handleClickMonthTabs('month12')} />
          <FEIBTab label="11月" value="detailList11" href="#detailList11" onClick={() => handleClickMonthTabs('month11')} />
          <FEIBTab label="10月" value="detailList10" href="#detailList10" onClick={() => handleClickMonthTabs('month10')} />
          <FEIBTab label="09月" value="detailList09" href="#detailList09" onClick={() => handleClickMonthTabs('month09')} />
          <FEIBTab label="08月" value="detailList08" href="#detailList08" onClick={() => handleClickMonthTabs('month08')} />
          <FEIBTab label="07月" value="detailList07" href="#detailList07" onClick={() => handleClickMonthTabs('month07')} />
          <FEIBTab label="06月" value="detailList06" href="#detailList06" onClick={() => handleClickMonthTabs('month06')} />
          <FEIBTab label="05月" value="detailList05" href="#detailList05" onClick={() => handleClickMonthTabs('month05')} />
          <FEIBTab label="04月" value="detailList04" href="#detailList04" onClick={() => handleClickMonthTabs('month04')} />
          <FEIBTab label="03月" value="detailList03" href="#detailList03" onClick={() => handleClickMonthTabs('month03')} />
        </FEIBTabList>
      </FEIBTabContext>
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
              onClick={handleClickDetailCard}
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

  // TODO: 交易明細內容傳值
  const renderDetailDialog = () => (
    <Dialog
      isOpen={openDetailDialog}
      onClose={() => setOpenDetailDialog(false)}
      content={<p>交易明細內容</p>}
      action={<FEIBButton onClick={handleClickDialogMainButton}>確定</FEIBButton>}
    />
  );

  const init = async () => {
    // 清空查詢條件
    dispatch(setDateRange(''));
    dispatch(setSelectedKeywords([]));

    // 取得所有存款卡的初始資料
    const response = await doGetInitData('/api/depositInquiry');
    if (response.initData) {
      dispatch(setDetailList(response.initData));
    }

    // TODO: 待解決，此作法將導致連續發送 api 請求
    // transactionDetailRef.addEventListener('scroll', (event) => {
    //   if (event.target.scrollTop < 2000) {
    //     console.log('拿前 50 筆資料');
    //   } else if ((event.target.scrollHeight - event.target.scrollTop) < 2000 ) {
    //     console.log('拿後 50 筆資料');
    //   }
    // });
  };

  // useEffect(async () => {
  //   // 清空查詢條件
  //   dispatch(setDateRange(''));
  //   dispatch(setSelectedKeywords([]));
  //
  //   // 取得所有存款卡的初始資料
  //   const response = await doGetInitData('/api/depositInquiry');
  //   if (response.initData) {
  //     dispatch(setDetailList(response.initData));
  //   }
  // }, []);

  useEffect(init, [transactionDetailRef]);

  useCheckLocation();
  usePageInfo('/api/depositInquiry');

  return (
    <DepositInquiryWrapper small>
      { cardInfo && renderCardArea(cardInfo) }
      <div className="inquiryArea measuredHeight">
        { renderSearchBarArea() }
        { renderTabs() }
        <div className="transactionDetail" ref={transactionDetailRef}>
          { detailList && renderDetailCardList(detailList) }
        </div>
      </div>
      { renderDetailDialog() }
      { renderDownloadDrawer() }
      { renderSearchDrawer(<DepositSearchCondition />) }
    </DepositInquiryWrapper>
  );
};

export default DepositInquiry;
