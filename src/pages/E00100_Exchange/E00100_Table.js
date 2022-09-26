/** @format */

import { useEffect, useState } from 'react';
import { getExchangeRateInfo } from 'pages/E00100_Exchange/api';
import { dateFormatter, timeSecondFormatter } from 'utilities/Generator';
import styled from 'styled-components';

const ExchangeTableWrapper = styled.div`
  .describe {
    h2 {
      font-size: 1.4rem;
      line-height: 2.1rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
  table {
    thead {
      tr {
        td {
          text-align: right;
          font-size: 1.2rem;
          line-height: 1.8rem;
          color: ${({ theme }) => theme.colors.primary.light};
          &:first-child {
            text-align: left;
          }
        }
      }
    }
    tbody {
      tr {
        td {
          text-align: right;
          font-size: 1.4rem;
          line-height: 2.1rem;
          color: ${({ theme }) => theme.colors.text.lightGray};
          &:first-child {
            text-align: left;
          }
        }
      }
    }
  }
`;

const E00100Table = () => {
  const [getInfoStr, setGetInfoStr] = useState('');
  const [exchangeRate, setExchangeRate] = useState([]);

  const getExchangeRate = async () => {
    const now = Date.now();
    const dateStr = dateFormatter(now);
    const timeStr = timeSecondFormatter(now);
    setGetInfoStr(`${dateStr} ${timeStr}`);
    const { code, data } = await getExchangeRateInfo({});
    if (code === '0000') {
      setExchangeRate(data);
    }
  };

  useEffect(() => {
    getExchangeRate();
  }, []);

  return (
    <ExchangeTableWrapper>
      <section>
        <div className="describe">
          <h2>
            查詢時間：
            {getInfoStr}
            <br />
            本匯率僅供參考，實際匯率以本行交易時之匯率為準。
          </h2>
        </div>
      </section>
      <table style={{ margin: '1rem 0' }}>
        <thead>
          <tr>
            <td>幣別</td>
            <td>即期買入</td>
            <td>即期賣出</td>
          </tr>
        </thead>
        <tbody>
          {exchangeRate.map((item) => (
            <tr key={item.ccycd}>
              <td>
                {item.ccyname}
                &nbsp;
                {item.ccycd}
              </td>
              <td>{item.brate}</td>
              <td>{item.srate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ExchangeTableWrapper>
  );
};

export default E00100Table;
