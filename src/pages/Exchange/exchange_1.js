// import { useState } from 'react';
import { useHistory } from 'react-router';

// import * as yup from 'yup';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
// import { FEIBButton } from 'components/elements';
// import PasswordInput from 'components/PasswordInput';
import Header from 'components/Header';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
// import BottomDrawer from 'components/BottomDrawer';
import InformationList from 'components/InformationList';
import CountDown from 'components/CountDown';
// import { passwordValidation } from 'utilities/validation';
import ExchangeNotice from './exchangeNotice';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange1 = () => {
  const history = useHistory();
  // /**
  //  *- 資料驗證
  //  */
  // const schema = yup.object().shape({
  //   ...passwordValidation,
  // });
  // const {
  //   handleSubmit, control, formState: { errors },
  // } = useForm({
  //   resolver: yupResolver(schema),
  // });

  // const [drawerOpen, setDrawerOpen] = useState(false);
  const isEmployee = true;

  const goBack = () => history.goBack();

  const handleNextStep = () => {
    history.push('/exchange2');
  };

  // const onSubmit = (data) => {
  //   console.log(data);
  //   history.push('/exchange2');
  // };

  return (
    <>
      <Header title="外幣換匯確認" goBack={goBack} />
      <ExchangeWrapper className="confirmPage">
        <div className="infoSection">
          <div className="mainBlock">
            <div className="countDownTitle">尚餘交易時間</div>
            <div>
              <CountDown
                minute={0.5}
                onEnd={goBack}
              />
            </div>
          </div>
          <div className="infoData">
            <div className="label">轉換外幣</div>
            <div className="foreignCurrency">USD$100.00</div>
            <div className="changeNT">折合台幣：NTD$2806.66</div>
            <div className="exchangeRate">換匯匯率：28.0520</div>
            {
              isEmployee && (<div className="employee">員工優惠匯率</div>)
            }
            <div className="label into">轉入帳號</div>
            <div className="accountData">遠東商銀(805)</div>
            <div className="accountData">00200701715231</div>
          </div>
        </div>
        <div className="infoSection">
          <div>
            <InformationList title="轉出帳號" content="00200401715213" />
            <InformationList title="換匯種類" content="台幣轉外幣" />
            <InformationList title="轉換外幣幣別" content="美金 USD" />
            <InformationList title="匯款性質分類" content="外匯互換兌入" />
          </div>
          <Accordion className="exchangeAccordion" title="詳細交易" space="both" open>
            <InformationList title="帳戶餘額" content="$92,397" />
            <InformationList title="備註" content="美金儲蓄" />
          </Accordion>
          <Accordion space="bottom">
            <ExchangeNotice />
          </Accordion>
          <div className="confirmBtns">
            <ConfirmButtons
              mainButtonOnClick={handleNextStep}
              subButtonOnClick={goBack}
            />
          </div>
        </div>
      </ExchangeWrapper>
    </>
  );
};

export default Exchange1;
