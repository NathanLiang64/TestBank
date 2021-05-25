import { useCheckLocation, usePageInfo } from 'hooks';

const DepositOverview = () => {
  useCheckLocation();
  usePageInfo('/api/depositOverview');

  return (
    <div>DepositOverview</div>
  );
};

export default DepositOverview;
