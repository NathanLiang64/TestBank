import { useEffect, useState } from 'react';
import { exchangeApi } from 'apis';
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

const ExchangeTable = () => {
  const [getInfoStr, setGetInfoStr] = useState('');
  const [exchangeRate, setExchangeRate] = useState([]);

  const testExchangeRate = [
    {
      ccyname: '美金',
      ccycd: 'USD',
      brate: '28.0520',
      srate: '28.1520',
    },
    {
      ccyname: '日圓',
      ccycd: 'JPY',
      brate: '0.2709',
      srate: '0.2739',
    },
    {
      ccyname: '人民幣',
      ccycd: 'CNY',
      brate: '4.9200',
      srate: '4.3450',
    },
    {
      ccyname: '歐元',
      ccycd: 'EUR',
      brate: '34.3800',
      srate: '34.6800',
    },
  ];

  const getExchangeRate = async () => {
    const now = Date.now();
    const dateStr = dateFormatter(now);
    const timeStr = timeSecondFormatter(now);
    setGetInfoStr(`${dateStr} ${timeStr}`);
    const response = await exchangeApi.getExchangeRateInfo({});
    setExchangeRate(response);
  };

  useEffect(() => {
    getExchangeRate();
  }, []);

  const renderTable = (table) => table.map((item) => (
    <tr key={item.ccycd}>
      <td>
        { item.ccyname }
        &nbsp;
        { item.ccycd }
      </td>
      <td>
        { item.brate }
      </td>
      <td>
        { item.srate }
      </td>
    </tr>
  ));

  return (
    <ExchangeTableWrapper>
      <section>
        <div className="describe">
          <h2>
            查詢時間：
            { getInfoStr }
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
          {exchangeRate.length > 0 ? renderTable(exchangeRate) : renderTable(testExchangeRate) }
        </tbody>
      </table>
    </ExchangeTableWrapper>
  );
};

export default ExchangeTable;
