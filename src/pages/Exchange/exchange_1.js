import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import { FEIBButton } from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import BottomDrawer from 'components/BottomDrawer';
import { passwordValidation } from 'utilities/validation';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange1 = () => {
  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    ...passwordValidation,
  });
  const {
    handleSubmit, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNextStep = () => {
    setDrawerOpen(true);
  };

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    history.push('/exchange2');
  };

  useCheckLocation();
  usePageInfo('/api/exchange1');

  return (
    <ExchangeWrapper className="confirmPage">
      <div className="infoSection">
        <div className="label">轉出金額與轉入帳號</div>
        <div className="firstData">NTD$2806.00</div>
        <div className="firstData">USD$100.00</div>
        <div className="firstData">遠東商銀(805)</div>
        <div className="firstData">00200701715231</div>
        <div className="exchangeRate">換匯匯率 28.0520</div>
      </div>
      <div className="infoSection">
        <div className="secondData">
          <div className="left">轉出帳號</div>
          <div className="right">00200401715213</div>
        </div>
        <div className="secondData">
          <div className="left">換匯種類</div>
          <div className="right">台幣轉外幣</div>
        </div>
        <div className="secondData">
          <div className="left">轉換外幣幣別</div>
          <div className="right">美金 USD</div>
        </div>
        <div className="secondData">
          <div className="left">匯款性質分類</div>
          <div className="right">外匯互換兌入</div>
        </div>
        <Accordion className="exchangeAccordion" title="詳細交易" space="both" open>
          <div className="secondData">
            <div className="left">帳戶餘額</div>
            <div className="right">NTD$92.397</div>
          </div>
          <div className="secondData">
            <div className="left">備註</div>
            <div className="right">美金儲蓄</div>
          </div>
        </Accordion>
        <div className="confirmBtns">
          <ConfirmButtons
            mainButtonOnClick={handleNextStep}
            subButtonOnClick={() => history.push('/exchange')}
          />
        </div>
      </div>
      <BottomDrawer
        title="輸入網銀密碼"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        content={(
          <ExchangeWrapper style={{ marginTop: '0', padding: '0 1.6rem 4rem' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <PasswordInput
                label="網銀密碼"
                id="password"
                name="password"
                control={control}
                errorMessage={errors.password?.message}
              />
              <FEIBButton type="submit" style={{ marginTop: '1.6rem' }}>確認</FEIBButton>
            </form>
          </ExchangeWrapper>
        )}
      />
    </ExchangeWrapper>
  );
};

export default Exchange1;
