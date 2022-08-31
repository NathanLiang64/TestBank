/* Elements */
import Layout from 'components/Layout/Layout';
import ExchangeTable from 'pages/E00100_Exchange/exchangeTable';

/* Styles */
import ExchangeRateWrapper from './exchangeRate.style';

const ExchangeRate = () => (
  <Layout title="匯率">
    <ExchangeRateWrapper>
      <ExchangeTable />
    </ExchangeRateWrapper>
  </Layout>
);

export default ExchangeRate;
