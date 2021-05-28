/* Styles */
import { useSelector } from 'react-redux';
import Alert from 'components/Alert';
import BillPayWrapper from './billPay.style';

const BillPay2 = () => {
  const billPayData = useSelector(((state) => state.billPay));

  const renderAlert = () => (
    billPayData.sendType
      ? <Alert state="success">交易成功</Alert>
      : <Alert state="error">交易失敗</Alert>
  );

  const renderResultText = () => (
    <p>交易失敗相關文案(應由API回傳)</p>
  );

  const renderTable1Area = () => (
    <table>
      <tbody>
        <tr>
          <td>轉出帳號</td>
          <td>00300466006458</td>
        </tr>
        <tr>
          <td>繳款卡號</td>
          <td>本人卡款</td>
        </tr>
        <tr>
          <td>繳費金額</td>
          <td>NTD 500</td>
        </tr>
        <tr>
          <td>轉出帳號餘額</td>
          <td>NTD 8,500</td>
        </tr>
      </tbody>
    </table>
  );

  const renderTable2Area = () => (
    <table>
      <tbody>
        <tr>
          <td>交易種類</td>
          <td>以活期存款帳戶繳交信用卡</td>
        </tr>
        <tr>
          <td>交易序號</td>
          <td>0000004</td>
        </tr>
        <tr>
          <td>身分證字號</td>
          <td>Z2XXXXX006</td>
        </tr>
        <tr>
          <td>信用卡號</td>
          <td>3564-XXXX-XXXX-4650</td>
        </tr>
        <tr>
          <td>轉出銀行代號</td>
          <td>805-遠端銀行</td>
        </tr>
        <tr>
          <td>轉出銀行帳號</td>
          <td>00200300021548</td>
        </tr>
        <tr>
          <td>繳費金額</td>
          <td>NTD 4,865</td>
        </tr>
      </tbody>
    </table>
  );

  // const collapse = () => (
  //   <div className="tip">注意事項</div>
  // );

  const pageControll = () => {
    switch (billPayData.payType) {
      case 2:
        return (
          <>
            {renderAlert()}
            {billPayData.sendType && renderTable2Area()}
            {!billPayData.sendType && renderResultText()}
            {/* {collapse()} */}
          </>
        );
      default:
        return (
          <>
            {renderAlert()}
            {billPayData.sendType && renderTable1Area()}
            {!billPayData.sendType && renderResultText()}
          </>
        );
    }
  };

  const renderPage = () => (
    <BillPayWrapper inDialog>
      {pageControll()}
    </BillPayWrapper>

  );

  return renderPage();
};

export default BillPay2;
