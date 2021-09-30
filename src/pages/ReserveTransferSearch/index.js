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
    bookType: '單筆',
    trnsDate: '預約轉帳日：2021/01/25',
    payDateWording: '聖誕節禮物',
    payDateEnd: '',
    payDate: '',
    inActNo: '822-00255540253722',
    amount: '$1,200',
  },
  {
    bookType: '週期',
    trnsDate: '預約轉帳日：2021/05/15',
    payDateWording: '每個月15號',
    payDateEnd: '2022/02/28',
    payDate: '2021/05/01',
    inActNo: '822-00255540253722',
    amount: '$1,200',
  },
];

// mock 預約轉帳結果資料
const mockResultData = [
  {
    trnsDate: '2021/01/25',
    inActNo: '822-00255540253722',
    amount: '$1,200',
    stderrMsg: '',
    success: true,
  },
  {
    trnsDate: '2021/01/25',
    inActNo: '822-00255540253722',
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

  const getTransferOutAccounts = async () => {
    // const response = await reserveTransferSearchApi.getTransferOutAccounts({});
    // console.log(response);
    setCardsList(mockAccounts);
  };

  const toConfirmPage = () => {
    history.push('/reserveTransferSearch1');
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
    console.log(range);
    setReserveDateRange(range);
  };

  const handleClickResultDateRangePicker = (range) => {
    console.log(range);
    setResultDateRange(range);
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
      topLeft={item.inActNo}
      topRight={item.amount}
      bottomLeft={item.trnsDate}
      bottomRight={item.bookType}
      onClick={() => setShowDetailDialog(true)}
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
      topLeft={item.inActNo}
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
      content={(<DetailContent />)}
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
              <DateRangePicker
                {...reserveDatePickerLimit}
                date={reserveDateRange}
                label=" "
                onClick={handleClickReserveDateRangePicker}
              />
            </div>
            <div className="tapeList">
              { renderReserveTapes() }
            </div>
          </FEIBTabPanel>
          <FEIBTabPanel value="2">
            <div className="searchDateRange">
              <SearchIcon />
              <DateRangePicker
                {...resultDatePickerLimit}
                date={resultDateRange}
                label=" "
                onClick={handleClickResultDateRangePicker}
              />
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
