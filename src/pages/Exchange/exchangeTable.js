import { useEffect, useState } from 'react';
import { currencyZhGenerator } from 'utilities/Generator';
import styled from 'styled-components';

const mockData = [
  {
    currencyCode: 'USD',
    buy: '28.0520',
    sell: '28.1520',
  },
  {
    currencyCode: 'JPY',
    buy: '0.2709',
    sell: '0.2739',
  },
  {
    currencyCode: 'CNY',
    buy: '4.2900',
    sell: '4.3450',
  },
  {
    currencyCode: 'EUR',
    buy: '34.3800',
    sell: '34.6800',
  },
  {
    currencyCode: 'HKD',
    buy: '3.6010',
    sell: '3.6490',
  },
  {
    currencyCode: 'AUD',
    buy: '21.5000',
    sell: '21.7900',
  },
  {
    currencyCode: 'GBP',
    buy: '38.1100',
    sell: '38.4700',
  },
  {
    currencyCode: 'CAD',
    buy: '21.9700',
    sell: '22.1400',
  },
];

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

const ExchangeTable = () => {
  const [exchangeRate, setExchangeRate] = useState([]);

  const getExchangeRate = () => {
    console.log('fetch rate data');
    setExchangeRate(mockData);
  };

  useEffect(() => {
    getExchangeRate();
  }, []);

  return (
    <ExchangeTableWrapper>
      <section>
        <div className="describe">
          <h2>
            查詢時間：2020/12/31 15:09:28
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
          {
            exchangeRate.map((item) => (
              <tr>
                <td>
                  { currencyZhGenerator(item.currencyCode) }
                  { item.currencyCode }
                </td>
                <td>
                  { item.buy }
                </td>
                <td>
                  { item.buy }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </ExchangeTableWrapper>
  );
};

export default ExchangeTable;
