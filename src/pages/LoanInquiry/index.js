import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
} from 'components/elements';
import Accordion from 'components/Accordion';

/* Styles */
// import theme from 'themes/theme';
import LoanInquiryWrapper from './loanInquiry.style';

const LoanInquiry = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: yup
      .string()
      .required('請選擇貸款帳號'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const [account, setAccount] = useState('');
  const [showTable, setShowTable] = useState(false);

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <FEIBInputLabel>貸款帳號</FEIBInputLabel>
        <Controller
          name="account"
          defaultValue=""
          control={control}
          placeholder="請選擇貸款帳號"
          render={({ field }) => (
            <FEIBSelect
              {...field}
              id="account"
              name="account"
              placeholder="請選擇貸款帳號"
              error={!!errors.account}
            >
              <FEIBOption value="0000113253642323">0000113253642323</FEIBOption>
              <FEIBOption value="0000113253642324">0000113253642324</FEIBOption>
              <FEIBOption value="0000113253642325">0000113253642325</FEIBOption>
            </FEIBSelect>
          )}
        />
        <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
        <Accordion space="bottom">
          <ol>
            <li>
              <p>查詢日期若已逾繳款日，【違約金+逾期息】欄位為估算逾期一個月之金額供參考，實際扣款金額仍依本行電腦系統為準。</p>
            </li>
            <li>
              <p>如欲查詢已逾期戶之貸款資料，請與本行客戶服務中心聯繫(02-80731166)。」</p>
            </li>
          </ol>
        </Accordion>
        <FEIBButton
          type="submit"
        >
          查詢
        </FEIBButton>
      </form>
      { showTable && <ResultTable /> }
    </LoanInquiryWrapper>
  );
};

export default LoanInquiry;
