/* Elements */
import Header from 'components/Header';
import ExchangeTable from 'pages/E00100_Exchange/exchangeTable';

/* Styles */
import ExchangeRateWrapper from './exchangeRate.style';

const ExchangeRate = () => (
  <>
    <Header title="匯率" />
    <ExchangeRateWrapper>
      <ExchangeTable />
    </ExchangeRateWrapper>
  </>
);

export default ExchangeRate;
