const ExchangeTable = () => (
  <>
    <section>
      <div>
        <h2>查詢時間：2022/6/17 18:52:00</h2>
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
        <tr>
          <td>美金USD</td>
          <td>28.0520</td>
          <td>28.1520</td>
        </tr>
        <tr>
          <td>日圓JPY</td>
          <td>0.2709</td>
          <td>0.2739</td>
        </tr>
      </tbody>
    </table>
    <section>
      <div>
        <h2>本匯率僅供參考，實際匯率以與本行交易時之匯率為準</h2>
      </div>
    </section>
  </>
);

export default ExchangeTable;
