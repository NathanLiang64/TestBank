/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { reserveTransferSearchApi } from 'apis';

/* Elements */
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

// mock account data
const mockAccounts = [
  {
    cardName: '保時捷車友會',
    dollarSign: 'TWD',
    cardAccount: '04300499001234',
    cardBalance: 2000000,
    transferRemaining: 3,
  },
  {
    cardName: '保時捷車友會',
    dollarSign: 'TWD',
    cardAccount: '04300499001234',
    cardBalance: 2000000,
    transferRemaining: 3,
  },
];

// mock 預約轉帳查詢資料
const mockReserveTransData = [
  {
    bookType: '1',
    trnsDate: '2021/01/25',
    payDateWording: '',
    payDateEnd: '',
    payDate: '',
    bankCode: '805',
    inActNo: '00255540253722',
    outActNo: '0430099001234',
    amount: '$1,200',
    remark: '',
  },
  {
    bookType: '2',
    trnsDate: '2021/05/15',
    payDateWording: '每個月15號',
    payDateEnd: '2022/02/28',
    payDate: '2021/05/01',
    bankCode: '805',
    inActNo: '00255540253722',
    outActNo: '0430099001234',
    amount: '$1,200',
    remark: '聖誕節禮物',
  },
];

// mock 預約轉帳結果資料
const mockResultData = [
  {
    trnsDate: '2021/01/25',
    bankCode: '805',
    inActNo: '00255540253722',
    amount: '$1,200',
    stderrMsg: '',
    success: true,
  },
  {
    trnsDate: '2021/01/25',
    bankCode: '805',
    inActNo: '00255540253722',
    amount: '$1,200',
    stderrMsg: '餘額不足',
    success: false,
  },
];

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
  const [tabValue, setTabValue] = useState('1');
  const [reserveDateRange, setReserveDateRange] = useState([new Date(new Date().setDate(new Date().getDate() + 1)), new Date(new Date().setFullYear(new Date().getFullYear() + 2))]);
  const [resultDateRange, setResultDateRange] = useState([new Date(new Date().setFullYear(new Date().getFullYear() - 2)), new Date()]);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [resultDialogData, setResultDialogData] = useState({});
  const [currentReserveData, setCurrentReserveData] = useState({});

  const getTransferOutAccounts = async () => {
    // const response = await reserveTransferSearchApi.getTransferOutAccounts({});
    // console.log(response);
    setCardsList(mockAccounts);
  };

  const toConfirmPage = () => {
    history.push('/reserveTransferSearch1', currentReserveData);
  };

  // eslint-disable-next-line no-unused-vars
  const handleChangeSlide = (swiper) => {
    // setCurrentAccount(mockAccounts[swiper.realIndex]);
    console.log(swiper);
  };

  const handleTabChange = (event, type) => {
    if (type !== tabValue) {
      setTabValue(type);
    }
  };

  const handleClickReserveDateRangePicker = (range) => {
    setReserveDateRange(range);
  };

  const handleClickResultDateRangePicker = (range) => {
    console.log(range);
    setResultDateRange(range);
  };

  const clearReserveDateRange = () => {
    setReserveDateRange([null, null]);
  };

  const clearResultDateRange = () => {
    setResultDateRange([null, null]);
  };

  const handleReserveDataDialogOpen = (data) => {
    console.log(data);
    setCurrentReserveData(data);
    setShowDetailDialog(true);
  };

  // 轉出帳號卡片 swiper
  const renderCard = () => cardsList.map((item) => (
    <SwiperSlide>
      <DebitCard
        key={item.account}
        branch={item.cardBranch}
        cardName={item.cardName}
        account={item.cardAccount}
        balance={item.cardBalance}
        dollarSign={item.dollarSign}
        transferTitle="跨轉優惠"
        transferLimit={5}
        transferRemaining={item.transferRemaining}
        color="purple"
      />
    </SwiperSlide>
  ));

  // 預約轉帳查詢列表
  const renderReserveTapes = () => mockReserveTransData.map((item) => (
    <InformationTape
      topLeft={`${item.bankCode}-${item.inActNo}`}
      topRight={item.amount}
      bottomLeft={`預約轉帳日：${item.trnsDate}`}
      bottomRight={item.bookType === '1' ? '單筆' : '週期'}
      onClick={() => handleReserveDataDialogOpen(item)}
    />
  ));

  // 打開結果彈窗
  const handleOpenResultDialog = (data) => {
    setResultDialogData(data);
    setShowResultDialog(true);
  };

  // 結果查詢列表
  const renderResultTapes = () => mockResultData.map((item) => (
    <InformationTape
      img={item.stderrMsg ? FailImage : SuccessImage}
      topLeft={`${item.bankCode}-${item.inActNo}`}
      topRight={item.amount}
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
      content={(<DetailContent data={currentReserveData} />)}
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
      content={(<ResultContent data={resultDialogData} />)}
    />
  );

  useCheckLocation();
  usePageInfo('/api/reserveTransferSearch');

  useEffect(() => {
    getTransferOutAccounts();
  }, []);

  return (
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
            <div className="tapeList">
              { renderReserveTapes() }
            </div>
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
            <div className="tapeList">
              { renderResultTapes() }
            </div>
          </FEIBTabPanel>
        </FEIBTabContext>
      </div>
      {renderDetailDialog()}
      {renderResultDialog()}
    </ReserveTransferSearchWrapper>
  );
};

export default ReserveTransferSearch;
