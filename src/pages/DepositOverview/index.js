import { useCheckLocation, usePageInfo } from 'hooks';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import Avatar from 'assets/images/logo.jpg';
import DepositOverviewWrapper from './depositOverview.style';

const DepositOverview = () => {
  useCheckLocation();
  usePageInfo('/api/depositOverview');

  return (
    <DepositOverviewWrapper>
      <DebitCard
        type="original"
        branch="信義分行"
        cardName="保時捷車友會"
        account="043-004-99001234"
        balance={2000000}
      />

      <div className="infoPanel">
        <div className="panelItem">
          <h3>免費跨提/轉</h3>
          <p>3/5</p>
        </div>
        <div className="panelItem">
          <h3>優惠利率</h3>
          <p>2.6%</p>
        </div>
        <div className="panelItem">
          <h3>優惠利率額度</h3>
          <p>5萬</p>
        </div>
      </div>

      <div className="transactionDetail">
        <DetailCard
          avatar={Avatar}
          type="income"
          title="12月的伙食費"
          date="12/05"
          sender="Amanda Wilkins"
          amount={1200}
          balance={212489283}
        />
      </div>

    </DepositOverviewWrapper>
  );
};

export default DepositOverview;
