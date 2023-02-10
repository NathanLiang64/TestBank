/**
 * /* Elements
 *
 * @format
 */

import Layout from 'components/Layout/Layout';
import { E00100Table } from 'pages/E00100_Exchange/E00100_Content';
import { Func } from 'utilities/FuncID';

/* Styles */
import ExchangeRateWrapper from './E00200.style';

const ExchangeRate = () => (
  <Layout fid={Func.E002} title="匯率">
    <ExchangeRateWrapper>
      <E00100Table />
    </ExchangeRateWrapper>
  </Layout>
);

export default ExchangeRate;
