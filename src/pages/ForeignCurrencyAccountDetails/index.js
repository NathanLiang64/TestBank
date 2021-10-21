import { useSelector } from 'react-redux';
import AccountDetails from 'components/AccountDetails';
import { getTransactionDetails } from 'apis/foreignCurrencyAccountApi';
import { useCheckLocation, usePageInfo } from 'hooks';

const ForeignCurrencyAccountDetails = () => {
  const selectedAccount = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.selectedAccount);
  const txnDetails = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.txnDetails);
  const txnMonthly = useSelector(({ foreignCurrencyAccount }) => foreignCurrencyAccount.txnMonthly);

  const getDetailsByConditions = (conditions) => (
    getTransactionDetails(conditions).then((response) => response)
  );

  useCheckLocation();
  usePageInfo('/api/foreignCurrencyAccountDetails');

  return (
    <AccountDetails
      selectedAccount={selectedAccount}
      txnDetails={txnDetails}
      monthly={txnMonthly}
      onTabClick={getDetailsByConditions}
      onScroll={getDetailsByConditions}
      onSearch={getDetailsByConditions}
      cardColor="blue"
    />
  );
};

export default ForeignCurrencyAccountDetails;
