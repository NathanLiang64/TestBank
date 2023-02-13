import { datetimeToString } from 'utilities/Generator';
import { ExchangeTableWrapper } from './E00200.style';

export const E00200Notice = () => (
  <ol style={{ textAlign: 'justify' }}>
    <li>
      本行臨櫃僅提供美金、日幣、人民幣、歐元及港幣之現鈔買賣，惟實際可兌換/提領之幣別、現鈔面額、限制及費用
      (存、提現鈔處理費)，依兌換/提領當時本行營業單位及相 關規定為準。
    </li>
    <li>
      服務說明：本服務提供您執行臺/外幣帳戶間之轉帳，轉出/入帳號皆須於本行事先約定，始可使用本服務。
    </li>
    <li>
      臺幣轉外幣/外幣轉臺幣之交易限額：
      單筆交易不可超過等值新臺幣50萬(不含)元整；每日累計限額每人累計不可超
      過等值新臺幣50萬(不含)元整。
    </li>
    <li>
      臺幣轉外幣/外幣轉臺幣之最低交易限額：每筆最低金額須達等值新臺幣300元。
    </li>
    <li>
      臺幣及日圓及輸入金額以元為單位，其他幣別小數點請以『.』字號輸入（如一百點六八元，請輸入100.68）。
    </li>
    <li>臺/外幣結匯之匯率，以交易當時本行帳務主機之掛牌匯率為準。</li>
    <li>
      結匯性質分類，請依您實際結匯用途選取，請您務必審慎並據實申報。若您的結匯用途不在預設的結匯性質分類中，
      請您至本行各分行臨櫃辦理。
    </li>
  </ol>
);

export const E00200Table = ({ exchangeRate }) => {
  const renderExchangeRate = () => (
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
  );

  return (
    <ExchangeTableWrapper>
      <section>
        <div className="describe">
          <h2>
            查詢時間：
            {datetimeToString(new Date())}
            <br />
            本匯率僅供參考，實際匯率以本行交易時之匯率為準。
          </h2>
        </div>
        {renderExchangeRate()}
      </section>
    </ExchangeTableWrapper>
  );
};
