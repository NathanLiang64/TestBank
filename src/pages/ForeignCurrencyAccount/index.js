import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AccountOverview from 'components/AccountOverview';
import { useCheckLocation, usePageInfo } from 'hooks';
import { getTransactionDetails } from 'apis/foreignCurrencyAccountApi';
import mockData from './mockData';
import {
  setDebitCards, setSelectedAccount, setTransactionDetails, setTransactionMonthly,
} from './stores/actions';

const ForeignCurrencyAccount = () => {
  const debitCards = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.debitCards);
  const selectedAccount = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.selectedAccount);
  const txnDetails = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.txnDetails);

  const dispatch = useDispatch();

  const handleChangeAccount = (swiper) => dispatch(setSelectedAccount(debitCards[swiper.activeIndex]));

  useCheckLocation();
  usePageInfo('/api/foreignCurrencyAccount');

  useEffect(() => {
    /* ========== mock data (for mock api) ========== */
    // getForeignCurrencyAccounts()
    //   .then((data) => dispatch(setDebitCards(data))
    //   .catch((error) => console.error(error));

    /* ========== mock data (for prototype) ========== */
    const { getForeignCurrencyAccounts } = mockData;
    dispatch(setDebitCards(getForeignCurrencyAccounts));
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
      detailsLink="/foreignCurrencyAccountDetails"
      cardColor="blue"
    />
  );
};

export default ForeignCurrencyAccount;
