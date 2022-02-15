/* eslint-disable no-unreachable */
import { useHistory } from 'react-router';
import { exchangeApi } from 'apis';

/* Elements */
import Header from 'components/Header';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import InformationList from 'components/InformationList';
import CountDown from 'components/CountDown';
import ExchangeNotice from './exchangeNotice';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange1 = ({ location }) => {
  const history = useHistory();
  const isEmployee = true;

  const goBack = () => history.goBack();

  const handleNextStep = async () => {
    console.log(location.state);
    let response;
    // 1: 台轉外
    if (location.state.trnsType === '1') {
      response = await exchangeApi.exchangeNtoF(location.state);
      console.log(response);
    }
    // 2: 外轉台
    if (location.state.trnsType === '2') {
      response = await exchangeApi.exchangeFtoN(location.state);
      console.log(response);
    }
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
                minute={location.state.countdownSec / 60}
                onEnd={goBack}
              />
            </div>
          </div>
          <div className="infoData">
            <div className="label">轉換外幣</div>
            <div className="foreignCurrency">
              {
                location.state.trnsType === '1' && (`${location.state.inCcyCd} $${location.state.inAmt}`)
              }
              {
                location.state.trnsType === '2' && (`${location.state.outCcyCd} $${location.state.outAmt}`)
              }
            </div>
            <div className="changeNT">
              折合台幣：NTD$
              { location.state.trnsType === '1' && location.state.outAmt }
              { location.state.trnsType === '2' && location.state.inAmt }
            </div>
            <div className="exchangeRate">
              換匯匯率：
              { location.state.rate }
            </div>
            {
              isEmployee && (<div className="employee">員工優惠匯率</div>)
            }
            <div className="label into">轉入帳號</div>
            {/* <div className="accountData">遠東商銀(805)</div> */}
            <div className="accountData">{ location.state.inAcct }</div>
          </div>
        </div>
        <div className="infoSection">
          <div>
            <InformationList title="轉出帳號" content={location.state.outAcct} />
            <InformationList title="換匯種類" content={location.state.trnsType === '1' ? '台幣轉外幣' : '外幣轉台幣'} />
            <InformationList title="轉換外幣幣別" content={location.state.trnsType === '1' ? `${location.state.inCcyName} ${location.state.inCcyCd}` : `${location.state.outCcyName} ${location.state.outCcyCd}`} />
            <InformationList title="匯款性質分類" content={location.state.leglDesc} />
          </div>
          <Accordion className="exchangeAccordion" title="詳細交易" space="both" open>
            {/* <InformationList title="帳戶餘額" content="$92,397" /> */}
            <InformationList title="備註" content={location.state.memo} />
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
