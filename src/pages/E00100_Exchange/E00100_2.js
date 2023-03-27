import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useNavigation } from 'hooks/useNavigation';
import { Func } from 'utilities/FuncID';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import Accordion from 'components/Accordion';
import ConfirmButtons from 'components/ConfirmButtons';
import InformationList from 'components/InformationList';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';

/* Styles */
import { ExchangeWrapper } from './E00100.style';

/**
 * 換匯結果頁
 * @param {{location: {state: {model, viewModel, viewData}}}} props
 */
const E001002 = (props) => {
  const { location } = props;
  const { state } = location;
  const { model, viewModel, viewData } = state;

  const history = useHistory();
  const { startFunc } = useNavigation();

  /**
   * 建構式，初始化
   */
  useEffect(() => {
  }, []);

  /**
   * 依轉出帳號幣別，切換至該幣別首頁。
   */
  const toAccountPage = () => {
    if (model.mode === 1) {
      // 新臺幣轉外幣 - 切換到台幣首頁。
      startFunc(Func.C003, { defaultAccount: model.outAccount });
    } else {
      // 新臺幣轉外幣 - 切換到外幣首頁，並指定預設的幣別。
      startFunc(Func.C004, { defaultCurrency: model.currency });
    }
  };

  /**
   * 返回換匯首頁。
   * @param {Boolean} cleanData 表示只保留部份欄位資料，清除轉入相關資訊。
   */
  const nextExchange = (cleanData) => {
    if (cleanData) {
      delete viewModel.outAccount;
      delete viewModel.outAmount;

      // model 只保留 mode, outAccount, currency
      delete model.inAccount;
      delete model.amount;
      delete model.amountType;
      delete model.property;
      delete model.memo;
    }

    history.replace('/E00100', { model, viewModel });
  };

  /**
   * 主頁面輸出
   */
  return (
    <Layout title="外幣換匯結果" goBack={false}>
      <ExchangeWrapper className="finishPage">
        <ResultAnimation
          isSuccess={viewData.result.isSuccess}
          subject={viewData.result.isSuccess ? '外幣換匯成功' : '外幣換匯失敗'}
          descHeader={viewData.result.errorCode}
          description={viewData.result.message}
        />
        <div className={`infoSection ${!viewData.result.isSuccess && 'resultFail'}`}>
          {viewData.result.isSuccess ? (
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

              <div className="priceNotiSetting" onClick={() => startFunc(Func.E004)}>
                外幣到價通知設定
              </div>
            </div>
          ) : (
            <FEIBButton onClick={() => nextExchange(false)}>確認</FEIBButton>
          )}
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

          <div className="confirmBtns">
            <ConfirmButtons
              mainButtonValue="查詢交易明細"
              subButtonValue="繼續換匯"
              mainButtonOnClick={toAccountPage}
              subButtonOnClick={() => nextExchange(true)}
            />
          </div>
        </div>
      </ExchangeWrapper>
    </Layout>
  );
};

export default E001002;
