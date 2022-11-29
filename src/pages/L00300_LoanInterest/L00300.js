import { useState, useEffect } from 'react';
import { showDrawer, closeDrawer, showCustomPrompt } from 'utilities/MessageModal';
import {
  accountFormatter, toCurrency, stringDateCodeFormatter, dateFormatter,
} from 'utilities/Generator';
import { getSubPaymentHistory } from 'pages/L00100_Loan/api';
/* Elements */
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard/DebitCard';
import InformationTape from 'components/InformationTape';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import DownloadIcon from 'assets/images/icons/downloadIcon.svg';
import { closeFunc, loadFuncParams, startFunc } from 'utilities/AppScriptProxy';

/* Styles */
import EmptyData from 'components/EmptyData';
import { FuncID } from 'utilities/FuncID';
import LoanInterestWrapper from './L00300.style';

/**
 * L00300 貸款 繳款紀錄
 */
const LoanInterest = () => {
  const [cardData, setCardData] = useState({});
  const [dateRange, setDateRange] = useState('0');
  const [recordsList, setRecordsList] = useState([]);

  const beforeSixMonth = stringDateCodeFormatter(new Date(new Date().setDate(new Date().getDate() - 180)));
  const beforeOneYear = stringDateCodeFormatter(new Date(new Date().setDate(new Date().getDate() - 365)));
  const beforeTwoYears = stringDateCodeFormatter(new Date(new Date().setDate(new Date().getDate() - (365 * 2))));
  const beforeThreeYears = stringDateCodeFormatter(new Date(new Date().setDate(new Date().getDate() - (365 * 3))));
  const endDate = stringDateCodeFormatter(new Date());

  const getStartDate = (type) => {
    switch (type) {
      case '0':
        return beforeSixMonth;

      case '1':
        return beforeOneYear;

      case '2':
        return beforeTwoYears;

      case '3':
        return beforeThreeYears;

      default:
        return beforeSixMonth;
    }
  };

  // 查詢繳款紀錄
  const getLoanInterestRecords = async (rangeType) => {
    const param = {
      account: cardData.accountNo,
      subNo: cardData.loanNo,
      startDate: getStartDate(rangeType),
      endDate,
    };

    const histroyResponse = await getSubPaymentHistory(param);
    if (histroyResponse) {
      setRecordsList(histroyResponse);
    }
  };

  const handleChangeTabs = (e, value) => {
    setDateRange(value);
    getLoanInterestRecords(value);
  };

  const toDetailPage = (singleHistoryData) => {
    startFunc(FuncID.L00300 + 1, { singleHistoryData, cardData });
  };

  const renderEditList = () => (
    <ul className="noticeEditList downloadItemList">
      <li onClick={() => closeDrawer()}>
        <span>
          下載 PDF
        </span>
        <img className="downloadImg" src={DownloadIcon} alt="" />
      </li>
      <li onClick={() => closeDrawer()}>
        <span>
          下載 EXCEL
        </span>
        <img className="downloadImg" src={DownloadIcon} alt="" />
      </li>
    </ul>
  );

  // 開關編輯選單
  const handleOpenDrawer = () => {
    showDrawer(
      '',
      renderEditList(),
    );
  };

  useEffect(async () => {
    const startParams = await loadFuncParams();

    if (startParams?.card) {
      setCardData(startParams.card);
    } else {
      await showCustomPrompt({message: '參數錯誤', onOk: closeFunc, onClose: closeFunc});
    }
  }, []);

  // 進到該頁面時先 Query 近六個月的繳款紀錄
  useEffect(() => {
    if (cardData?.accountNo) {
      getLoanInterestRecords(dateRange);
    }
  }, [cardData]);

  return (
    <Layout title="繳款紀錄查詢">
      <LoanInterestWrapper>
        <div className="cardArea">
          <DebitCard
            branch=""
            cardName={cardData?.alias || ''}
            account={`${accountFormatter(cardData?.accountNo || '')} ${
              cardData.loanNo
            }`}
            balance={toCurrency(cardData?.balance || '')}
            dollarSign={cardData?.currency || ''}
            transferTitle=""
            color="lightPurple"
          />
        </div>
        <div className="contentArea">
          <div className="tools">
            <div className="iconContainer">
              <img
                className="downloadImg"
                src={DownloadIcon}
                alt=""
                onClick={handleOpenDrawer}
              />
            </div>
            <div className="tabsContainer">
              <FEIBTabContext value={dateRange}>
                <FEIBTabList $size="small" onChange={handleChangeTabs}>
                  <FEIBTab label="近六個月" value="0" />
                  <FEIBTab label="近一年" value="1" />
                  <FEIBTab label="近兩年" value="2" />
                  <FEIBTab label="近三年" value="3" />
                </FEIBTabList>
              </FEIBTabContext>
            </div>
          </div>
          {recordsList.length ? (
            <div className="recordsList">
              {recordsList.map((item) => (
                <InformationTape
                  topLeft="還款金額"
                  topRight={`$${toCurrency(item.amount)}`}
                  bottomLeft={`${dateFormatter(item.date)}`}
                  bottomRight={`貸款餘額 $${toCurrency(item.balance)}`}
                  onClick={() => toDetailPage(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyData content="查無最近三年內的帳務往來資料" />
          )}
        </div>
      </LoanInterestWrapper>
    </Layout>
  );
};

export default LoanInterest;
