import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccountOverview from 'components/AccountOverview';
import { useCheckLocation, usePageInfo } from 'hooks';
import { getTransactionDetails } from 'apis/taiwanDollarAccountApi';
import mockData from './mockData';
import {
  setDebitCards, setSelectedAccount, setTransactionDetails, setTransactionMonthly,
} from './stores/actions';

const TaiwanDollarAccount = () => {
  const debitCards = useSelector(({ taiwanDollarAccount }) => taiwanDollarAccount.debitCards);
  const selectedAccount = useSelector(({ taiwanDollarAccount }) => taiwanDollarAccount.selectedAccount);
  const txnDetails = useSelector(({ taiwanDollarAccount }) => taiwanDollarAccount.txnDetails);

  const dispatch = useDispatch();

  const handleChangeAccount = (swiper) => dispatch(setSelectedAccount(debitCards[swiper.activeIndex]));

  useCheckLocation();
  usePageInfo('/api/taiwanDollarAccount');

  // 首次加載時取得用戶所有帳號
  useEffect(() => {
    /* ========== mock data (for mock api) ========== */
    // getAccounts().then((response) => dispatch(setDebitCards(response));

    /* ========== mock data (for prototype) ========== */
    const { getAccounts } = mockData;
    dispatch(setDebitCards(getAccounts));
  }, []);

  // 取得帳號資料後，預設選擇第一組帳號
  useEffect(() => {
    if (debitCards?.length) dispatch(setSelectedAccount(debitCards[0]));
  }, [debitCards]);

  // 根據當前帳戶取得交易明細資料及優惠利率數字
  useEffect(() => {
    if (selectedAccount) {
      const requestData = { account: selectedAccount.acctId };
      getTransactionDetails(requestData)
        .then(({ monthly, acctDetails }) => {
          dispatch(setTransactionMonthly(monthly));
          dispatch(setTransactionDetails(acctDetails));
        });
    }
  }, [selectedAccount]);

  return (
    <AccountOverview
      accounts={debitCards}
      selectedAccount={selectedAccount}
      onAccountChange={handleChangeAccount}
      details={txnDetails}
      detailsLink="/taiwanDollarAccountDetails"
      cardColor="purple"
      showInterestRatePanel
    />
  );
};

export default TaiwanDollarAccount;
