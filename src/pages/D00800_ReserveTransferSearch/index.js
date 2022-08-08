/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { dateFormatter } from 'utilities/Generator';
import { switchLoading, closeFunc } from 'utilities/AppScriptProxy';
import { getTransferOutAccounts, getReservedTransDetails, getResultTransDetails } from 'pages/D00800_ReserveTransferSearch/api';

/* Elements */
import Header from 'components/Header';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
  FEIBTabPanel,
  FEIBButton,
} from 'components/elements';
import DebitCard from 'components/DebitCard';
import InformationTape from 'components/InformationTape';
import Dialog from 'components/Dialog';
import EmptyData from 'components/EmptyData';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from 'assets/images/icons/clearIcon.svg';
import DateRangePicker from 'components/DateRangePicker';
import SuccessImage from 'assets/images/successIcon.png';
import FailImage from 'assets/images/failIcon.png';
import theme from 'themes/theme';
import DetailContent from './detailContent';
import ResultContent from './resultContent';

/* Style */
import ReserveTransferSearchWrapper from './reserveTransferSearch.style';

const ReserveTransferSearch = () => {
  const history = useHistory();
  const reserveDatePickerLimit = {
    minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
  };
  const resultDatePickerLimit = {
    minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
    maxDate: new Date(),
  };
  const [cardsList, setCardsList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [tabValue, setTabValue] = useState('1');
  const [reserveDateRange, setReserveDateRange] = useState([new Date(new Date().setDate(new Date().getDate() + 1)), new Date(new Date().setFullYear(new Date().getFullYear() + 2))]);
  const [resultDateRange, setResultDateRange] = useState([new Date(new Date().setFullYear(new Date().getFullYear() - 2)), new Date()]);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialogData, setResultDialogData] = useState({});
  const [currentReserveData, setCurrentReserveData] = useState({});
  const [reserveDataList, setReserveDataList] = useState([]);
  const [resultDataList, setResultDataList] = useState([]);
  const [dialogModal, setDialogModal] = useState({
    open: false,
    content: '',
  });

  // 關閉訊息彈窗
  const closeDialog = () => {
    setDialogModal({
      open: false,
      content: '',
    });
    closeFunc();
  };

  // 取得帳號清單
  const fetchTransferOutAccounts = async () => {
    switchLoading(true);
    const { data, code, message } = await getTransferOutAccounts({});
    if (code === '0000') {
      setCardsList(data.accounts);
      setSelectedAccount(data.accounts[0]);
      switchLoading(false);
    } else {
      setDialogModal({
        open: true,
        content: `${message}(${code})`,
      });
      switchLoading(false);
      closeFunc();
    }
  };

  const toConfirmPage = () => {
    console.log({ ...currentReserveData, ...selectedAccount });
    history.push('/reserveTransferSearch1', { ...currentReserveData, ...selectedAccount });
  };

  // eslint-disable-next-line no-unused-vars
  const handleChangeSlide = (swiper) => {
    const { activeIndex } = swiper;
    setSelectedAccount(cardsList[activeIndex]);
  };

  const handleClickReserveDateRangePicker = (range) => {
    setReserveDateRange(range);
  };

  const handleClickResultDateRangePicker = (range) => {
    setResultDateRange(range);
  };

  const clearReserveDateRange = () => {
    setReserveDateRange([null, null]);
  };

  const clearResultDateRange = () => {
    setResultDateRange([null, null]);
  };

  // 取得預約轉帳明細
  const fetchReservedTransDetails = async () => {
    setReserveDataList([]);
    switchLoading(true);
    const param = {
      acctId: selectedAccount.accountId,
      ccycd: selectedAccount.ccyCd,
      accountType: selectedAccount.accountType,
      queryType: '3',
      sdate: dateFormatter(reserveDateRange[0]),
      edate: dateFormatter(reserveDateRange[1]),
    };
    const { code, data } = await getReservedTransDetails(param);
    if (code === '0000') {
      setReserveDataList(data?.bookList);
    }
    switchLoading(false);
  };

  // 取得預約轉帳結果
  const fetchResultTransDetails = async () => {
    setResultDataList([]);
    switchLoading(true);
    const param = {
      acctId: selectedAccount.accountId,
      ccycd: selectedAccount.ccyCd,
      accountType: selectedAccount.accountType,
      // queryType: '3',
      sdate: dateFormatter(resultDateRange[0]),
      edate: dateFormatter(resultDateRange[1]),
    };
    const { code, data } = await getResultTransDetails(param);
    if (code === '0000') {
      setResultDataList(data?.bookList);
    }
    switchLoading(false);
  };

  const handleTabChange = (event, type) => {
    if (type !== tabValue) {
      if (type === '1') {
        fetchReservedTransDetails();
      }
      if (type === '2') {
        fetchResultTransDetails();
      }
      setTabValue(type);
    }
  };

  // 轉出帳號卡片 swiper
  const renderCard = () => cardsList.map((item, idx) => (
    <SwiperSlide key={idx}>
      <DebitCard
        key={item.accountId}
        branch={item.branchId}
        cardName={item.showName || '--'}
        account={item.accountId}
        balance={item.balance}
        dollarSign={item.ccyCd}
        transferTitle="跨轉優惠"
        transferLimit={6}
        transferRemaining={item.tfrhCount.length >= 2 ? item.tfrhCount.replace('0', '') : item.tfrhCount}
        color="purple"
      />
    </SwiperSlide>
  ));

  const handleReserveDataDialogOpen = (data) => {
    setCurrentReserveData(data);
    setShowDetailDialog(true);
  };

  // 預約轉帳查詢列表
  const renderReserveTapes = () => reserveDataList.map((item, idx) => (
    <InformationTape
      key={idx}
      topLeft={`${item.inBank}-${item.inActNo}`}
      topRight={`$ ${item.amount}`}
      bottomLeft={`預約轉帳日：${item.payDate}`}
      bottomRight={item.type}
      onClick={() => handleReserveDataDialogOpen(item)}
    />
  ));

  // 打開結果彈窗
  const handleOpenResultDialog = (data) => {
    setResultDialogData(data);
    setShowResultDialog(true);
  };

  // 結果查詢列表
  const renderResultTapes = () => resultDataList.map((item, idx) => (
    <InformationTape
      key={idx}
      img={item.stderrMsg ? FailImage : SuccessImage}
      topLeft={`${item.inActNo}`}
      topRight={`$ ${item.amount}`}
      bottomLeft={`交易日期：${item.trnsDate}`}
      onClick={() => handleOpenResultDialog(item)}
    />
  ));

  // 預約轉帳明細彈窗
  const renderDetailDialog = () => (
    <Dialog
      title="預約轉帳"
      isOpen={showDetailDialog}
      onClose={() => setShowDetailDialog(false)}
      content={(<DetailContent contentData={{ data: currentReserveData, selectedAccount }} />)}
      action={(
        <FEIBButton
          $color={theme.colors.text.dark}
          $bgColor={theme.colors.background.cancel}
          onClick={toConfirmPage}
        >
          取消交易
        </FEIBButton>
      )}
    />
  );

  // 轉帳結果明細彈窗
  const renderResultDialog = () => (
    <Dialog
      title="預約轉帳結果"
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(<ResultContent data={resultDialogData} selectedAccount={selectedAccount} />)}
    />
  );

  // 訊息顯示窗
  const renderDialog = () => (
    <Dialog
      isOpen={dialogModal.open}
      onClose={closeDialog}
      content={<p>{dialogModal.content}</p>}
      action={(
        <FEIBButton onClick={closeDialog}>確定</FEIBButton>
      )}
    />
  );

  // 取得帳號列表
  useEffect(() => {
    fetchTransferOutAccounts();
  }, []);

  // 切換帳號搜尋預約明細
  useEffect(() => {
    if (selectedAccount) {
      if (tabValue === '1') {
        fetchReservedTransDetails();
      }
      if (tabValue === '2') {
        fetchResultTransDetails();
      }
    }
  }, [selectedAccount]);

  // 時間切換搜尋預約明細
  useEffect(() => {
    if (tabValue === '1' && selectedAccount) {
      fetchReservedTransDetails();
    }
  }, [reserveDateRange]);

  useEffect(() => {
    if (tabValue === '2' && selectedAccount) {
      fetchResultTransDetails();
    }
  }, [resultDateRange]);

  return (
    <>
      <Header title="預約轉帳查詢/取消" />
      <ReserveTransferSearchWrapper className="searchResult">
        <div className="cardArea">
          <Swiper
            slidesPerView={1.14}
            spaceBetween={8}
            centeredSlides
            pagination
            onSlideChange={handleChangeSlide}
          >
            { renderCard() }
          </Swiper>
        </div>
        <div className="searchResultContainer">
          <FEIBTabContext value={tabValue}>
            <FEIBTabList onChange={handleTabChange} $size="small" $type="fixed">
              <FEIBTab label="預約查詢" value="1" />
              <FEIBTab label="結果查詢" value="2" />
            </FEIBTabList>
            <FEIBTabPanel value="1">
              <div className="searchDateRange">
                <SearchIcon />
                <div>
                  <DateRangePicker
                    {...reserveDatePickerLimit}
                    date={reserveDateRange}
                    label=" "
                    onClick={handleClickReserveDateRangePicker}
                  />
                  <img className="clearImg" src={ClearIcon} alt="" onClick={clearReserveDateRange} />
                </div>
              </div>
              {
                reserveDataList.length > 0 ? (
                  <div className="tapeList">
                    { renderReserveTapes() }
                  </div>
                ) : (<div className="emptyConatiner"><EmptyData /></div>)
              }
            </FEIBTabPanel>
            <FEIBTabPanel value="2">
              <div className="searchDateRange">
                <SearchIcon />
                <div>
                  <DateRangePicker
                    {...resultDatePickerLimit}
                    date={resultDateRange}
                    label=" "
                    onClick={handleClickResultDateRangePicker}
                  />
                  <img className="clearImg" src={ClearIcon} alt="" onClick={clearResultDateRange} />
                </div>
              </div>
              {
                resultDataList.length > 0 ? (
                  <div className="tapeList">
                    { renderResultTapes() }
                  </div>
                ) : (<div className="emptyConatiner"><EmptyData /></div>)
              }
            </FEIBTabPanel>
          </FEIBTabContext>
        </div>
        {renderDetailDialog()}
        {renderResultDialog()}
        {renderDialog()}
      </ReserveTransferSearchWrapper>
    </>
  );
};

export default ReserveTransferSearch;
