/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { accountFormatter, currencySymbolGenerator, dateToString } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showError } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';

/* Elements */
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

/* Styles */
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import ForeignCurrencyTransferWrapper from './D00700.style';
import { createTransfer, executeTransfer } from './api';

/**
 * 外幣轉帳 確認頁
 * @param {{location: {state: {viewModel, model}}}} props
 */
const D00700_1 = (props) => {
  const { location: {state} } = props;
  const { model, viewModel } = state;
  console.log(model, viewModel);

  const history = useHistory();
  const dispatch = useDispatch();
  const [viewData] = useState({
    isSuccess: null, // 執行完轉帳API後才會有值。
    outAccount: accountFormatter(model.inAccount, true),
    inAccount: accountFormatter(model.outAccount, true),
    balance: `${currencySymbolGenerator(model.currency, viewModel.outAccount.balance)}`,
    amount: currencySymbolGenerator(model.currency, model.amount),
    property: viewModel.properties.find(({value}) => value === model.property).label,
    transData: dateToString(new Date()),
    memo: model.memo,
  });

  // /**
  //  * 初始化
  //  */
  // useEffect(() => {
  //   viewData.outAccount = accountFormatter(model.inAccount, true);
  //   viewData.inAccount = accountFormatter(model.outAccount, true);
  //   // const {balance} = viewModel.currencyList.find((item) => item.currency === model.currency)
  //   viewData.balance = `${currencySymbolGenerator(model.currency, viewModel.outAccount.balance)}`;
  //   viewData.amount = currencySymbolGenerator(model.currency, model.amount);
  //   viewData.property = viewModel.properties.find(({value}) => value === model.property).label;
  // }, []);

  /**
   * 確認進行轉帳
   */
  const doConfirm = async () => {
    // 建立轉帳交易紀錄
    const apiRs = await createTransfer(model);
    if (apiRs.result) {
      // 進行交易驗證，要求使用者輸入OTP、密碼、雙因子...等。
      const auth = await transactionAuth(Func.D007.authCode);
      if (auth.result) {
        // 執行轉帳交易
        dispatch(setWaittingVisible(true));
        // TODO 顯示交易授權中，請稍候...
        const executeRs = await executeTransfer(apiRs.tfrId);
        console.log('==> 轉帳執行結果：', executeRs); // DEBUG
        dispatch(setWaittingVisible(false));

        if (executeRs.isSuccess) {
          viewModel.transOut.balance = executeRs.balance; // 更新 餘額
          viewData.balance = executeRs.balance;
        }

        viewData.isSuccess = executeRs.isSuccess;

        history.push('/D007002', {...state, viewData});
        return;
      }
    }

    // 顯示失敗原因，並回到前一頁；若是嚴重錯誤，會在 axios 就處理掉了。
    await showError(apiRs.message, goBack);
  };

  const goBack = () => {
    history.replace('D00700', state);
  };

  /**
   * 主頁面輸出
   */
  return (
    <Layout title="外幣轉帳確認" fid={Func.D007} goBackFunc={goBack}>
      <ForeignCurrencyTransferWrapper className="confirmAndResult">
        <div className="confrimDataContainer lighterBlueLine">
          <div className="dataLabel">轉出金額與轉入帳號</div>
          <div className="balance">{viewData.amount}</div>
          <div className="accountInfo">遠東商銀(805)</div>
          <div className="accountInfo">{viewData.outAccount}</div>
        </div>
        <div className="infoListContainer">
          <div>
            <InformationList title="轉出帳號" content={viewData.inAccount} />
            <InformationList title="帳戶餘額" content={viewData.balance} />
            <InformationList title="日期" content={viewData.transData} />
            <InformationList title="匯款性質分類" content={viewData.property} />
            <InformationList title="備註" content={viewData.memo} />
          </div>
          <div className="btnContainer">
            <FEIBButton onClick={doConfirm}>確認</FEIBButton>
            <div className="warnText">轉帳前多思考，避免被騙更苦惱</div>
          </div>
        </div>
      </ForeignCurrencyTransferWrapper>
    </Layout>
  );
};

export default D00700_1;
