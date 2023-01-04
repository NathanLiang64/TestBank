/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';

import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard/DebitCard';
import InformationTape from 'components/InformationTape';
import { FEIBTabContext, FEIBTabPanel } from 'components/elements';
import FailImage from 'assets/images/failIcon.png';
import SuccessImage from 'assets/images/successIcon.png';
import { currencySymbolGenerator, dateToString, dateToYMD } from 'utilities/Generator';
import { showCustomPrompt } from 'utilities/MessageModal';

import { getAccountsList, getBankCode } from 'utilities/CacheData';
import SearchIcon from '@material-ui/icons/Search';

import DateRangePicker from 'components/DateRangePicker';
import { TabField } from './fields/tabField';
import DetailContent from './components/detailContent';
import ResultContent from './components/resultContent';
import { ReserveTransferSearchWrapper } from './D00800.style';
import {
  defaultValues, tabOptions, RESERVE_DATE_RANGE, TAB, RESULT_DATE_RANGE, panelOptions,
} from './constants';
import { getReservedTransDetails, getResultTransDetails } from './api';

/* Swiper modules */
SwiperCore.use([Pagination]);

const D00800 = () => {
  const history = useHistory();
  const [accountsList, setAccountsList] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchList, setSearchList] = useState({ reserve: {}, result: {}});
  const [banks, setBanks] = useState();
  const {control, handleSubmit, watch } = useForm({ defaultValues });
  const [curTab, curReserveRange, curResultRange] = watch([TAB, RESERVE_DATE_RANGE, RESULT_DATE_RANGE]);
  const currentValue = {
    startDay: dateToString(curTab === '1' ? curReserveRange[0] : curResultRange[0], ''),
    endDay: dateToString(curTab === '1' ? curReserveRange[1] : curResultRange[1], ''),
    searchObj: curTab === '1' ? searchList.reserve : searchList.result,
  };

  const onSearch = async ({ tab, reserveDateRange, resultDateRange }) => {
    const startDay = dateToYMD(tab === '1' ? reserveDateRange[0] : resultDateRange[0]);
    const endDay = dateToYMD(tab === '1' ? reserveDateRange[1] : resultDateRange[1]);
    const { accountNo } = selectedAccount;
    const param = { accountNo, startDay, endDay };

    // ??? 不同帳號的 reservedTransDetails 與 getResultTransDetails 回傳的資料結構不一樣.... 後續需請後端更正
    const type = tab === '1' ? 'reserve' : 'result';
    const detailsRes = tab === '1' ? await getReservedTransDetails(param) : await getResultTransDetails(param);
    setSearchList((prevSearchList) => ({
      ...prevSearchList,
      [type]: { ...prevSearchList[type], [`${accountNo}_${startDay}_${endDay}`]: detailsRes },
    }));

    if (banks) return;
    const bankCodeRes = await getBankCode();
    setBanks(bankCodeRes);
  };

  // 取得帳號清單
  const fetchTransferOutAccounts = async () => {
    let accountsListRes;
    await getAccountsList('MSC', async (accts) => {
      setAccountsList(accts);
      accountsListRes = accts;
      setSelectedAccount(accts[0]);
    });
    // TODO 若無 MSC 類別的帳戶，要給什麼提示訊息給使用者
    return accountsListRes.length ? null : '您還沒有任何台幣存款帳戶。';
  };

  const findBankName = (receiveBank) => {
    if (!banks) return '';
    const { bankName } = banks.find(
      ({ bankNo }) => bankNo === receiveBank,
    );
    return bankName ?? '';
  };

  const toConfirmPage = (data) => {
    const bankName = findBankName(data.receiveBank);
    const reserveData = {...data, bankName};
    history.push('/D008001', { reserveData, selectedAccount });
  };

  // 轉出帳號卡片 swiper
  const renderCard = () => accountsList.map((item) => (
    <SwiperSlide key={item.accountNo}>
      <DebitCard
        branch={item.branchName}
        cardName={item.alias || '--'}
        account={item.accountNo}
        balance={item.balance}
        dollarSign={item.currency}
        color="purple"
      />
    </SwiperSlide>
  ));

  const handleReserveDataDialog = async (data) => {
    const bankName = findBankName(data.receiveBank);
    showCustomPrompt({
      title: '預約轉帳',
      message: <DetailContent reserveData={{...data, bankName}} selectedAccount={selectedAccount} />,
      onOk: () => toConfirmPage(data),
      okContent: '取消交易',
      onClose: () => {},
    });
  };
  // 打開結果彈窗
  const handleOpenResultDialog = async (data) => {
    await showCustomPrompt({
      title: '預約轉帳結果',
      message: <ResultContent resultData={data} selectedAccount={selectedAccount} />,
    });
  };

  // 預約轉帳查詢列表
  const renderSearchList = (tabValue) => {
    const { searchObj, startDay, endDay } = currentValue;
    const key = `${selectedAccount?.accountNo}_${startDay}_${endDay}`;
    const list = searchObj[key];
    if (!selectedAccount?.accountNo || !list || !banks) return <Loading space="both" isCentered />;
    if (!list.length) return <div className="emptyConatiner"><EmptyData /></div>;

    const showImg = (stderrMsg) => {
      if (tabValue === '1') return undefined;
      return stderrMsg ? FailImage : SuccessImage;
    };
    return list.map((item) => (
      <InformationTape
        key={item.seqno}
        topLeft={`${item.receiveBank}-${item.receiveAccountNo}`}
        topRight={currencySymbolGenerator('NTD', parseFloat(item.transferAmount))}
        bottomLeft={`${tabValue === '1' ? '預約轉帳日' : '交易日期'} : ${dateToString(item.rgDay)}`}
        // eslint-disable-next-line no-nested-ternary
        bottomRight={tabValue === '1' ? item.cycle === 'D' ? '單筆' : '週期' : undefined}
        onClick={
          tabValue === '1'
            ? () => handleReserveDataDialog(item)
            : () => handleOpenResultDialog(item)
        }
        img={showImg(item.stderrMsg)} // TODO 待確認「結果查詢」的資料結構
      />
    ));
  };

  const renderTabPanels = () => panelOptions.map((panel) => (
    <FEIBTabPanel key={panel.tabValue} value={panel.tabValue}>
      <div className="searchDateRange">
        <SearchIcon />
        <div>
          <DateRangePicker // 本身也可以是 Field
            {...panel.datePickerLimit}
            control={control}
            name={panel.formName}
            label=" "
            value={watch(panel.formName)}
          />
        </div>
      </div>
      {renderSearchList(panel.tabValue)}
    </FEIBTabPanel>
  ));

  const handleChangeSlide = ({ activeIndex }) => setSelectedAccount(accountsList[activeIndex]);

  // 切換帳號/Tab/日期範圍時 會檢查 searchList 有無特定的 key，若沒有就執行搜尋
  useEffect(() => {
    if (!selectedAccount) return;
    const { searchObj, startDay, endDay } = currentValue;
    const key = `${selectedAccount.accountNo}_${startDay}_${endDay}`;
    if (!searchObj[key]) handleSubmit(onSearch)();
  }, [selectedAccount, curTab, curReserveRange, curResultRange]);

  return (
    <Layout title="預約轉帳查詢/取消" inspector={fetchTransferOutAccounts}>
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
          <FEIBTabContext value={curTab}>
            <TabField control={control} name="tab" options={tabOptions} />
            {renderTabPanels()}
          </FEIBTabContext>
        </div>
      </ReserveTransferSearchWrapper>
    </Layout>
  );
};

export default D00800;
