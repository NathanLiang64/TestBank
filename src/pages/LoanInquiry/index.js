import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
} from 'components/elements';
import NoticeArea from 'components/NoticeArea';

/* Styles */
import theme from 'themes/theme';
import LoanInquiryWrapper from './loanInquiry.style';

const LoanInquiry = () => {
  const [account, setAccount] = useState('');
  const [showTable, setShowTable] = useState(false);

  const handleAccountChange = (event) => {
    setAccount(event.target.value);
  };

  const handleSearchClick = () => {
    setShowTable(true);
  };

  const ResultTable = () => (
    <table className="resultTable">
      <tbody>
        <tr>
          <td>貸款種類</td>
          <td>房貸</td>
        </tr>
        <tr>
          <td>貸款分號</td>
          <td>0000000001</td>
        </tr>
        <tr>
          <td>計息本金</td>
          <td>$1,272,963</td>
        </tr>
        <tr>
          <td>計息期間</td>
          <td>110/03/18 ~ 110/04/18</td>
        </tr>
        <tr>
          <td>利率％</td>
          <td>1.05000</td>
        </tr>
        <tr>
          <td>攤還本金</td>
          <td>$14,089</td>
        </tr>
        <tr>
          <td>利息</td>
          <td>$1,114</td>
        </tr>
        <tr>
          <td>逾期息</td>
          <td>$0</td>
        </tr>
        <tr>
          <td>違約金</td>
          <td>$0</td>
        </tr>
        <tr>
          <td>應繳金額合計</td>
          <td>$15,203</td>
        </tr>
        <tr>
          <td>應繳款日</td>
          <td>110/04/18</td>
        </tr>
        <tr>
          <td>應繳本息</td>
          <td>$15,203</td>
        </tr>
      </tbody>
    </table>
  );

  useCheckLocation();
  usePageInfo('api/loanInquiry');

  return (
    <LoanInquiryWrapper>
      <FEIBInputLabel>貸款帳號</FEIBInputLabel>
      <FEIBSelect
        value={account}
        $borderColor={theme.colors.primary.brand}
        onChange={handleAccountChange}
      >
        <FEIBOption value="0000113253642323">0000113253642323</FEIBOption>
        <FEIBOption value="0000113253642324">0000113253642324</FEIBOption>
        <FEIBOption value="0000113253642325">0000113253642325</FEIBOption>
      </FEIBSelect>
      <FEIBButton
        disabled={!account}
        onClick={handleSearchClick}
      >
        查詢
      </FEIBButton>
      { showTable ? <ResultTable /> : '' }
      <NoticeArea textAlign="justify">
        <ol>
          <li>
            <p>查詢日期若已逾繳款日，【違約金+逾期息】欄位為估算逾期一個月之金額供參考，實際扣款金額仍依本行電腦系統為準。</p>
          </li>
          <li>
            <p>如欲查詢已逾期戶之貸款資料，請與本行客戶服務中心聯繫(02-80731166)。」</p>
          </li>
        </ol>
      </NoticeArea>
    </LoanInquiryWrapper>
  );
};

export default LoanInquiry;
