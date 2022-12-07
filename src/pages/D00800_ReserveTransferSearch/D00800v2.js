/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard/DebitCard';
import InformationTape from 'components/InformationTape';
import { FEIBTabContext, FEIBTabPanel } from 'components/elements';
import FailImage from 'assets/images/failIcon.png';
import SuccessImage from 'assets/images/successIcon.png';
import { currencySymbolGenerator, dateToString } from 'utilities/Generator';
import { showCustomPrompt } from 'utilities/MessageModal';
import { getAccountSummary } from 'pages/C00600_DepositPlan/api';
import { getReservedTransDetails, getResultTransDetails } from 'pages/D00800_ReserveTransferSearch/api';

import { TabField } from './fields/tabField';
import DetailContent from './components/detailContent';
import ResultContent from './components/resultContent';
import { ReserveTransferSearchWrapper } from './D00800.style';
import { DateRangePickerField } from './fields/dateRangePickerField';
import {
  defaultValues, reserveDatePickerLimit, resultDatePickerLimit, tabOptions,
} from './constants';

/* Swiper modules */
SwiperCore.use([Pagination]);

const D00800Draft = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { control, handleSubmit, watch } = useForm({ defaultValues });

  const [cardsList, setCardsList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [reserveDataList, setReserveDataList] = useState([]);
  const [resultDataList, setResultDataList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // const [reserveMap, setReserveMap] = useState();
  // const [resultMap, setResultMap] = useState();
  const watchedTab = watch('tab');

  const onSearch = async ({ tab, reserveDateRange, resultDateRange }) => {
    const sdate = dateToString(tab === '1' ? reserveDateRange[0] : resultDateRange[0]);
    const edate = dateToString(tab === '1' ? reserveDateRange[1] : resultDateRange[1]);

    const param = {
      acctId: selectedAccount.acctId,
      ccycd: selectedAccount.ccyCd,
      accountType: selectedAccount.acctType, // 不確定是否要給 已經由 accountType 改成 acctType
      sdate,
      edate,
      queryType: 3, // 1:網路預約 2:臨櫃預約 3:網銀預約+臨櫃預約 4:存錢計畫預約
    };

    setIsSearching(true);
    if (tab === '1') {
      const { data } = await getReservedTransDetails(param);
      setReserveDataList(data?.bookList);
    }
    if (tab === '2') {
      const { data } = await getResultTransDetails(param);
      setResultDataList(data?.bookList);
    }
    setIsSearching(false);
  };

  // 取得帳號清單
  const fetchTransferOutAccounts = async () => {
    dispatch(setWaittingVisible(true));

    const accounts = await getAccountSummary('MSC');
    if (accounts) {
      setCardsList(accounts);
      setSelectedAccount(accounts[0]);
    }

    dispatch(setWaittingVisible(false));
  };

  const toConfirmPage = (currentReserveData) => {
    history.push('/D008001', { ...currentReserveData, ...selectedAccount });
  };

  // 轉出帳號卡片 swiper
  const renderCard = () => cardsList.map((item) => (
    <SwiperSlide key={item.acctId}>
      <DebitCard
        branch={item.acctBranch}
        cardName={item.acctName || '--'}
        account={item.acctId}
        balance={item.acctBalx}
        dollarSign={item.ccyCd}
        color="purple"
      />
    </SwiperSlide>
  ));

  const handleReserveDataDialogOpen = async (data) => {
    await showCustomPrompt({
      title: '預約轉帳',
      message: <DetailContent contentData={{ data, selectedAccount }} />,
      onOk: () => toConfirmPage(data),
      okContent: '取消交易',
      // onCancel: () => {},
    });
  };

  // 預約轉帳查詢列表
  const renderReserveTapes = () => {
    if (isSearching) return <Loading space="both" isCentered />;
    if (!reserveDataList.length) {
      return (
        <div className="emptyConatiner">
          <EmptyData />
        </div>
      );
    }
    return reserveDataList.map((item) => (
      <InformationTape
        key={item.inActNo}
        topLeft={`${item.inBank}-${item.inActNo}`}
        topRight={currencySymbolGenerator('TWD', item.amount)}
        bottomLeft={`預約轉帳日：${item.payDate}`}
        bottomRight={item.type}
        onClick={() => handleReserveDataDialogOpen(item)}
      />
    ));
  };

  // 打開結果彈窗
  const handleOpenResultDialog = async (data) => {
    await showCustomPrompt({
      title: '預約轉帳結果',
      message: <ResultContent data={data} selectedAccount={selectedAccount} />,
    });
  };

  // 結果查詢列表
  const renderResultTapes = () => {
    if (isSearching) return <Loading space="both" isCentered />;
    if (!resultDataList.length) {
      return (
        <div className="emptyConatiner">
          <EmptyData />
        </div>
      );
    }
    return resultDataList.map((item) => (
      <InformationTape
        key={item.inActNo}
        img={item.stderrMsg ? FailImage : SuccessImage}
        topLeft={`${item.inActNo}`}
        topRight={currencySymbolGenerator('TWD', item.amount)}
        bottomLeft={`交易日期：${item.trnsDate}`}
        onClick={() => handleOpenResultDialog(item)}
      />
    ));
  };

  const renderTabPanels = () => {
    const panelOptions = [
      {
        tabValue: '1',
        datePickerLimit: reserveDatePickerLimit,
        formName: 'reserveDateRange',
        renderMethod: renderReserveTapes,
      },
      {
        tabValue: '2',
        datePickerLimit: resultDatePickerLimit,
        formName: 'resultDateRange',
        renderMethod: renderResultTapes,
      },
    ];

    return panelOptions.map((panel) => (
      <FEIBTabPanel key={panel.tabValue} value={panel.tabValue}>
        <DateRangePickerField
          {...panel.datePickerLimit}
          control={control}
          callback={handleSubmit(onSearch)}
          name={panel.formName}
        />
        {panel.renderMethod()}
      </FEIBTabPanel>
    ));
  };

  const handleChangeSlide = ({ activeIndex }) => setSelectedAccount(cardsList[activeIndex]);

  // 取得帳號列表
  useEffect(() => {
    fetchTransferOutAccounts();
  }, []);

  // 切換帳號搜尋預約明細
  useEffect(() => {
    if (selectedAccount) handleSubmit(onSearch)();
  }, [selectedAccount]);

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
            {renderCard()}
          </Swiper>
        </div>
        <div className="searchResultContainer">
          <FEIBTabContext value={watchedTab}>
            <TabField
              control={control}
              name="tab"
              callback={handleSubmit(onSearch)}
              options={tabOptions}
            />
            {renderTabPanels()}
          </FEIBTabContext>
        </div>
      </ReserveTransferSearchWrapper>
    </Layout>
  );
};

export default D00800Draft;
