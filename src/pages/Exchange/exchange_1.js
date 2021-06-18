import { useHistory } from 'react-router';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import ExchangeNotice from './exchangeNotice';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange1 = () => {
  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    password: yup
      .string()
      .required('請輸入網銀密碼'),
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <ExchangeWrapper>
      <section>
        <div className="formAreaTitle">
          <h2>資料確認</h2>
        </div>
      </section>
      <table>
        <tbody>
          <tr>
            <td>換匯種類</td>
            <td>台幣轉外幣</td>
          </tr>
          <tr>
            <td>轉出帳號</td>
            <td>
              <div>00200401715213</div>
              <div>可用餘額NTD$92.397</div>
            </td>
          </tr>
          <tr>
            <td>轉換外幣幣別</td>
            <td>美金USD</td>
          </tr>
          <tr>
            <td>轉帳金額</td>
            <td>希望轉入USD$100.00</td>
          </tr>
          <tr>
            <td>換匯匯率</td>
            <td>28.0520</td>
          </tr>
          <tr>
            <td>折算後金額</td>
            <td>NTD$2,806.00</td>
          </tr>
          <tr>
            <td>轉入帳號</td>
            <td>00200701715231</td>
          </tr>
          <tr>
            <td>匯款性質分類</td>
            <td>外匯互換兌入</td>
          </tr>
          <tr>
            <td>附註</td>
            <td />
          </tr>
        </tbody>
      </table>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PasswordInput
          label="網銀密碼"
          id="password"
          name="password"
          control={control}
          errorMessage={errors.password?.message}
        />
        <Accordion space="both">
          <ExchangeNotice />
        </Accordion>
        <ConfirmButtons
          subButtonOnClick={() => history.push('/exchange')}
        />
      </form>
    </ExchangeWrapper>
  );
};

export default Exchange1;
