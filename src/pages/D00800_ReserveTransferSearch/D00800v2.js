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

import { closeFunc } from 'utilities/AppScriptProxy';
import { TabField } from './fields/tabField';
import DetailContent from './components/detailContent';
import ResultContent from './components/resultContent';
import { ReserveTransferSearchWrapper } from './D00800.style';
import { DateRangePickerField } from './fields/dateRangePickerField';
import {
  defaultValues, reserveDatePickerLimit, resultDatePickerLimit, tabOptions,
} from './constants';
import { getReservedTransDetails, getResultTransDetails, getAccountSummary} from './api';

/* Swiper modules */
SwiperCore.use([Pagination]);

const D00800Draft = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [accountsList, setAccountsList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchList, setSearchList] = useState({
    reserve: undefined,
    result: undefined,
  });
  const { control, handleSubmit, watch } = useForm({ defaultValues });
  const watchedTab = watch('tab');

  const onSearch = async ({ tab, reserveDateRange, resultDateRange }) => {
    const sdate = dateToString(tab === '1' ? reserveDateRange[0] : resultDateRange[0]);
    const edate = dateToString(tab === '1' ? reserveDateRange[1] : resultDateRange[1]);
    const {acctId, ccycd, accountType} = selectedAccount;
    const param = {
      acctId, ccycd, accountType, sdate, edate, queryType: 3,
    };

    if (tab === '1') {
      const { bookList } = await getReservedTransDetails(param);
      setSearchList((prevSearchList) => ({
        ...prevSearchList,
        reserve: { ...prevSearchList.reserve, [selectedAccount.acctId]: bookList},
      }));
    }
    if (tab === '2') {
      const { bookList } = await getResultTransDetails(param);
      setSearchList((prevSearchList) => ({
        ...prevSearchList,
        result: { ...prevSearchList.result, [selectedAccount.acctId]: bookList },
      }));
    }
  };

  // 取得帳號清單
  const fetchTransferOutAccounts = async () => {
    dispatch(setWaittingVisible(true));

    const accounts = await getAccountSummary('MSC');
    if (accounts.length) {
      setAccountsList(accounts);
      setSelectedAccount(accounts[0]);
    } else showCustomPrompt({message: '無帳戶資訊', onClose: closeFunc});

    dispatch(setWaittingVisible(false));
  };

  const toConfirmPage = (reserveData) => {
    history.push('/D008001', { ...reserveData, ...selectedAccount });
  };

  // 轉出帳號卡片 swiper
  const renderCard = () => accountsList.map((item) => (
    <SwiperSlide key={item.acctId}>
      <DebitCard
        branch={item.acctBranch}
        cardName={item.acctName || '--'}
        account={item.acctId}
        balance={item.acctBalx}
        dollarSign={item.ccycd}
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
    const { reserve } = searchList;
    if (!reserve || !reserve[selectedAccount.acctId]) return <Loading space="both" isCentered />;
    if (!reserve[selectedAccount.acctId].length) {
      return (
        <div className="emptyConatiner">
          <EmptyData />
        </div>
      );
    }

    return reserve[selectedAccount.acctId].map((item) => (
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
    const { result } = searchList;
    if (!result || !result[selectedAccount.acctId]) return <Loading space="both" isCentered />;
    if (!result[selectedAccount.acctId].length) {
      return (
        <div className="emptyConatiner">
          <EmptyData />
        </div>
      );
    }

    return result[selectedAccount.acctId].map((item) => (
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

  const handleChangeSlide = ({ activeIndex }) => setSelectedAccount(accountsList[activeIndex]);

  // 取得帳號列表
  useEffect(() => {
    fetchTransferOutAccounts();
  }, []);

  // 切換帳號或是切換Tab的時候搜尋預約明細
  useEffect(() => {
    if (!selectedAccount) return;
    const searchObj = watchedTab === '1' ? searchList.reserve : searchList.result;
    const selectedAcctId = selectedAccount.acctId;
    if (searchObj && searchObj[selectedAcctId]) return;
    handleSubmit(onSearch)();
  }, [selectedAccount, watchedTab]);

  console.log('searchList', searchList);
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
