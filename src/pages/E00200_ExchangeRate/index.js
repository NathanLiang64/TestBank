/**
 * /* Elements
 *
 * @format
 */

import Layout from 'components/Layout/Layout';
import E00100Table from 'pages/E00100_Exchange/E00100_Table';

/* Styles */
import ExchangeRateWrapper from './exchangeRate.style';

const ExchangeRate = () => (
  <Layout title="匯率">
    <ExchangeRateWrapper>
      <E00100Table />
    </ExchangeRateWrapper>
  </Layout>
);

export default ExchangeRate;
