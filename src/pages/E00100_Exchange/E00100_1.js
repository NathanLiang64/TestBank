/** @format */

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { exchangeNtoF, exchangeFtoN } from 'pages/E00100_Exchange/api';
import { toCurrency } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import InformationList from 'components/InformationList';
import CountDown from 'components/CountDown';

/* Styles */
import { AuthCode } from 'utilities/TxnAuthCode';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import ExchangeWrapper from './E00100.style';
import E00100Notice from './E00100_Notice';

const E001001 = ({ location }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [confirmData, setConfirmData] = useState({});

  const goBack = () => history.goBack();

  const handleNextStep = async () => {
    // const authCode = 0x30;
    const jsRs = await transactionAuth(AuthCode.E00100.F_TWD);
    if (jsRs.result) {
      // switchLoading(true);
      dispatch(setWaittingVisible(true));
      const param = { ...confirmData };
      delete param.outAccountAmount;
      let response;
      // 1: 台轉外
      if (confirmData?.trnsType === '1') {
        response = await exchangeNtoF(param);
      }
      // 2: 外轉台
      if (confirmData?.trnsType === '2') {
        response = await exchangeFtoN(param);
      }
      dispatch(setWaittingVisible(false));
      // switchLoading(false);
      history.push('/E001002', {
        ...response,
        memo: confirmData?.memo,
        bankerCd: confirmData?.bankerCd,
      });
    }
  };

  const generateAccountAmt = () => {
    const amount = Number(confirmData?.outAccountAmount) - Number(confirmData?.outAmt);
    const formatAmt = +`${Math.round(`${amount}e+2`)}e-2`;
    return toCurrency(formatAmt);
  };

  useEffect(() => {
    if (location?.state) {
      setConfirmData({ ...location?.state });
    }
  }, []);

  return (
    <Layout title="外幣換匯確認" goBackFunc={goBack}>
      <ExchangeWrapper className="confirmPage">
        <div className="infoSection">
          <div className="mainBlock">
            <div className="countDownTitle">尚餘交易時間</div>
            <div>
              <CountDown
                // minute={60}
                minute={location.state.countdownSec / 60}
                onEnd={goBack}
              />
            </div>
          </div>
          <div className="infoData">
            <div className="label">
              轉換
              {confirmData?.trnsType === '1' ? '外幣' : '臺幣'}
            </div>
            <div className="foreignCurrency">
              {`${confirmData?.inCcyCd} $${confirmData?.inAmt}`}
            </div>
            {/* prettier-ignore */}
            <div className="changeNT">
              折合
              {confirmData?.trnsType === '1' ? '臺幣' : '外幣'}
              ：
              {confirmData?.outCcyCd}
              $
              {confirmData?.outAmt}
            </div>
            <div className="exchangeRate">
              換匯匯率：
              {confirmData?.rate}
            </div>
            {confirmData?.bankerCd && (
              <div className="employee">員工優惠匯率</div>
            )}
            <div className="label into">轉入帳號</div>
            {/* <div className="accountData">遠東商銀(805)</div> */}
            <div className="accountData">{confirmData?.inAcct}</div>
          </div>
        </div>
        <div className="infoSection">
          <div>
            <InformationList title="轉出帳號" content={confirmData?.outAcct} />
            <InformationList
              title="換匯種類"
              content={
                confirmData?.trnsType === '1' ? '臺幣轉外幣' : '外幣轉臺幣'
              }
            />
            <InformationList
              title="轉換外幣幣別"
              content={
                confirmData?.trnsType === '1'
                  ? `${confirmData?.inCcyName} ${confirmData?.inCcyCd}`
                  : `${confirmData?.outCcyName} ${confirmData?.outCcyCd}`
              }
            />
            <InformationList
              title="匯款性質分類"
              content={confirmData?.leglDesc}
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
              content={`$${generateAccountAmt()}`}
            />
            <InformationList title="備註" content={confirmData?.memo} />
          </Accordion>
          <Accordion space="bottom">
            <E00100Notice />
          </Accordion>
          <div className="confirmBtns">
            <ConfirmButtons
              mainButtonOnClick={handleNextStep}
              subButtonOnClick={goBack}
            />
          </div>
        </div>
      </ExchangeWrapper>
    </Layout>
  );
};

export default E001001;
