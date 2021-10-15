import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import { FEIBButton } from 'components/elements';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import InformationList from 'components/InformationList';

/* Styles */
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import ExchangeWrapper from './exchange.style';

const Exchange1 = () => {
  const history = useHistory();
  const isEmployee = true;
  const isSuccess = true;

  const toTradeDetailPage = () => {
    history.push('depositInquiry');
  };

  const toExchangePage = () => {
    history.push('/exchange');
  };

  const toPriceSettingPage = () => {
    history.push('/foreignCurrencyPriceSetting');
  };

  useCheckLocation();
  usePageInfo('/api/exchange2');

  return (
    <ExchangeWrapper className="finishPage">
      <div className={`infoSection  ${!isSuccess && 'resultFail'}`}>
        <div>
          <img className="stateImage" src={isSuccess ? SuccessImage : ErrorImage} alt="" />
          <div className={isSuccess ? 'stateContent success' : 'stateContent fail'}>
            {
              isSuccess ? '外幣換匯成功' : '外幣換匯失敗'
            }
          </div>
        </div>
        {
          isSuccess && (
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
              <div className="priceNotiSetting" onClick={toPriceSettingPage}>外幣到價通知設定</div>
            </div>
          )
        }
        {
          !isSuccess && (
            <FEIBButton onClick={toExchangePage}>確認</FEIBButton>
          )
        }
      </div>
      {
        isSuccess && (
          <div className="infoSection">
            <div>
              <InformationList title="轉出帳號" content="00200401715213" />
              <InformationList title="換匯種類" content="台幣轉外幣" />
              <InformationList title="轉換外幣幣別" content="美金 USD" />
              <InformationList title="匯款性質分類" content="外匯互換兌入" />
            </div>
            <Accordion className="exchangeAccordion" title="詳細交易" space="both" open>
              <InformationList title="帳戶餘額" content="NTD$92.397" />
              <InformationList title="備註" content="美金儲蓄" />
            </Accordion>
            <div className="confirmBtns">
              <ConfirmButtons
                mainButtonValue="查詢交易明細"
                subButtonValue="繼續換匯"
                mainButtonOnClick={toTradeDetailPage}
                subButtonOnClick={toExchangePage}
              />
            </div>
          </div>
        )
      }
    </ExchangeWrapper>
  );
};

export default Exchange1;
