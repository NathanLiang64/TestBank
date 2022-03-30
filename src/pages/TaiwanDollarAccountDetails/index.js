import { useSelector } from 'react-redux';
import AccountDetails from 'components/AccountDetails';
import { getTransactionDetails } from 'pages/TaiwanDollarAccount/api';
import { useCheckLocation, usePageInfo } from 'hooks';

const TaiwanDollarAccountDetails = () => {
  const selectedAccount = useSelector(({ taiwanDollarAccount }) => taiwanDollarAccount.selectedAccount);
  const txnDetails = useSelector(({ taiwanDollarAccount }) => taiwanDollarAccount.txnDetails);
  const txnMonthly = useSelector(({ taiwanDollarAccount }) => taiwanDollarAccount.txnMonthly);

  const getDetailsByConditions = (conditions) => (
    getTransactionDetails(conditions).then((response) => response)
  );

  useCheckLocation();
  usePageInfo('/api/taiwanDollarAccountDetails');

  return (
    <AccountDetails
      selectedAccount={selectedAccount}
      txnDetails={txnDetails}
      monthly={txnMonthly}
      onTabClick={getDetailsByConditions}
      onScroll={getDetailsByConditions}
      onSearch={getDetailsByConditions}
      cardColor="purple"
    />
  );
};

export default TaiwanDollarAccountDetails;
