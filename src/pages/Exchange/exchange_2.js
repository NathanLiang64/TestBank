import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import InformationList from 'components/InformationList';

/* Styles */
import doneCheck from 'assets/images/doneCheck.png';
import ExchangeWrapper from './exchange.style';

const Exchange1 = () => {
  const history = useHistory();

  const toTradeDetailPage = () => {
    history.push('depositInquiry');
  };

  useCheckLocation();
  usePageInfo('/api/exchange2');

  return (
    <ExchangeWrapper className="finishPage">
      <div className="infoSection">
        <img className="checkImg" src={doneCheck} alt="" />
        <div className="label">轉出金額與轉入帳號</div>
        <div className="firstData">NTD$2806.00</div>
        <div className="firstData">USD$100.00</div>
        <div className="firstData">遠東商銀(805)</div>
        <div className="firstData">00200701715231</div>
        <div className="exchangeRate">換匯匯率 28.0520</div>
      </div>
      <div className="infoSection">
        <InformationList title="轉出帳號" content="00200401715213" />
        <InformationList title="換匯種類" content="台幣轉外幣" />
        <InformationList title="轉換外幣幣別" content="美金 USD" />
        <InformationList title="匯款性質分類" content="外匯互換兌入" />
        <InformationList title="備註" content="美金儲蓄" />
        <Accordion className="exchangeAccordion" title="詳細交易" space="both" open>
          <InformationList title="帳戶餘額" content="NTD$92.397" />
          <InformationList title="備註" content="美金儲蓄" />
        </Accordion>
        <div className="confirmBtns">
          <ConfirmButtons
            mainButtonValue="查詢交易明細"
            subButtonValue="繼續換匯"
            mainButtonOnClick={toTradeDetailPage}
            subButtonOnClick={() => history.push('/exchange')}
          />
        </div>
      </div>
    </ExchangeWrapper>
  );
};

export default Exchange1;
