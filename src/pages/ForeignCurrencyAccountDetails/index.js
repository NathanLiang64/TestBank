import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VisibilitySensor from 'react-visibility-sensor';
import axios from 'axios';
import { GetAppRounded, SearchRounded } from '@material-ui/icons';
import { useCheckLocation, usePageInfo } from 'hooks';
import BottomDrawer from 'components/BottomDrawer';
import EmptyData from 'components/EmptyData';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import {
  FEIBIconButton, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import ForeignCurrencyAccountDetailsWrapper from './foreignCurrencyAccountDetails.style';
import { setTransactionDetails } from '../ForeignCurrencyAccount/stores/actions';

const ForeignCurrencyAccountDetails = () => {
  const txnDetailsRef = useRef();
  const [tabId, setTabId] = useState('');
  const [tabList, setTabList] = useState([]);
  const [openDownloadDrawer, setOpenDownloadDrawer] = useState(false);
  const account = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.selectedAccount);
  const txnDetails = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.txnDetails);
  const dispatch = useDispatch();

  // 點擊下載交易明細
  const handleClickDownloadDetails = (format) => {
    setOpenDownloadDrawer(false);
    if (format === 'pdf') {
      // window.location.href = 'url';  // 交易明細下載 (Pdf 格式)
    } else if (format === 'excel') {
      // window.location.href = 'url';  // 交易明細下載 (Excel 格式)
    }
  };

  // onChange={visibilitySensorOnChange}
  const renderDetailCards = (list) => (
    list.map((card) => (
      <VisibilitySensor key={card.index} containment={txnDetailsRef.current}>
        {({ isVisible }) => (
          <DetailCard
            id={card.txnDate?.substr(0, 6)}
            index={card.index}
            inView={isVisible ? 'y' : 'n'}
            avatar={card.avatar}
            title={card.description}
            type={card.cdType}
            date={card.txnDate}
            time={card.txnTime}
            bizDate={card.bizDate}
            targetBank={card.targetBank}
            targetAccount={card.targetAcct}
            targetMember={card.targetMbrID}
            dollarSign={card.currency}
            amount={card.amount}
            balance={card.balance}
            noShadow
          />
        )}
      </VisibilitySensor>
    ))
  );

  useEffect(async () => {
    const data = await axios.get('https://appbankee-t.feib.com.tw/ords/db1/acc/getAccTx?actno=04300499312641')
      .then((response) => response.data)
      .catch((error) => error.response);

    const { monthly, acctDetails } = data;
    setTabId(acctDetails.length ? acctDetails[0].txnDate.substr(0, 6) : '');
    setTabList(monthly.length ? monthly.reverse() : []);
    dispatch(setTransactionDetails(acctDetails));
  }, []);

  useCheckLocation();
  usePageInfo('/api/foreignCurrencyAccountDetails');

  return (
    <ForeignCurrencyAccountDetailsWrapper small>
      <DebitCard cardName={account.acctName} account={account.acctId} balance={account.acctBalx} color="blue" />
      <div className="inquiryArea measuredHeight">

        <div className="searchBar">
          <FEIBIconButton $fontSize={2.8}>
            <SearchRounded />
          </FEIBIconButton>
          {/* { (dateRange.length > 0) && renderSearchBarText(dateRange) } */}
          <FEIBIconButton $fontSize={2.8} className="customPosition" onClick={() => setOpenDownloadDrawer(true)}>
            <GetAppRounded />
          </FEIBIconButton>
        </div>

        <div className="tabsArea">
          <FEIBTabContext value={tabId}>
            <FEIBTabList onChange={(event, id) => setTabId(id)} $size="small" className="tabList">
              { tabList.map((month) => (
                <FEIBTab
                  key={month}
                  label={`${month.substr(4, 2)}月`}
                  value={month}
                  data-month={month}
                />
              )) }
            </FEIBTabList>
          </FEIBTabContext>
        </div>

        <div className="transactionDetail" ref={txnDetailsRef}>
          { txnDetails?.length > 0 ? renderDetailCards(txnDetails) : <EmptyData /> }
        </div>

      </div>

      <BottomDrawer
        className="debitInquiryDownloadDrawer"
        isOpen={openDownloadDrawer}
        onClose={() => setOpenDownloadDrawer(false)}
        content={(
          <ul>
            <li onClick={() => handleClickDownloadDetails('pdf')}><p>下載 PDF</p></li>
            <li onClick={() => handleClickDownloadDetails('excel')}><p>下載 EXCEL</p></li>
          </ul>
        )}
      />
    </ForeignCurrencyAccountDetailsWrapper>
  );
};

export default ForeignCurrencyAccountDetails;
