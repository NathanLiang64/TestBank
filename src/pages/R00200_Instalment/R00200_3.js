/** @format */

import { useHistory, useLocation } from 'react-router';

/* Elements */
import successImg from 'assets/images/successImg.svg';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';

/* Styles */
import theme from 'themes/theme';
import { showInfo } from 'utilities/MessageModal';
import InstalmentWrapper from './R00200.style';
/**
 * R002003 晚點付 (單筆/總額_分期設定確認)
 */
const R00200_3 = () => {
  const location = useLocation();

  const installmentTotal = `${location.state.installmentSum}`;
  const installmentNumber = `${location.state.installmentNumber}期`;
  // Debug: 以下為 hardcode
  const installmentRate = `${location.state.installmentPercentage}%`;

  // Debug: 以下為 hardcode
  const staging = [
    {
      installments: '1',
      principalPayable: 3334,
      principalPayableText: '(首期金額)',
      interest: 0,
      amountDue: 3334,
    },
    {
      installments: '2~3',
      principalPayable: 3334,
      principalPayableText: '(每期金額)',
      interest: 0,
      amountDue: 3334,
    },
  ];

  const history = useHistory();

  const ResultTable = () => (
    <>
      <InformationList title="分期總額" content={installmentTotal} />
      <InformationList title="申請分期期數" content={installmentNumber} />
      <InformationList title="分期利率" content={installmentRate} />
    </>
  );

  const stagingTable = () => (
    <table style={{ alignSelf: 'center', margin: '1rem' }}>
      <thead>
        <tr>
          <td style={{ color: theme.colors.primary.light }}>分期期數</td>
          <td style={{ color: theme.colors.primary.light }}>當期應繳本金</td>
          <td style={{ color: theme.colors.primary.light }}>分期利息</td>
          <td style={{ color: theme.colors.primary.light }}>當期應繳金額</td>
        </tr>
      </thead>
      <tbody>
        {staging.map((item) => (
          <tr key={staging.indexOf(item)}>
            <td>
              第 &nbsp;
              {item.installments}
              &nbsp; 期
            </td>
            <td>
              <p>{item.principalPayable}</p>
              <p>{item.principalPayableText}</p>
            </td>
            <td>{item.interest}</td>
            <td>{item.amountDue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const successMessage = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="100" height="100">
        <image xlinkHref={successImg} width="100" height="100" />
      </svg>
      <p style={{ fontSize: '2rem', color: theme.colors.secondary.brand, textAlign: 'center' }}>設定成功</p>
      <div>
        <p style={{ textAlign: 'center' }}>您已完成 Bankee 信用卡</p>
        <p style={{ textAlign: 'center' }}>晚點付申請</p>
      </div>
    </div>
  );

  return (
    <Layout title="晚點付 (總額)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form>
          <div>
            <div className="InstalmentWrapperText">各期繳款金額試算 (依實際帳單為準)</div>
            {ResultTable()}
            {stagingTable()}
            <div style={{ padding: 8 }}>
              <p style={{ color: theme.colors.state.error }}>分期利息=本金餘額*(分期利率/12)</p>
              <p style={{ color: theme.colors.state.error }}>小數點後數字將四捨五入至整數位</p>
            </div>
          </div>
          <FEIBButton
            type="submit"
            onClick={() => {
              showInfo(successMessage);
              history.push('/R00200');
            }}
          >
            確認
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_3;
