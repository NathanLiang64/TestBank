/** @format */

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { currencyZhGenerator } from 'utilities/Generator';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import InformationList from 'components/InformationList';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';

/* Styles */
import ExchangeWrapper from './E00100.style';

const E001002 = ({ location }) => {
  const history = useHistory();
  const [isSuccess, setIsSuccess] = useState(true);
  const [exchangeResult, setExchangeResult] = useState({});

  const toTradeDetailPage = () => {
    history.push('/taiwanDollarAccountDetails');
  };

  const toExchangePage = () => {
    history.push('/E00100');
  };

  const toPriceSettingPage = () => {
    history.push('/foreignCurrencyPriceSetting');
  };

  useEffect(() => {
    if (location?.state) {
      setExchangeResult({ ...location.state });
    }
    if (location?.state.code) {
      setIsSuccess(false);
    }
  }, []);

  return (
    <Layout title="外幣換匯結果" goBack={false}>
      <ExchangeWrapper className="finishPage">
        <div className={`infoSection  ${!isSuccess && 'resultFail'}`}>
          <SuccessFailureAnimations
            isSuccess={isSuccess}
            successTitle="外幣換匯成功"
            errorTitle="外幣換匯失敗"
          />
          {isSuccess && (
            <div className="infoData">
              <div className="label">
                轉換
                {exchangeResult?.trnsType === '1' ? '外幣' : '台幣'}
              </div>
              {/* prettier-ignore */}
              <div className="foreignCurrency">
                {exchangeResult?.inCcyCd}
                $
                {exchangeResult?.inAmt}
              </div>
              {/* prettier-ignore */}
              <div className="changeNT">
                折合
                {exchangeResult?.trnsType === '1' ? '台幣' : '外幣'}
                ：
                {exchangeResult?.outCcyCd}
                $
                {exchangeResult?.outAmt}
              </div>
              <div className="exchangeRate">
                換匯匯率：
                {exchangeResult?.rate}
              </div>
              {exchangeResult?.bankerCd && <div className="employee">員工優惠匯率</div>}
              <div className="label into">轉入帳號</div>
              {/* <div className="accountData">遠東商銀(805)</div> */}
              <div className="accountData">{exchangeResult?.inAcct}</div>
              <div className="priceNotiSetting" onClick={toPriceSettingPage}>
                外幣到價通知設定
              </div>
            </div>
          )}
          {!isSuccess && <FEIBButton onClick={toExchangePage}>確認</FEIBButton>}
        </div>
        {isSuccess && (
          <div className="infoSection">
            <div>
              <InformationList title="轉出帳號" content={exchangeResult?.outAcct} />
              <InformationList
                title="換匯種類"
                content={exchangeResult?.trnsType === '1' ? '台幣轉外幣' : '外幣轉台幣'}
              />
              <InformationList
                title="轉換外幣幣別"
                content={`${currencyZhGenerator(exchangeResult?.trfCcyCd)} ${exchangeResult?.trfCcyCd}`}
              />
              <InformationList title="匯款性質分類" content={exchangeResult?.leglDesc} />
            </div>
            <Accordion className="exchangeAccordion" title="詳細交易" space="both" open>
              <InformationList title="帳戶餘額" content={`$${exchangeResult?.avBal}`} />
              <InformationList title="備註" content={exchangeResult?.memo} />
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
        )}
      </ExchangeWrapper>
    </Layout>
  );
};

export default E001002;
