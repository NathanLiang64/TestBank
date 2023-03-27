/* eslint-disable no-use-before-define */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { Func } from 'utilities/FuncID';
import { getCurrenyInfo } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { create, execute } from 'pages/E00100_Exchange/api';

/* Elements */
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import InformationList from 'components/InformationList';
import CountDown from 'components/CountDown';

/* Styles */
import { ExchangeWrapper } from './E00100.style';
import { E00100Notice } from './E00100_Content';

/**
 * 換匯確認頁
 * @param {{location: {state: {viewModel, model}}}} props
 */
const E001001 = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const dispatch = useDispatch();
  const [viewData, setViewData] = useState({});

  /**
   * 建構式，初始化
   */
  useEffect(() => {
    const { viewModel, model } = state;
    console.log(state);

    dispatch(setWaittingVisible(true));

    // 取得換匯掛號資訊
    create(model).then((apiRs) => {
      if (!apiRs) {
        goBack(); // ISG0313-2 [目前時段未提供此幣別的報價]
        return;
      }

      // 執行外幣換匯、轉帳時的交易序號
      model.tfrId = apiRs.tfrId;
      viewModel.inAmount = apiRs.inAmount; // 估算兌換可得的轉入金額
      viewModel.outAmount = apiRs.outAmount; // 估算兌換所需的轉出金額

      const ccyInfo = getCurrenyInfo(model.currency);
      const data = {
        mode: model.mode,
        isBanker: viewModel.isBanker,
        inAccount: model.inAccount,
        outAccount: model.outAccount,
        transInDesc: `${(model.mode === 1) ? model.currency : 'NTD'}$${apiRs.inAmount}`,
        transOutDesc: `${(model.mode === 1) ? 'NTD' : model.currency}$${apiRs.outAmount}`,
        exRate: apiRs.exRate, // (model.mode === 1) ? Number((1.0 / exRate.SpotAskRate).toFixed(4)) : exRate.SpotBidRate, // TODO 買入、賣出
        currency: `${ccyInfo.name} ${ccyInfo.code}`,
        leglDesc: viewModel.properties[model.mode].find((p) => p.leglCode === model.property).leglDesc,
        balance: apiRs.balance,
        memo: model.memo,
        countdownSec: apiRs.countdown,
      };
      setViewData(data);
    }).finally(() => {
      dispatch(setWaittingVisible(false));
    });
  }, []);

  /**
   * 進入轉帳結果頁
   */
  const handleNextStep = async () => {
    const jsRs = await transactionAuth(Func.E001.authCode);
    if (jsRs.result) {
      dispatch(setWaittingVisible(true));

      execute(state.model.tfrId).then((apiRs) => {
        viewData.result = apiRs; // viewData 與結果頁共用。
        history.push('/E001002', {...state, viewData});
      }).finally(() => {
        dispatch(setWaittingVisible(false));
      });
    }
  };

  const goBack = () => history.replace('/E00100', state);

  /**
   * 主頁面輸出
   */
  return (
    <Layout title="外幣換匯確認" fid={Func.E001} goBackFunc={goBack} waitting={!viewData}>
      <ExchangeWrapper className="confirmPage">
        <div className="infoSection">
          <div className="mainBlock">
            <div className="countDownTitle">尚餘交易時間</div>
            <div>
              <CountDown
                seconds={viewData.countdownSec}
                onEnd={goBack} // TODO 時間到，是提醒，再重新取匯；Back動作讓使用者主動操作！
              />
            </div>
          </div>
          <div className="infoData">
            <div className="label">
              {`轉換${(viewData.mode === 1) ? '外幣' : '臺幣'}`}
            </div>
            <div className="foreignCurrency">
              {viewData.transInDesc}
            </div>
            <div className="changeNT">
              {`折合${(viewData.mode === 1) ? '臺幣' : '外幣'}：${viewData.transOutDesc}`}
            </div>
            <div className="exchangeRate">
              {`換匯匯率：${viewData.exRate}`}
            </div>
            {viewData.isBanker && (
              <div className="employee">員工優惠匯率</div>
            )}
            <div className="label into">轉入帳號</div>
            <div className="accountData">遠東商銀(805)</div>
            <div className="accountData">{viewData.inAccount}</div>
          </div>
        </div>

        <div className="infoSection">
          <div>
            <InformationList title="轉出帳號" content={viewData.outAccount} />
            <InformationList
              title="換匯種類"
              content={(viewData.mode === 1) ? '臺幣轉外幣' : '外幣轉臺幣'}
            />
            <InformationList title="轉換外幣幣別" content={viewData.currency} />
            <InformationList title="匯款性質分類" content={viewData.leglDesc} />
          </div>

          <Accordion className="exchangeAccordion" title="詳細交易" space="both" open>
            <InformationList title="帳戶餘額" content={viewData.balance} />
            <InformationList title="備註" content={viewData.memo} />
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
