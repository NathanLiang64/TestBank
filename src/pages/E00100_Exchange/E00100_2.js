/** @format */

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { getCurrenyInfo } from 'utilities/Generator';

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
  const {state} = location;
  const history = useHistory();

  const [isSuccess, setIsSuccess] = useState(true);
  const [exchangeResult] = useState(state);

  const toTradeDetailPage = () => {
    history.push('/taiwanDollarAccountDetails');// TODO: 此頁尚無funcID
  };

  const toExchangePage = () => {
    history.push('/E00100');
  };

  const toPriceSettingPage = () => {
    history.push('/foreignCurrencyPriceSetting'); // TODO: 此頁尚無funcID
  };

  useEffect(() => {
    if (location?.state.code) { // ??? 有 Code 就是 失敗？
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
          {isSuccess && exchangeResult && (
            <div className="infoData">
              <div className="label">
                轉換
                {exchangeResult.trnsType === '1' ? '外幣' : '臺幣'}
              </div>
              {/* prettier-ignore */}
              <div className="foreignCurrency">
                {exchangeResult.inCcyCd}
                $
                {exchangeResult.inAmt}
              </div>
              {/* prettier-ignore */}
              <div className="changeNT">
                折合
                {exchangeResult.trnsType === '1' ? '臺幣' : '外幣'}
                ：
                {exchangeResult.outCcyCd}
                $
                {exchangeResult.outAmt}
              </div>
              <div className="exchangeRate">
                換匯匯率：
                {exchangeResult.rate}
              </div>
              {exchangeResult.isEmployee && (
                <div className="employee">員工優惠匯率</div>
              )}
              <div className="label into">轉入帳號</div>
              {/* <div className="accountData">遠東商銀(805)</div> */}
              <div className="accountData">{exchangeResult.inAcct}</div>
              <div className="priceNotiSetting" onClick={toPriceSettingPage}>
                外幣到價通知設定
              </div>
            </div>
          )}
          {!isSuccess && <FEIBButton onClick={toExchangePage}>確認</FEIBButton>}
        </div>
        {isSuccess && exchangeResult && (
          <div className="infoSection">
            <div>
              <InformationList
                title="轉出帳號"
                content={exchangeResult.outAcct}
              />
              <InformationList
                title="換匯種類"
                content={
                  exchangeResult.trnsType === '1' ? '臺幣轉外幣' : '外幣轉臺幣'
                }
              />
              <InformationList
                title="轉換外幣幣別"
                content={`${getCurrenyInfo(exchangeResult.trfCcyCd)?.name} ${
                  exchangeResult.trfCcyCd
                }`}
              />
              <InformationList
                title="匯款性質分類"
                content={exchangeResult.leglDesc}
              />
            </div>
            <Accordion
              className="exchangeAccordion"
              title="詳細交易"
              space="both"
              open
            >
              <InformationList
                title="帳戶餘額"
                content={`$${exchangeResult.avBal}`}
              />
              <InformationList title="備註" content={exchangeResult.memo} />
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
