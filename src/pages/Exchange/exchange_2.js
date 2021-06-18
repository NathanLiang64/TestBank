import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';

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
        <div className="secondData">
          <div className="left">備註</div>
          <div className="right">美金儲蓄</div>
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
        <ConfirmButtons
          mainButtonValue="查詢交易明細"
          subButtonValue="繼續換匯"
          mainButtonOnClick={toTradeDetailPage}
          subButtonOnClick={() => history.push('/exchange')}
        />
      </div>
    </ExchangeWrapper>
  );
};

export default Exchange1;
