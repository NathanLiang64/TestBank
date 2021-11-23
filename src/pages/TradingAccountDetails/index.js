import { useSelector } from 'react-redux';
import AccountDetails from 'components/AccountDetails';
import { getTransactionDetails } from 'apis/tradingAccountApi';
import { useCheckLocation, usePageInfo } from 'hooks';

const TradingAccountDetails = () => {
  const selectedAccount = useSelector(({ tradingAccount }) => tradingAccount.selectedAccount);
  const txnDetails = useSelector(({ tradingAccount }) => tradingAccount.txnDetails);
  const txnMonthly = useSelector(({ tradingAccount }) => tradingAccount.txnMonthly);

  const getDetailsByConditions = (conditions) => (
    getTransactionDetails(conditions).then((response) => response)
  );

  useCheckLocation();
  usePageInfo('/api/tradingAccountDetails');

  return (
    <AccountDetails
      selectedAccount={selectedAccount}
      txnDetails={txnDetails}
      monthly={txnMonthly}
      onTabClick={getDetailsByConditions}
      onScroll={getDetailsByConditions}
      onSearch={getDetailsByConditions}
      cardColor="yellow"
    />
  );
};

export default TradingAccountDetails;
