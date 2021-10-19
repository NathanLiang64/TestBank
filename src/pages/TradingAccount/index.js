import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccountOverview from 'components/AccountOverview';
import { useCheckLocation, usePageInfo } from 'hooks';
import { getTransactionDetails } from 'apis/tradingAccountApi';
import mockData from './mockData';
import {
  setDebitCards, setSelectedAccount, setTransactionDetails, setTransactionMonthly,
} from './stores/actions';

const TradingAccount = () => {
  const debitCards = useSelector(({ tradingAccount }) => tradingAccount.debitCards);
  const selectedAccount = useSelector(({ tradingAccount }) => tradingAccount.selectedAccount);
  const txnDetails = useSelector(({ tradingAccount }) => tradingAccount.txnDetails);

  const dispatch = useDispatch();

  const handleChangeAccount = (swiper) => dispatch(setSelectedAccount(debitCards[swiper.activeIndex]));

  useCheckLocation();
  usePageInfo('/api/tradingAccount');

  useEffect(() => {
    /* ========== mock data (for mock api) ========== */
    // getForeignCurrencyAccounts()
    //   .then((data) => dispatch(setDebitCards(data))
    //   .catch((error) => console.error(error));

    /* ========== mock data (for prototype) ========== */
    const { getTradingAccounts } = mockData;
    dispatch(setDebitCards(getTradingAccounts));
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
      detailsLink="/tradingAccountDetails"
      cardColor="yellow"
    />
  );
};

export default TradingAccount;
