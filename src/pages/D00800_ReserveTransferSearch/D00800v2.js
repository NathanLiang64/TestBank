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
import { currencySymbolGenerator, dateToString } from 'utilities/Generator';
import { showCustomPrompt } from 'utilities/MessageModal';

import { getAccountsList } from 'utilities/CacheData';
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
  const {control, handleSubmit, watch } = useForm({ defaultValues });
  const [curTab, curReserveRange, curResultRange] = watch([TAB, RESERVE_DATE_RANGE, RESULT_DATE_RANGE]);
  const currentValue = {
    sdate: dateToString(curTab === '1' ? curReserveRange[0] : curResultRange[0]),
    edate: dateToString(curTab === '1' ? curReserveRange[1] : curResultRange[1]),
    searchObj: curTab === '1' ? searchList.reserve : searchList.result,
  };

  const onSearch = async ({ tab, reserveDateRange, resultDateRange }) => {
    const sdate = dateToString(tab === '1' ? reserveDateRange[0] : resultDateRange[0]);
    const edate = dateToString(tab === '1' ? reserveDateRange[1] : resultDateRange[1]);
    const { acctId, ccycd, accountType } = selectedAccount;
    const param = {
      acctId,
      ccycd,
      accountType,
      sdate,
      edate,
      queryType: 3, // ??? 目前 hardcode queryType = 3 ，意即只查詢網銀預約+臨櫃預約
    };

    const type = tab === '1' ? 'reserve' : 'result';

    // ??? 不同帳號的 reservedTransDetails 與 getResultTransDetails 回傳的資料結構不一樣.... 後續需請後端更正
    const { bookList } = tab === '1' ? await getReservedTransDetails(param) : await getResultTransDetails(param);

    setSearchList((prevSearchList) => ({
      ...prevSearchList,
      [type]: { ...prevSearchList[type], [`${acctId}_${sdate}_${edate}`]: bookList },
    }));
  };

  // 取得帳號清單
  const fetchTransferOutAccounts = async () => {
    let accountsListRes;
    await getAccountsList('MSC', async (accts) => {
      console.log('accts', accts);
      const newAccts = accts.map((acct) => ({
        acctBranch: acct.branchName, // 分行代碼
        acctName: acct.alias, // 帳戶名稱或暱稱
        acctId: acct.accountNo, // 帳號
        accountType: acct.acctType, // 帳號類別
        acctBalx: acct.balance, // 帳戶餘額
        ccycd: acct.currency, // 幣別代碼
      }));
      setAccountsList(newAccts);
      accountsListRes = newAccts;
      setSelectedAccount(newAccts[0]);
    });
    // TODO 若無 MSC 類別的帳戶，要給什麼提示訊息給使用者
    return accountsListRes.length ? null : '查無帳戶資訊';
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
      onClose: () => {},
    });
  };
  // 打開結果彈窗
  const handleOpenResultDialog = async (data) => {
    await showCustomPrompt({
      title: '預約轉帳結果',
      message: <ResultContent data={data} selectedAccount={selectedAccount} />,
    });
  };

  // 預約轉帳查詢列表
  const renderSearchList = (tabValue) => {
    const { searchObj, sdate, edate } = currentValue;
    const key = `${selectedAccount?.acctId}_${sdate}_${edate}`;
    const list = searchObj[key];

    if (!selectedAccount?.acctId || !list) return <Loading space="both" isCentered />;
    if (!list.length) return <div className="emptyConatiner"><EmptyData /></div>;

    const showImg = (stderrMsg) => {
      if (tabValue === '1') return undefined;
      return stderrMsg ? FailImage : SuccessImage;
    };
    return list.map((item) => (
      <InformationTape
        key={item.inActNo}
        topLeft={tabValue === '1' ? `${item.inBank}-${item.inActNo}` : `${item.inActNo}`}
        topRight={currencySymbolGenerator('TWD', parseFloat(item.amount))}
        bottomLeft={tabValue === '1' ? `預約轉帳日：${dateToString(item.payDate)}` : `交易日期：${item.trnsDate}`}
        bottomRight={tabValue === '1' ? item.type : undefined}
        onClick={tabValue === '1' ? () => handleReserveDataDialogOpen(item) : () => handleOpenResultDialog(item)}
        img={showImg(item.stderrMsg)}
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
    const { searchObj, sdate, edate } = currentValue;
    const key = `${selectedAccount.acctId}_${sdate}_${edate}`;
    if (!searchObj[key]) handleSubmit(onSearch)();
  }, [selectedAccount, curTab, curReserveRange, curResultRange]);

  console.log('selectedAccount', selectedAccount);
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
