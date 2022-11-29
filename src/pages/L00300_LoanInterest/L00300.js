import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { showDrawer, closeDrawer, showCustomPrompt } from 'utilities/MessageModal';
import {
  accountFormatter, toCurrency, dateToYMD, dateToString,
} from 'utilities/Generator';
import { getSubPaymentHistory } from 'pages/L00100_Loan/api';
/* Elements */
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard/DebitCard';
import InformationTape from 'components/InformationTape';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import DownloadIcon from 'assets/images/icons/downloadIcon.svg';
import { closeFunc, loadFuncParams } from 'utilities/AppScriptProxy';

/* Styles */
import EmptyData from 'components/EmptyData';
import LoanInterestWrapper from './L00300.style';

/**
 * L00300 貸款 繳款紀錄
 */
const LoanInterest = () => {
  const history = useHistory();

  const [cardData, setCardData] = useState({});
  const [dateRange, setDateRange] = useState('0');
  const [recordsList, setRecordsList] = useState([]);

  const getStartDate = (type) => {
    let months;
    switch (type) {
      case '1': months = 12; break;
      case '2': months = 24; break;
      case '3': months = 36; break;
      case '0':
      default:
        months = 6; break;
    }

    const today = new Date();
    return new Date(today.setMonth(today.getMonth() - months));
  };

  // 查詢繳款紀錄
  const getLoanInterestRecords = async (rangeType) => {
    const param = {
      account: cardData.accountNo,
      subNo: cardData.loanNo,
      startDate: dateToYMD(getStartDate(rangeType)),
      endDate: dateToYMD(),
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
    history.push('/L003001', { singleHistoryData, cardData });
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
                  bottomLeft={`${dateToString(item.date)}`}
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
