/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import { dateToTwYMD } from 'utilities/Generator';
import { switchLoading } from 'utilities/AppScriptProxy';
import { getReservedTransDetails, getResultTransDetails } from 'pages/D00800_ReserveTransferSearch/api';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
  FEIBTabPanel,
} from 'components/elements';
import DebitCard from 'components/DebitCard/DebitCard';
import InformationTape from 'components/InformationTape';
import EmptyData from 'components/EmptyData';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from 'assets/images/icons/clearIcon.svg';
import DateRangePicker from 'components/DateRangePicker';
import SuccessImage from 'assets/images/successIcon.png';
import FailImage from 'assets/images/failIcon.png';
import { showCustomPrompt } from 'utilities/MessageModal';
import { getAccountSummary } from 'pages/C00600_DepositPlan/api'; // TODO 要維持單元功能的獨性，不要耦合
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import DetailContent from './components/detailContent';
import ResultContent from './components/resultContent';

/* Style */
// import ReserveTransferSearchWrapper from './reserveTransferSearch.style';
import { ReserveTransferSearchWrapper } from './D00800.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const ReserveTransferSearch = () => {
  const dispatch = useDispatch();
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
  const [reserveDataList, setReserveDataList] = useState([]);
  const [resultDataList, setResultDataList] = useState([]);

  // 取得帳號清單
  const fetchTransferOutAccounts = async () => {
    dispatch(setWaittingVisible(true));

    const accounts = await getAccountSummary('MSC');
    setCardsList(accounts);
    setSelectedAccount(accounts[0]);

    dispatch(setWaittingVisible(false));
  };

  const toConfirmPage = (currentReserveData) => {
    history.push('/D008001', { ...currentReserveData, ...selectedAccount });
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
    switchLoading(true);
    const param = {
      acctId: selectedAccount.acctId,
      ccycd: selectedAccount.ccyCd,
      accountType: selectedAccount.acctType, // 不確定是否要給
      queryType: '3',
      sdate: dateToTwYMD(reserveDateRange[0]),
      edate: dateToTwYMD(reserveDateRange[1]),
    };
    console.log(reserveDateRange, dateToTwYMD(reserveDateRange[0]));
    const { code, data } = await getReservedTransDetails(param);
    if (code === '0000') {
      setReserveDataList(data?.bookList);
    }
    switchLoading(false);
  };

  // 取得預約轉帳結果
  const fetchResultTransDetails = async () => {
    switchLoading(true);
    const param = {
      acctId: selectedAccount.acctId,
      ccycd: selectedAccount.ccyCd,
      accountType: selectedAccount.acctType, // 不確定是否要給
      // queryType: '3',
      sdate: dateToTwYMD(resultDateRange[0]),
      edate: dateToTwYMD(resultDateRange[1]),
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
        key={item.acctId}
        branch={item.acctBranch}
        cardName={item.acctName || '--'}
        account={item.acctId}
        balance={item.acctBalx}
        dollarSign={item.ccyCd}
        color="purple"
        // freeTransfer={6}
        // freeTransferRemain={item.tfrhCount.length >= 2 ? item.tfrhCount.replace('0', '') : item.tfrhCount}
      />
    </SwiperSlide>
  ));

  const handleReserveDataDialogOpen = async (data) => {
    await showCustomPrompt({
      title: '預約轉帳',
      message: (<DetailContent contentData={{ data, selectedAccount }} />),
      onOk: () => toConfirmPage(data),
      onClose: () => toConfirmPage(data),
    });
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
  const handleOpenResultDialog = async (data) => {
    await showCustomPrompt({
      title: '預約轉帳結果',
      message: <ResultContent data={data} selectedAccount={selectedAccount} />,
    });
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

  // 取得帳號列表
  useEffect(() => {
    fetchTransferOutAccounts();
  }, []);

  // 切換帳號搜尋預約明細
  useEffect(() => {
    if (selectedAccount) {
      if (tabValue === '1') fetchReservedTransDetails();
      if (tabValue === '2') fetchResultTransDetails();
    }
  }, [selectedAccount]);

  // 時間切換搜尋預約明細
  useEffect(() => {
    if (tabValue === '1' && selectedAccount) fetchReservedTransDetails();
  }, [reserveDateRange]);

  useEffect(() => {
    if (tabValue === '2' && selectedAccount) fetchResultTransDetails();
  }, [resultDateRange]);

  return (
    <Layout title="預約轉帳查詢/取消">
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
                    value={reserveDateRange}
                    label=" "
                    onChange={handleClickReserveDateRangePicker}
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
                    value={resultDateRange}
                    label=" "
                    onChange={handleClickResultDateRangePicker}
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
      </ReserveTransferSearchWrapper>
    </Layout>
  );
};

export default ReserveTransferSearch;
