/* eslint-disable react/destructuring-assignment */
import { useHistory } from 'react-router';
import {
  accountFormatter, toCurrency, dateFormatter,
} from 'utilities/Generator';

/* Elements */
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard/DebitCard';

/* Styles */
import LoanInterestWrapper from './loanInterest.style';

const LoanInterest1 = (props) => {
  const history = useHistory();
  const cardData = props?.location?.state?.cardData;
  const singleHistoryData = props?.location?.state?.singleHistoryData;

  return (
    <Layout title="繳款紀錄查詢" goBackFunc={() => history.goBack()}>
      <LoanInterestWrapper>
        <div className="cardArea">
          <DebitCard
            branch=""
            cardName={cardData?.alias || ''}
            account={`${accountFormatter(cardData?.accountNo || '')} ${cardData.loanNo}`}
            balance={toCurrency(cardData?.balance || '')}
            dollarSign={cardData?.currency || ''}
            transferTitle=""
            color="lightPurple"
          />
        </div>
        <div className="contentArea">
          <ul className="detailUl">
            <li>
              <span>交易日</span>
              <span>{ dateFormatter(singleHistoryData?.date) }</span>
            </li>
            <li>
              <span>交易種類</span>
              <span>{ singleHistoryData?.type }</span>
            </li>
            <li>
              <span>攤還本金</span>
              <span>
                $
                { toCurrency(singleHistoryData?.splitPrincipal) }
              </span>
            </li>
            <li>
              <span>利息</span>
              <span>
                $
                { toCurrency(singleHistoryData?.interest) }
              </span>
            </li>
            <li>
              <span>逾期息</span>
              <span>
                $
                { toCurrency(singleHistoryData?.overInterest) }
              </span>
            </li>
            <li>
              <span>違約金</span>
              <span>
                $
                { toCurrency(singleHistoryData?.defaultAmount) }
              </span>
            </li>
            <li>
              <span>利率</span>
              <span>
                { singleHistoryData?.rate }
                %
              </span>
            </li>
            <li>
              <span>應繳金額</span>
              <span>
                $
                { toCurrency(singleHistoryData?.amount) }
              </span>
            </li>
            <li>
              <span>本金餘額</span>
              <span>
                $
                { toCurrency(singleHistoryData?.balance) }
              </span>
            </li>
          </ul>
        </div>
      </LoanInterestWrapper>
    </Layout>
  );
};

export default LoanInterest1;
