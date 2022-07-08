/* Elements */
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard';

/* Styles */
import LoanInterestWrapper from './loanInterest.style';

const LoanInterest = () => {
  const data = {
    date: '2021/12/31 ~ 2022/01/31',
    type: '還本付息',
    principalAndInterest: '$10,000',
    interest: '$1,250',
    overdue: '$0',
    liquidatedDamages: '$0',
    interestRate: '1.050%',
    amountDue: '$12,500',
    principal: '$1,272,963',
  };

  return (
    <Layout title="繳款紀錄查詢">
      <LoanInterestWrapper>
        <div className="cardArea">
          <DebitCard
            branch="branch"
            cardName="信貸"
            account="04300499001234"
            balance="20000000"
            dollarSign="NTD"
            transferTitle="跨轉優惠"
            color="lightPurple"
          />
        </div>
        <div className="contentArea">
          <ul className="detailUl">
            <li>
              <span>交易日</span>
              <span>{ data.date }</span>
            </li>
            <li>
              <span>交易種類</span>
              <span>{ data.type }</span>
            </li>
            <li>
              <span>攤還本息</span>
              <span>{ data.principalAndInterest }</span>
            </li>
            <li>
              <span>利息</span>
              <span>{ data.interest }</span>
            </li>
            <li>
              <span>逾期息</span>
              <span>{ data.overdue }</span>
            </li>
            <li>
              <span>違約金</span>
              <span>{ data.liquidatedDamages }</span>
            </li>
            <li>
              <span>利率</span>
              <span>{ data.interestRate }</span>
            </li>
            <li>
              <span>應繳金額</span>
              <span>{ data.amountDue }</span>
            </li>
            <li>
              <span>本金金額</span>
              <span>{ data.principal }</span>
            </li>
          </ul>
        </div>
      </LoanInterestWrapper>
    </Layout>
  );
};

export default LoanInterest;
